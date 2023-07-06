<template>
    <CButtonGroup role="group" aria-label="Document locales">
        <CButton color="primary" v-for="locale in locales" :active="locale==modelValue" :key="locale"
            @click="onLocaleSelected(locale)">
            {{ locale.toUpperCase() }}
        </CButton>
    </CButtonGroup>
</template>

<script setup lang="ts">
    const props = defineProps({
        modelValue  : {type:String, required:true },
        locales     : {type:Array, required:true },
    })
    
    const $emit = defineEmits(['update:modelValue']);
    const { modelValue, locales } = toRefs(props);

    const onLocaleSelected = (locale)=>{
       $emit('update:modelValue', locale);
    }
</script>

<style scoped>

</style>