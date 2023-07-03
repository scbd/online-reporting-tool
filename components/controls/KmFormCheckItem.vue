<template>
    <CFormCheck v-bind="attrs" @click="onCheck" :checked="modelValue === attrs.value" 
        :label="label" />  
</template>
<script lang="ts" setup>

import { isBoolean } from 'lodash';

const attrs = useAttrs()
const emit = defineEmits(['update:modelValue',])
const props = defineProps({
    modelValue: {},
    label     : {type:String, required:true },
})

const onCheck = ($evt:any)=>{
    //TODO: convert true/false number to native types
    let value = $evt.target.value;
    if(isBoolean(value)){
        value = value == 'true' ? true : false
    }
    console.log(value)
    emit('update:modelValue', value)
}

</script>
