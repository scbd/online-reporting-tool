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
                        <km-form-group v-if="viewDocument.elementOfGlobalTargetsInfo || viewDocument.hasReferencePeriod || viewDocument.hasReferencePeriod">
                            <label class="form-label" for="elementOfGlobalTargetsInfo">Elements of the global targets addressed by national targets</label>
                            <km-lstring-value type="html" :value="viewDocument.elementOfGlobalTargetsInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <div>
                            

                        </div>
                    </div>
                </div>
            </km-form-group>
            <km-form-group v-if="viewDocument.referencePeriod">
                <div class="card">
                    <div class="card-header bg-secondary">
                        Reference Period
                    </div>
                    <div class="card-body">
                        
                        <CCard class="mb-2" v-for="(indicator) in viewDocument.referencePeriod" :key="indicator.identifier">
                            <CCardBody>
                                <CCardTitle>
                                    <km-term :value="indicator.headlineIndicator" :locale="selectedLocale"></km-term>
                                </CCardTitle>
                                <hr/>
                                <CCardText >
                                        <!-- v-if="getIndicator(indicator.headlineIndicator).nationalTargets.length" -->
                                    <!-- <km-form-group caption="National target(s) linked to headline indicator">
                                        <div  class="ps-2" v-for="(target, index) in getIndicator(indicator.headlineIndicator).nationalTargets" :key="target.identifier">
                                            {{index+1}}. {{lstring(target.title)}}
                                        </div>
                                    </km-form-group> -->
                                    <km-form-group>
                                        <label class="form-check-label" for="hasReferencePeriod">Is there a reference period and national target which relates to the headline indicator?</label>
                                        <km-value-bool :value="indicator.hasReferencePeriod" :locale="selectedLocale"></km-value-bool>
                                    </km-form-group> 

                                    
                                    <km-form-group v-if="indicator.hasReferencePeriod">
                                        <label class="form-label" for="referencePeriodInfo">Please explain</label>
                                        <km-lstring-value type="html" :value="indicator.referencePeriodInfo" :locale="selectedLocale"></km-lstring-value>
                                    </km-form-group> 
                                </CCardText>

                            </CCardBody>
                        </CCard>
                        
                    </div>
                </div>
            </km-form-group>

        </div>

        <km-modal-spinner :visible="kmDocumentDraftStore.isBusy" v-if="kmDocumentDraftStore.isBusy"></km-modal-spinner>
       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/pages/national-targets/edit-target.json"></i18n>

<script setup>
  
    import { KmFormGroup, KmModalSpinner, KmLstringValue,
        KmLocales, KmValueTerm, KmValueBool, KmValueTerms, KmTerm, KmValue
    } from "~/components/controls";
    import { mapStores }            from 'pinia'
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
        if(props.identifier && !props.document){
            loadDocument(props.identifier)       
        }
    })
 
    const onClose = async ()=>{
        await navigateTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II)
    }

    async function loadDocument(identifier){

        await kmDocumentDraftStore.loadDraftDocument(route.params.identifier);
        // console.log(kmDocumentDraftStore.draftRecord.body)
        // document.value = kmDocumentDraftStore.draftRecord.body;
        ldocument.value = kmDocumentDraftStore.draftRecord.body;
        // console.log(document)
        
    }

</script>