<template>
  <div :id="`${useAttrs().id || 'km-input-lstring-'+uid}`" class="km-input mb-2">   
    <slot></slot>    
    <CInputGroup class="mb-1" v-for="locale in locales" :key="locale" :class="`km-input-${locale}`" >
      <CFormInput v-bind="useAttrs()" aria-describedby="basic-addon2"/>
      <CInputGroupText id="basic-addon2">{{locale.toUpperCase()}}</CInputGroupText>
    </CInputGroup>    
  </div>
</template>

<script>
import { removeEmpty } from '@/util';
import { makeUid } from '@coreui/utils/src'


export default {
  name: "KmInputLstring",
  components: {
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
        console.log(value)
        this.$emit('update:modelValue', value);
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
