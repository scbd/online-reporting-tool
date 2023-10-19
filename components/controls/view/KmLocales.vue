<template>
    <CButtonGroup role="group" aria-label="Document locales">
        <CButton color="primary" v-for="locale in locales" :active="locale==modelValue" :key="locale"
            @click="onLocaleSelected(locale)">
            
            <CTooltip :content="lstring(getTerm(locale).title, appLocale)">
                <template #toggler="{ on }">
                    <span class="d-inline-block" :tabindex="0" v-on="on">
                        {{ locale.toUpperCase() }}
                    </span>
                </template>                            
            </CTooltip>
        </CButton>
    </CButtonGroup>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    const nuxtApp = useNuxtApp();
    const { t, locale : appLocale } = useI18n();
    const props = defineProps({
        modelValue  : {type:String, required:true },
        locales     : {type:Array, required:true },
    })
    
    const thesaurusStore    = useThesaurusStore ();
    const $emit = defineEmits(['update:modelValue']);
    const { modelValue, locales } = toRefs(props);

    const onLocaleSelected = (locale:string)=>{
       $emit('update:modelValue', locale);
    }
    
    onMounted(()=>setDefaultLocale(locales.value))
    
    watch(locales, (languages)=>{
        setDefaultLocale(languages)
    })

    function setDefaultLocale(languages){
        if(languages?.length){
            if(languages.length == 1)
                onLocaleSelected(languages[0]);
            else if(languages.includes(appLocale.value))
                onLocaleSelected(appLocale.value);
            else 
                onLocaleSelected(languages[0])
        }
    }
    function getTerm(lang:string) {
        thesaurusStore.loadTerm(`lang-${lang}`)
        return thesaurusStore.getTerm(`lang-${lang}`)||{};   
    }

</script>

<style scoped>

</style>