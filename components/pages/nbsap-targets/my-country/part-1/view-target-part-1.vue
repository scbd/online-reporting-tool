<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> NBSAP Target view</slot>
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

                        <km-form-group>
                            <label class="form-label" for="targetTitle">Full name/title of national target</label>                           
                            <km-lstring-value :value="viewDocument.title" :locale="selectedLocale"></km-lstring-value>                                    
                        </km-form-group>

                        <km-form-group v-if="viewDocument.mainPolicyOfMeasureOrActionInfo">
                            <label class="form-label" for="mainPolicyOfMeasureOrActionInfo">Please outline the main policy measures or actions that will be taken to achieve this national target. </label>
                            <km-lstring-value type="html" :value="viewDocument.mainPolicyOfMeasureOrActionInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        Alignment
                    </div>
                    <div class="card-body">

                        <km-form-group>
                            <label class="form-label" for="exampleFormControlSelect1">Alignment with global goals and targets</label>
                            <km-value-terms :value="viewDocument.gbfGoalsAlignment" :locale="selectedLocale"></km-value-terms>
                            <km-value-terms :value="viewDocument.gbfTargetsAlignment" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.hasImplementingConsiderations!=undefined">                                    
                            <label  class="form-check-label" for="hasImplementingConsiderations">Considerations for implementation of other non-target elements of the Kunming Montreal Global Biodiversity Framework</label>
                            <km-form-check-group>
                                <km-value-bool :value="viewDocument.hasImplementingConsiderations" :locale="selectedLocale"></km-value-bool>
                            </km-form-check-group>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.hasImplementingConsiderations==true">                                                                               
                            <km-form-group v-if="viewDocument.implementingConsiderations">
                                <label class="form-label" for="relatedOtherProcesses">Which of the “considerations for implementation” in Section C of the GBF have been taken into account in developing this national target, and the actions to implement it </label>
                                <km-value-terms :value="viewDocument.implementingConsiderations" :locale="selectedLocale"></km-value-terms>
                            </km-form-group>
                            <km-form-group v-if="viewDocument.implementingConsiderationsInfo">
                                <label class="form-label" for="implementingConsiderationsInfo">Please explain how these considerations have been taken into account</label>
                                <km-lstring-value type="html" :value="viewDocument.implementingConsiderationsInfo" :locale="selectedLocale"></km-lstring-value>
                            </km-form-group>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.degreeOfAlignment && degreeOfAlignment">
                            <label class="form-label" for="exampleFormControlSelect1">Degree of alignment</label>
                            <!-- <km-value-terms :value="viewDocument.degreeOfAlignment" :locale="selectedLocale"></km-value-terms>
                            TODO move to thesaurus -->
                            <km-value>{{ degreeOfAlignment(viewDocument.degreeOfAlignment.identifier)?.title }}</km-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.degreeOfAlignmentInfo">
                            <label class="form-label" for="implementingConsiderationsInfo">Explanation, including which aspects of the goal or target are covered</label>
                            <km-lstring-value type="html" :value="viewDocument.degreeOfAlignmentInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        Indicators to be used to monitor this national target
                    </div>
                    <div class="card-body">
                        <km-form-group v-if="viewDocument.headlineIndicators">
                            <label class="form-label" for="exampleFormControlSelect1">Headline indicators</label>
                            <km-value-terms :value="viewDocument.headlineIndicators" :locale="selectedLocale"></km-value-terms>                                    
                        </km-form-group>
                        <km-form-group v-if="viewDocument.componentIndicators">
                            <label class="form-label" for="componentIndicators">Component indicators</label>
                            <km-value-terms :value="viewDocument.componentIndicators" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>
                        <km-form-group v-if="viewDocument.complementaryIndicators">
                            <label class="form-label" for="complementaryIndicators">Complementary indicators</label>
                            <km-value-terms :value="viewDocument.complementaryIndicators" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>
                        <km-form-group v-if="viewDocument.otherNationalIndicators">
                            <label class="form-label" for="otherNationalIndicators">Other national indicators</label>                                    
                            <!-- <small id="emailHelp" class="form-text text-muted">Add your own indicators</small> -->
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group  v-if="viewDocument.nonStateActorCommitmentInfo || viewDocument.hasNonStateActors || viewDocument.nonStateActorsInfo">
                <div class="card">
                    <div class="card-header bg-secondary">
                        Non-State actor commitments
                    </div>
                    <div class="card-body">
                        <km-form-group v-if="viewDocument.nonStateActorCommitmentInfo">
                            <label class="form-label" for="nonStateActorCommitmentInfo">List the non-state commitments towards this national Target</label>
                            <km-lstring-value type="html" :value="viewDocument.nonStateActorCommitmentInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.hasNonStateActors">                                    
                            <label class="form-check-label" for="hasNonStateActors">
                                Are there any overlaps or links between this national target and targets or commitments submitted as non-State actor commitments to the Kunming-Montreal Global Biodiversity Framework?</label>
                            <km-form-check-group>
                                <km-value-bool :value="viewDocument.hasNonStateActors" :locale="selectedLocale"></km-value-bool>
                            </km-form-check-group>
                        </km-form-group> 

                        <km-form-group v-if="viewDocument.hasNonStateActors && viewDocument.nonStateActorsInfo">
                            <label class="form-label" for="nonStateActorsInfo"> please indicate which commitment(s) and which actor(s)</label>
                            <km-lstring-value type="html" :value="viewDocument.nonStateActorsInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group v-if="viewDocument.additionalImplementationInfo || viewDocument.additionalImplementation">
                <div class="card">
                    <div class="card-header bg-secondary">
                        Means of implementation and barriers to implementation
                    </div>
                    <div class="card-body">
                        <km-form-group v-if="viewDocument.additionalImplementation">
                            <label class="form-check-label" for="additionalImplementation">
                            Please indicate if additional means of implementation are needed for the attainment of this national target.</label>                                    
                            <!-- TODO move to thesaurus -->
                            <km-value>{{ t(`${viewDocument.additionalImplementation.identifier}`) }}</km-value>                                    
                        </km-form-group> 

                        <km-form-group v-if="(viewDocument.additionalImplementation||{}).customValue">
                            <label class="form-label" for="additionalImplementationCustomValue"> 
                                Please explain (Additional means of implementation are needed for the attainment of this national target)
                            </label>
                            <km-lstring-value type="html" :value="viewDocument.additionalImplementation.customValue" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.additionalImplementationInfo">
                            <label class="form-label" for="additionalImplementationInfo">Additional explanation</label>
                            <km-lstring-value type="html" :value="viewDocument.additionalImplementationInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group v-if="viewDocument.additionalInfromation">
                <div class="card">
                    <div class="card-header bg-secondary">
                        Additional infromation
                    </div>
                    <div class="card-body">
                        <km-form-group>
                            <label class="form-label" for="referencePeriodInfo">Any other relevant infromation</label>
                            <km-lstring-value type="html" :value="viewDocument.additionalInfromation" :locale="selectedLocale"></km-lstring-value>
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
        console.log('mounted')
        if(props.identifier && !props.document){
            loadDocument(props.identifier)       
        }
    })
 
    const onClose = async ()=>{
        await navigateTo(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I)
    }

    async function loadDocument(identifier){

        await kmDocumentDraftStore.loadDraftDocument(route.params.identifier);
        // console.log(kmDocumentDraftStore.draftRecord.body)
        // document.value = kmDocumentDraftStore.draftRecord.body;
        ldocument.value = kmDocumentDraftStore.draftRecord.body;
        // console.log(document)
        
    }

</script>
