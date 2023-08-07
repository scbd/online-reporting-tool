<template>
    <km-select
        v-model="selectedLanguages"
        label="title"
        track-by="code"
        value-key="code"
        :options="formattedLanguages"
        :multiple="true"
        :allow-empty="false"     
        :placeholder="t('languageOfRecord')"
        @update:modelValue="onChange">
    </km-select>      
    <small v-if="selectedLanguages && selectedLanguages.length == 1" class="text-danger form-text">
        {{ t('minOneLanguage') }}
    </small>
    <km-form-group name="otherLanguages" class="mt-2"  caption="Would like to submit this information in any other language(s)?">                                    
        <km-form-check-group>
            <km-form-check-item inline type="radio" name="otherLanguages"  for="otherLanguages" id="otherLanguagesYes" 
                :value="true"  v-model="otherLanguages" label="Yes" @update:modelValue="onOtherLanguage"/>
            <km-form-check-item inline type="radio" name="otherLanguages"  for="otherLanguages" id="otherLanguagesNo"  :value="false" v-model="otherLanguages" label="No"/>
        </km-form-check-group>
    </km-form-group>
    <km-form-group name="otherLanguages" class="mt-2"  caption="Other language(s)?" v-if="otherLanguages">
        <km-select
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
    </km-form-group>
</template>

<i18n src="@/i18n/dist/components/controls/edit/KmLanguages.json"></i18n>

<script setup lang="ts">
    import { KmSelect, KmFormCheckGroup, KmFormGroup, KmFormCheckItem } from "~/components/controls";
    import { useThesaurusStore }    from '@/stores/thesaurus';
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
    const {t, locale }              = useI18n();
    const selectedLanguages         = ref([]);
    const otherSelectedLanguages    = ref([]);
    const otherLanguages            = ref(false)

    
    const formattedLanguages      = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));
    const formattedOtherLanguages = computed(()=>{
        let otherLanguages = thesaurusStore.getDomainTerms(THESAURUS.OTHER_LANGUAGES)||[]
        otherLanguages = otherLanguages
                            .filter(e=>!isUNLanguage(e.identifier.replace('lang-', '')))
                            .map(e=>{ 
                                return { code : e.identifier.replace('lang-', ''), title : lstring(e.title)}
                            });
        return sortBy(otherLanguages, 'title')
    })
    onMounted(()=>{
        console.log('hello', props.modelValue)
        selectedLanguages.value         = props.modelValue?.filter(e=>isUNLanguage(e));
        otherSelectedLanguages.value    = props.modelValue?.filter(e=>!isUNLanguage(e));
        if(otherSelectedLanguages.value?.length){
            otherLanguages.value = true;
            onOtherLanguage()
        }
    })

    function onChange(code:string){
         emit('update:modelValue', [...selectedLanguages.value||[], ...otherSelectedLanguages.value||[]])
    }

    function onOtherLanguage(){
        return thesaurusStore.loadDomainTerms(THESAURUS.OTHER_LANGUAGES)
    }

    function isUNLanguage(code:string){
        return formattedLanguages.value.find(un=>un.code == code)
    }

</script>

<style scoped>

</style>