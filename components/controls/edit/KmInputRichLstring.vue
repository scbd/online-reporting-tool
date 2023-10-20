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
        </CNavLink>
      </CNavItem>
    </CNav>
    <CTabContent>
      <CTabPane role="tabpanel" :aria-labelledby="`tabContent-${locale}-${uid}`" v-for="locale in locales" :key="locale" 
        :visible="selectedLocale === locale" :id="`lstringTabContent-${uid}`">       
        <km-ck-editor v-if="selectedLocale==locale" v-model="binding[selectedLocale]" :identifier="identifier"
            :locale="selectedLocale" @onChange="onChange"></km-ck-editor>     
      </CTabPane>
    </CTabContent>
  </div>
</template>

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
        userPreferencesStore : useUserPreferencesStore()
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
            if(this.locales.includes(this.userPreferencesStore.editorActiveLanguageTab ))
                return this.userPreferencesStore.editorActiveLanguageTab ;
            return this.activeLocale;
        }
    }
  },
  methods: { 
    onChange(value){
        const clean = useKmStorage().cleanDocument({...this.binding});
        this.$emit('update:modelValue', clean);
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
        this.userPreferencesStore.setEditorActiveLanguageTab(locale);
    }
  },
  mounted(){
    
    this.activeLocale = this.locales[0];

    if(this.modelValue){
        this.binding = {...this.modelValue||{}};
    }
    this.loadLanguages();
  }
};
</script>
