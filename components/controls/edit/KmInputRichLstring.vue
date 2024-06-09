<template>
  <div :id="`km-rich-lstring-${uid}`"> 
    <CNav variant="tabs" role="tablist">
      <CNavItem v-for="locale in locales" :key="locale" :id="`lstringTab-${uid}`">
        <CNavLink
          href="javascript:void(0);" :active="selectedLocale === locale" @click="onTabChange(locale)">
          <!-- <CTooltip :content="lstring(getTerm(locale).title)" trigger="hover">
                <template #toggler="{ on }">
                    <span v-on="on">{{locale.toUpperCase()}}</span>
                </template>
            </CTooltip> -->
            {{lstring(getTerm(locale).title||locale)}}
            <strong v-if="locales?.length > 1" >
              <CTooltip :content="`${t('wordCount')} ${getWordCount(locale)}`" trigger="hover">
                  <template #toggler="{ on }">
                      <span v-on="on">
                        ({{ getWordCount(locale) }})
                      </span>
                  </template>
              </CTooltip>
            </strong>
        </CNavLink>
      </CNavItem>
    </CNav>
    <CTabContent>
      <CTabPane role="tabpanel" :aria-labelledby="`tabContent-${locale}-${uid}`" v-for="locale in locales" :key="locale" 
        :visible="selectedLocale === locale" :id="`lstringTabContent-${uid}`">       
        <km-ck-editor v-if="selectedLocale==locale" v-model="binding[selectedLocale]" :identifier="identifier"
            :locale="selectedLocale" @update:modelValue="onChange" @onFileUpload="onFileUpload"
            @on-word-count-change="onOnWordCountChange"></km-ck-editor>     
      </CTabPane>
    </CTabContent>
  </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/KmInputRichLstring.json"></i18n>
<script>
import $ from 'jquery';
import { makeUid } from '@coreui/utils/src'
import {without} from 'lodash';
import KmCkEditor from './KmCkEditor.vue'
import { useThesaurusStore }    from '@/stores/thesaurus';
import { useUserPreferencesStore }    from '@/stores/userPreferences';

export default {
  name: "KmRichLstring",
  components: {
    KmCkEditor
  },
  props: {
    locales: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Object,
      required: false,
      default(){
        return {}
      }
    },
    disabled: {
      type: Boolean,
      required: false,
    },
    identifier: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
        activeLocale : '',
        uid : makeUid(),
        tabPaneActiveKey:1,
        userPreferencesStore : useUserPreferencesStore(),
        wordCount:{}
    };
  },
  watch:{
    locales : function(newVal, oldVal){
        const deleted = without(oldVal, ...newVal)
        if(deleted?.length){      
            deleted.forEach(e=>{
                this.binding[e] = undefined;
            })
            this.onChange();
        }
        if(!newVal.includes(this.activeLocale)){        
            this.onTabChange(newVal[0]);
        }
        this.loadLanguages()
    }
  },
  setup(props) {
    const {t} = useI18n();

    return {
      t
    };
  },
  computed:{
    userLocales : {
      get(){
        return this.locales
      },
    },
    binding: {
      get() {
        return this.modelValue||{};
      },
    },
    selectedLocale : {
        get(){
            // if(this.locales.includes(this.userPreferencesStore.editorActiveLanguageTab ))
            //     return this.userPreferencesStore.editorActiveLanguageTab ;
            return this.activeLocale;
        }
    }
  },
  methods: { 
    onChange(value){
        const clean = useKmStorage().cleanDocument({...this.binding});
        this.$emit('update:modelValue', clean);
    },
    onFileUpload({file}){
        this.$emit('onFileUpload', {file, locale : this.activeLocale});
    },
    loadLanguages(){
        const thesaurusStore    = useThesaurusStore ();
        this.locales?.forEach(e=>{
            thesaurusStore.loadTerm(`lang-${e}`);
        });            
    },

    getTerm(term){

        const thesaurusStore    = useThesaurusStore ();
        return thesaurusStore.getTerm(`lang-${term}`)||{};
    },
    onTabChange(locale){
        this.activeLocale = locale;
        // console.log(locale)
        // setTimeout(() => {
            this.userPreferencesStore.setEditorActiveLanguageTab(locale);
        // }, 1000);
    },
    onOnWordCountChange(wordCount){
      this.wordCount[this.selectedLocale] = wordCount
    },
    getWordCount(locale){
      if(!this.locales?.length)
        return 0;

      if(this.wordCount[locale] > 0)
        return this.wordCount[locale];

      if(this.binding[locale]?.length){
        const text = $(this.binding[locale]).text()
        return text?.split(/\s+/)?.length || 0;
      }
      return 0;
    }
  },
  mounted(){
    
    const { locale} = useI18n();
    if(this.locales?.find(e=>e==locale.value))
      this.activeLocale = locale.value;
    else
      this.activeLocale = this.locales[0];

    if(this.modelValue){
        this.binding = {...this.modelValue||{}};
    }
    this.loadLanguages();
  },
  emits:['update:modelValue', 'onFileUpload']
};
</script>
