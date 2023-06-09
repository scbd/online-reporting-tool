<template>
    <VueMultiselect
      v-model="selectItems"
      :label="label"
      :track-by="trackBy"
      :placeholder="placeholder"
      :open-direction="openDirection"
      :options="options"
      :group-values="groupValues"
      :group-label="groupLabel"
      :group-select="groupSelect"
      :multiple="multiple"
      :clear-on-select="clearOnSelect"
      :close-on-select="closeOnSelect"      
      :searchable="searchable"
      :disabled="disabled"
      @search-change="onEventTextChange"
      @update:model-value="$emit('change', $event)"
      :custom-label="customLabel"
      :allow-empty="allowEmpty"
      deselect-label="Can't remove this value"
    > 
      <slot name="clear">
        <template slot="clear">
          <div
            v-if="selectItems.length && !disabled"
            class="multiselect__clear"
            @mousedown.prevent.stop="selectItems = null; $emit('change', null)"
          />
        </template>
      </slot>     
    </VueMultiselect>
</template>

<script>  

import VueMultiselect from 'vue-multiselect';
import { asArray } from '@/util';
import { isEqual } from 'lodash'

export default {
  name      : 'KmSelect',
  components: { VueMultiselect },
  props     : {
    modelValue: {
      type    : [ String, Array, Object ],
      required: true,
      default() {
        return [];
      },
    },
    options      : { type: Array, required: true },
    multiple     : { type: Boolean, default: false },
    trackBy      : { type: String },
    label        : { type: String },
    valueKey     : { type: String, required: true},
    searchable   : { type: Boolean, default: true },
    clearOnSelect: { type: Boolean, default: true },
    placeholder  : { type: String,  default: 'Select option' },
    closeOnSelect: { type: Boolean, default: true },
    customLabel  : {
      type: Function,
      default (option, label) {
        // if (isEmpty(option)) return ''
        return label ? option[label] : option
      }
    },
    customSelectedItem  : {
      type: Function,
      default (item) {
        return item;
      }
    },
    groupValues  : { type: String },
    groupLabel   : {  type: String },
    groupSelect  : {  type: Boolean, default: false },
    openDirection: { type: String, default: 'below' },
    isValid      : {
      type   : [ Boolean, Function ],
      default: null,
    },
    disabled    : { type: Boolean, default: false },
    allowEmpty  : { type: Boolean, default: true },
  },
  data(){
    return {
    }
  },
  computed: {
    selectItems: {
      get() {
        return asArray(this.modelValue).map((value) => {
          return this.options?.find((option) => {
            const customSelectedItem = this.customSelectedItem(option[this.valueKey], option);
            
            return isEqual(customSelectedItem, value);
          })
        });
      },
      set(events) {
        let ids = asArray(events).map((event) => this.customSelectedItem(event[this.valueKey], event));
        
        this.$emit('update:model-value', this.multiple ? ids : ids[0]);
      },
    }
  },
  methods: {
    onEventTextChange: (...args)=>{
      this.$emit('search-change', ...args)
    },
    fetchOptions(){
      this.options = this.optionsFn();
    }    
  },
  mounted(){
    
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>