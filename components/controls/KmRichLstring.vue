<template>
  <div>    
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item" role="presentation" v-for="locale in locales" :key="locale">
        <button class="nav-link" :id="`${locale}-tab`" :class="{'active': locale == activeLocale}" 
        data-bs-toggle="tab" :data-bs-target="`#tabContent_${locale}`" type="button" @click="onTabActivate(locale)"
          role="tab" :aria-controls="`${locale}`" aria-selected="true">{{ locale.toUpperCase() }}</button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <div class="tab-pane fade" :class="{'active': locale == activeLocale}" 
        v-for="locale in locales" :key="locale" :id="`tabContent_${locale}`" role="tabpanel" :aria-labelledby="`${locale}-tab`">   
          <km-editor v-if="activeLocale==locale" v-model="binding[activeLocale]" :locale="activeLocale"></km-editor>         
      </div>  
    </div>
  </div>
</template>

<script>
import { removeEmpty } from '@/util';
import $ from 'jquery';
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
      activeLocale : ''
    };
  },
  watch:{
    locales : function(newVal){
      if(!newVal.includes(this.activeLocale)){
        console.log(newVal)
        this.activeLocale = newVal[0];
        setTimeout(()=>{
          $('#tabContent_'+this.activeLocale).addClass('show')
        }, 100);
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
  },
  mounted(){
    
    this.activeLocale = this.locales[0];
    //TODO : revisit, using jqyery because below code is not working
    setTimeout(()=>{
    //   var someTabTriggerEl = document.querySelector('#tabContent_'+this.activeLocale)
    //   var tab = new Tab(someTabTriggerEl)
    //   tab.show()
      $('#tabContent_'+this.activeLocale).addClass('show')
    }, 200)

    if(this.value){
      this.binding = {...this.value||{}};
    }
  }
};
</script>
