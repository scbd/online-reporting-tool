<template>
    <span v-if="useSecurity().role.isAdministrator()">
        {{ attrs }}, {{ modelValue }}, {{ attrs.value }} {{ modelValue == attrs.value }}
    </span>
    <CFormCheck :inline="attrs.inline" :type="attrs.type" 
        :name="attrs.name"  :for="attrs.for" 
        :id="attrs.id" :value="attrs.value"  
        @click="onCheck" 
        :checked="modelValue == attrs.value" 
        :label="label" />  
</template>
<script lang="ts" setup>

const attrs = useAttrs()
const emit = defineEmits(['update:modelValue',])
const props = defineProps({
    modelValue: {},
    label     : {type:String, required:true },
})

const onCheck = ($evt:any)=>{
    //TODO: convert true/false number to native types
    let value = $evt.target.value;
    if(['true', 'false'].includes(value)){
        value = value == 'true' ? true : false
    }
    emit('update:modelValue', value)
}

</script>
