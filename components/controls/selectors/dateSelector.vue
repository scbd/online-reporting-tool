<template>    
    <input v-model="model" :type="type" /> 
</template>

<script setup>
    const model = defineModel();    
    const props = defineProps({
        type:{
            type:String,
            default:"date",
            validator(value) { 
                return ['date', 'month'].includes(value)
            }
        }   
    });
</script>