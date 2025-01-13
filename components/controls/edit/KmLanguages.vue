<template>
    <km-select
        v-model="selectedLanguages"
        label="title"
        track-by="code"
        value-key="code"
        :options="formattedLanguages"
        :multiple="true"
        :close-on-select="false" 
        :allow-empty="false"     
        :placeholder="t('languageOfRecord')"
        @update:modelValue="onChange">
    </km-select>      
    <!-- <small v-if="selectedLanguages && selectedLanguages.length == 1" class="text-danger form-text">
        {{ t('minOneLanguage') }}
    </small> -->
    <km-form-group name="otherLanguageOption" class="mt-2"  :caption="t('otherLanguageInfo')">                                    
        <km-form-check-group>
            <km-form-check-item :inline="true" type="radio" name="otherLanguageOptionRadio"  for="otherLanguageOptionRadio" id="otherLanguageOptionYes" 
                :value="true"  v-model="otherLanguageOption" :label="t('yes')" @update:modelValue="onOtherLanguage"/>
            <km-form-check-item :inline="true" type="radio" name="otherLanguageOptionRadio"  for="otherLanguageOptionRadio" id="otherLanguageOptionNo"  
            :value="false" v-model="otherLanguageOption" :label="t('no')" @update:modelValue="onOtherLanguage"/>
        </km-form-check-group>
    </km-form-group>
    <km-form-group name="otherLanguages" class="mt-2"  :caption="t('otherLanguage')" v-if="otherLanguageOption">
        <km-select v-if="formattedOtherLanguages?.length"
            v-model="otherSelectedLanguages"
            label="title"
            track-by="code"
            value-key="code"
            :options="formattedOtherLanguages"
            :multiple="true"
            :close-on-select="false"    
            :placeholder="t('otherLanguageOfRecord')"
            @update:modelValue="onChange">
        </km-select>
        <km-spinner size="lg" v-if="!formattedOtherLanguages?.length"></km-spinner>
    </km-form-group>
</template>

<i18n src="@/i18n/dist/components/controls/edit/KmLanguages.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
    import { KmSelect, KmFormCheckGroup, KmFormGroup, KmFormCheckItem } from "~/components/controls";
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useUserPreferencesStore }    from '@/stores/userPreferences';
    import { languages }            from '@/app-data/languages'

    const props = defineProps({
        modelValue: {
            type    : [ Object ],
            required: true,
            default() {
                return [];
            },
        }
    });
    const emit  = defineEmits(['update:modelValue']);

    const security                  = useSecurity();
    const thesaurusStore            = useThesaurusStore ();
    const userPreferencesStore      = useUserPreferencesStore();
    const {t, locale }              = useI18n();
    const selectedLanguages         = ref([]);
    const otherSelectedLanguages    = ref([]);
    const otherLanguageOption       = ref(false);
    
    const formattedLanguages      = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));
    const formattedOtherLanguages = computed(()=>{
        let otherLanguages = thesaurusStore.getDomainTerms(THESAURUS.OTHER_LANGUAGES)||[]
        otherLanguages = otherLanguages
                            .filter(e=>!isUNLanguage(e.identifier.replace('lang-', '')))
                            .map(e=>{ 
                                return { code : e.identifier.replace('lang-', ''), title : lstring(e.title, locale)}
                            });
        return sortBy(otherLanguages, 'title')
    });

    onMounted(()=>{
        let editLanguages = props.modelValue;
        
        selectedLanguages.value         = editLanguages?.filter(e=>isUNLanguage(e));
        otherSelectedLanguages.value    = editLanguages?.filter(e=>!isUNLanguage(e));
        if(otherSelectedLanguages.value?.length){
            otherLanguageOption.value = true;
            onOtherLanguage()
        }
        
    })

    function onChange(code:string){
        const languages = [...selectedLanguages.value||[], ...otherSelectedLanguages.value||[]];
        emit('update:modelValue', languages);
        userPreferencesStore.setPreferredEditLanguages(languages);
    }

    function onOtherLanguage(){
        if(!otherLanguageOption.value){
            otherSelectedLanguages.value = [];
            onChange('');
        }
        return thesaurusStore.loadDomainTerms(THESAURUS.OTHER_LANGUAGES)
    }

    function isUNLanguage(code:string){
        return formattedLanguages.value.find(un=>un.code == code)
    }

</script>

<style scoped>

</style>