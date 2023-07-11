<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> Global Goals/Target Mapping view</slot>
      </CCardHeader>
      <CCardBody>
       
        <div v-if="viewDocument">
        
            <div v-if="viewDocument.header.languages && viewDocument.header.languages.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="selectedLocale" :locales="viewDocument.header.languages"></km-locales>
            </div>
            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        General
                    </div>
                    <div class="card-body">  
                        <km-form-group v-if="viewDocument.government && viewDocument.government.identifier">
                            <label class="form-label" for="government">Government</label>
                            <km-value-term :value="viewDocument.government" :locale="selectedLocale"></km-value-term>                                    
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        Elements of the global targets
                    </div>
                    <div class="card-body">                                
                        <km-form-group v-if="viewDocument.elementOfGlobalTargetsinfo || viewDocument.hasReferncePeriod || viewDocument.hasReferncePeriod">
                            <label class="form-label" for="elementOfGlobalTargetsinfo">Elements of the global targets addressed by national targets</label>
                            <km-lstring-value type="html" :value="viewDocument.elementOfGlobalTargetsinfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                        <km-form-group>
                            <label class="form-check-label" for="hasReferncePeriod">Is there a reference period and national target which relates to the headline indicator?</label>
                            <km-value-bool :value="viewDocument.hasReferncePeriod" :locale="selectedLocale"></km-value-bool>
                        </km-form-group> 

                        <km-form-group v-if="viewDocument.hasReferncePeriod">
                            <label class="form-label" for="referencePeriodInfo">Please explain</label>
                            <km-lstring-value type="html" :value="viewDocument.referencePeriodInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

        </div>

        <km-modal-spinner :visible="kmDocumentDraftStore.isBusy" v-if="kmDocumentDraftStore.isBusy"></km-modal-spinner>
       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/pages/nbsap-targets/edit-target.json"></i18n>

<script setup>
  
    import { KmFormGroup, KmModalSpinner, KmLstringValue,
        KmLocales, KmValueTerm, KmValueBool, KmValueTerms, KmValue
    } from "~/components/controls";
    import { mapStores }            from 'pinia'
    import { THEASURUS, ROLES, SCHEMAS } from '@/constants';
    import { languages }            from '@/app-data/languages'
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 

    const { user }                = useAuth();
    const security                = useSecurity();
    const route                   = useRoute();
    const {t, locale}             = useI18n();
    const thesaurusStore          = useThesaurusStore ();
    const countriesStore          = useCountriesStore ();
    const realmConfStore          = useRealmConfStore();
    const kmDocumentDraftStore    = useKmDocumentDraftsStore();
    const {$appRoutes:appRoutes } = useNuxtApp();

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    })

    console.log(props)
    let { document, identifier } = toRefs(props)
    let ldocument = ref(undefined);

    const showSpinnerModal = ref(false);
    const selectedLocale = ref(locale.value);

    const viewDocument = computed(()=>{
        return document?.value||ldocument?.value;
    })

    const degreeOfAlignment = function(identifier){
        return degreeOfAlignments.find(e=>e.identifier == identifier) 
    }

    onMounted(() => {
        console.log('mounted')
        if(props.identifier && !props.document){
            loadDocument(props.identifier)       
        }
    })
 
    const onClose = async ()=>{
        await navigateTo(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_II)
    }

    async function loadDocument(identifier){

        await kmDocumentDraftStore.loadDraftDocument(route.params.identifier);
        // console.log(kmDocumentDraftStore.draftRecord.body)
        // document.value = kmDocumentDraftStore.draftRecord.body;
        ldocument.value = kmDocumentDraftStore.draftRecord.body;
        // console.log(document)
        
    }

</script>
