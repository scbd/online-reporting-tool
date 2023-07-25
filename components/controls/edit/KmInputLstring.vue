<template>
  <div :id="`${useAttrs().id || 'km-input-lstring-'+uid}`" class="km-input mb-2">   
    <slot></slot>    
    <CInputGroup class="mb-1" v-for="locale in locales" :key="locale" :class="`km-input-${locale}`" >
      <CFormInput aria-describedby="basic-addon2" v-model="binding[locale]" :dir="locale=='ar' ? 'rtl' : 'ltr'" />
      <CInputGroupText id="basic-addon2">{{locale.toUpperCase()}}</CInputGroupText>
    </CInputGroup>    
  </div>
</template>

<script>
import { makeUid } from '@coreui/utils/src'
import {without} from 'lodash';

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
      uid : makeUid()
    };
  },
  watch:{
    locales : function(newVal, oldVal){
      console.log(newVal)
      const deleted = without(oldVal, ...newVal)
      if(deleted?.length){      
        this.binding[deleted[0]] = undefined;
        this.$emit('update:modelValue', this.binding);
      }
    }
  },
  computed:{
    userLocales : {
      get(){
        return this.locales
      }
    },
    binding: {
      get() {
        return this.modelValue||{};
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {  },
  mounted(){        
    this.binding = {...this.modelValue||{}};
  }
};
</script>
