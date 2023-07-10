<template>
    <CButtonGroup role="group" aria-label="Document locales">
        <CButton color="primary" v-for="locale in locales" :active="locale==modelValue" :key="locale"
            @click="onLocaleSelected(locale)">
            {{ locale.toUpperCase() }}
        </CButton>
    </CButtonGroup>
</template>

<script setup lang="ts">

    const { locale } = useI18n();
    const props = defineProps({
        modelValue  : {type:String, required:true },
        locales     : {type:Array, required:true },
    })
    
    const $emit = defineEmits(['update:modelValue']);
    const { modelValue, locales } = toRefs(props);

    const onLocaleSelected = (locale:string)=>{
       $emit('update:modelValue', locale);
    }
    
    onMounted(()=>setDefaultLcoale(locales.value))
    watch(locales, (languages)=>{
        setDefaultLcoale(languages)
    })

    function setDefaultLcoale(languages){
        console.log(languages)
        if(languages?.length){
            if(languages.length == 1)
                onLocaleSelected(languages[0]);
            else if(languages.includes(locale.value))
                onLocaleSelected(locale.value);
            else 
                onLocaleSelected(languages[0])
        }
    }
</script>

<style scoped>

</style>