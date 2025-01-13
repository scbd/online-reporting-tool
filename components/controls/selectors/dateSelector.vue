<template>    
    <input v-model="model" :type="type" /> 
</template>

<script setup lang="ts">
//@ts-nocheck
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