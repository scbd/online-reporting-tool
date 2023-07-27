<template>
  <div :id="`km-rich-lstring-${uid}`">   
    <CNav variant="tabs" role="tablist">
      <CNavItem v-for="locale in locales" :key="locale" :id="`lstringTab-${uid}`">
        <CNavLink
          href="javascript:void(0);" :active="activeLocale === locale" @click="() => {activeLocale = locale}">
          {{ locale.toUpperCase() }}
        </CNavLink>
      </CNavItem>
    </CNav>
    <CTabContent>
      <CTabPane role="tabpanel" :aria-labelledby="`tabContent-${locale}-${uid}`" v-for="locale in locales" :key="locale" 
        :visible="activeLocale === locale" :id="`lstringTabContent-${uid}`">       
        <km-ck-editor v-if="activeLocale==locale" v-model="binding[activeLocale]" :locale="activeLocale"></km-ck-editor>     
      </CTabPane>
    </CTabContent>
  </div>
</template>

<script>
import $ from 'jquery';
import { makeUid } from '@coreui/utils/src'
// import { Tab } from 'bootstrap'
import KmCkEditor from './KmCkEditor.vue'

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
  },
  data() {
    return {
      activeLocale : '',
      uid : makeUid(),
      tabPaneActiveKey:1
    };
  },
  watch:{
    locales : function(newVal){
      if(!newVal.includes(this.activeLocale)){        
        this.activeLocale = newVal[0];
      }
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
      set(value) {
        const clean = useStorage().cleanDocument({...value});
        this.$emit('update:modelValue', clean);
      }
    }
  },
  methods: {  },
  mounted(){
    
    this.activeLocale = this.locales[0];

    if(this.modelValue){
      this.binding = {...this.modelValue||{}};
    }
  }
};
</script>
