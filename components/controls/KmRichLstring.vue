<template>
  <div :id="`km-rich-lstring-${uid}`">    
    <ul class="nav nav-tabs" :id="`lstringTab-${uid}`" role="tablist">
      <li class="nav-item" role="presentation" v-for="locale in locales" :key="locale">
        <button class="nav-link" :id="`${locale}-tab-${uid}`" :class="{'active': locale == activeLocale}" 
        data-bs-toggle="tab" :data-bs-target="`#tabContent-${locale}-${uid}`" type="button" @click="onTabActivate(locale)"
          role="tab" :aria-controls="`${locale}`" aria-selected="true">{{ locale.toUpperCase() }}</button>
      </li>
    </ul>
    <div class="tab-content" :id="`lstringTabContent-${uid}`">
      <div class="tab-pane fade" :class="{'active': locale == activeLocale}" 
        v-for="locale in locales" :key="locale" :id="`tabContent-${locale}-${uid}`" role="tabpanel" 
          :aria-labelledby="`${locale}-tab-${uid}`">   
          <km-editor v-if="activeLocale==locale" v-model="binding[activeLocale]" :locale="activeLocale"></km-editor>         
      </div>  
    </div>
  </div>
</template>

<script>
import { removeEmpty } from '@/util';
import $ from 'jquery';
import { makeUid } from '@coreui/utils/src'
// import { Tab } from 'bootstrap'
import KmEditor from './ck-editor.vue'

export default {
  name: "KmRichLstring",
  components: {
    KmEditor
  },
  props: {
    locales: {
      type: Array,
      required: true,
    },
    value: {
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
      uid : makeUid()
    };
  },
  watch:{
    locales : function(newVal){
      if(!newVal.includes(this.activeLocale)){        
        this.activeLocale = newVal[0];
        this.showTab();
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
        return this.value||{};
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    onTabActivate(locale){      
        this.activeLocale = locale;
    },
    showTab(){
      setTimeout(()=>{
        $(this.$el.querySelector(`#tabContent-${this.activeLocale}-${this.uid}`)).addClass('show')
      }, 200)
    }
  },
  mounted(){
    
    this.activeLocale = this.locales[0];
    //TODO : revisit, using jquery because below code is not working
    //   var someTabTriggerEl = document.querySelector('#tabContent_'+this.activeLocale)
    //   var tab = new Tab(someTabTriggerEl)
    //   tab.show()
    this.showTab();

    if(this.value){
      this.binding = {...this.value||{}};
    }
  }
};
</script>
