<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> National Target </slot>
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

                        <km-form-group v-if="viewDocument.description">
                            <label class="form-label" for="description">Description</label>
                            <km-lstring-value type="html" :value="viewDocument.description" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.mainPolicyOfMeasureOrActionInfo">
                            <label class="form-label" for="mainPolicyOfMeasureOrActionInfo">Please outline the main policy measures or actions that will be taken to achieve this national target</label>
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
                             
                        <km-form-group v-if="viewDocument.globalGoalAlignment">
                            <label class="form-label" for="globalGoalAlignment">Global goal(s) alignment </label>
                            <km-value-terms :value="viewDocument.globalGoalAlignment" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>

                        <km-form-group>
                            
                            <label class="form-label" for="globalGoalAlignment">Global target(s) alignment </label>
                            <table class="table table-bordered">                                            
                                <tbody>
                                    <tr>
                                        <td>Global target(s)</td>
                                        <td>Degree of Alignment</td>
                                    </tr>
                                    <tr v-for="target in viewDocument.globalTargetAlignment" :key="target.identifier">
                                        <td>
                                            <km-value-term class="degree-of-alignment" :value="target" :locale="selectedLocale"></km-value-term>
                                        </td>
                                        <td>
                                            <km-value-term class="degree-of-alignment" :value="target.degreeOfAlignment" v-if="target.degreeOfAlignment" :locale="selectedLocale"></km-value-term>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.hasImplementingConsiderations!=undefined">                                    
                            <label  class="form-check-label" for="hasImplementingConsiderations">Considerations for implementation of other non-target elements of the Kunming Montreal Global Biodiversity Framework</label>
                            <km-form-check-group>
                                <km-value-bool :value="viewDocument.hasImplementingConsiderations" :locale="selectedLocale"></km-value-bool>
                            </km-form-check-group>
                        </km-form-group>
                                                                        
                        <km-form-group v-if="viewDocument.implementingConsiderations">
                            <label class="form-label" for="relatedOtherProcesses">Which of the “considerations for implementation” in Section C of the GBF have been taken into account in developing this national target, and the actions to implement it </label>
                            <km-value-terms :value="viewDocument.implementingConsiderations" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>
                        <km-form-group v-if="viewDocument.implementingConsiderationsInfo">
                            <label class="form-label" for="implementingConsiderationsInfo">Please explain how these considerations have been taken into account</label>
                            <km-lstring-value type="html" :value="viewDocument.implementingConsiderationsInfo" :locale="selectedLocale"></km-lstring-value>
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
                            <label class="form-label" for="headlineIndicators">Headline indicators</label>
                            <km-value-terms :value="viewDocument.headlineIndicators" :locale="selectedLocale"></km-value-terms>                                    
                        </km-form-group>
                        <km-form-group v-if="viewDocument.binaryIndicators">
                            <label class="form-label" for="binaryIndicators">Binary indicators</label>
                            <km-value-terms :value="viewDocument.binaryIndicators" :locale="selectedLocale"></km-value-terms>                                    
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
                            <div v-for="otherIndicator in viewDocument.otherNationalIndicators" :key="otherIndicator" class="mb-1">
                                <km-lstring-value type="html" :value="otherIndicator" :locale="selectedLocale"></km-lstring-value>
                            </div>
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
                            <km-value>
                                <span v-if="viewDocument.additionalImplementation.identifier == 'additionalImplementationRequired'"  >Yes (Additional means of implementation are needed for the attainment of this national target)</span>
                                <span v-if="viewDocument.additionalImplementation.identifier == 'additionalImplementationAvailable'" >No (Means of implementation available)</span>
                                <span v-if="viewDocument.additionalImplementation.identifier == 'additionalImplementationOther'"     >Other</span>
                            </km-value>                                    
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

            <km-form-group v-if="viewDocument.additionalInformation">
                <div class="card">
                    <div class="card-header bg-secondary">
                        Additional information
                    </div>
                    <div class="card-body">
                        <km-form-group>
                            <label class="form-label" for="referencePeriodInfo">Any other relevant information</label>
                            <km-lstring-value type="html" :value="viewDocument.additionalInformation" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group> 
        </div>

        <km-document-error v-if="!viewDocument && !isLoading &&  documentLoadError" :document-error="documentLoadError"></km-document-error>        
        <km-spinner :visible="isLoading" v-if="isLoading" center></km-spinner>        
       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-1/view-target-part-1.json"></i18n>

<script setup>
  
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useRoute } from 'vue-router' 
    import { KmDocumentDraftsService}from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";

    const route                   = useRoute();
    const {t, locale}             = useI18n();
    const {$appRoutes:appRoutes } = useNuxtApp();

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    })

    const { document, identifier } = toRefs(props);
    const lDocument = ref(undefined);
    const isLoading = ref(false);
    const documentLoadError = ref(false);
    const selectedLocale = ref(locale.value);

    const viewDocument = computed(()=>{
        return document?.value||lDocument?.value;
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
        await navigateTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I)
    }

    async function loadDocument(identifier){

        isLoading.value = true;
        try{
            if(route.query?.draft == 'true' || route.query?.draft === null){
                const draftRecord = await KmDocumentDraftsService.loadDraftDocument(route.params.identifier);
                lDocument.value = draftRecord.body;
            }
            else{
                const record = await KmDocumentsService.loadDocument(route.params.identifier);
                lDocument.value = record.body;
            }
        }
        catch(e){
            if([404, 401, 403].includes(e.status)){
                documentLoadError.value = e.status;
                useLogger().error(e, `${t(e.status==404 ? 'notFound' : 'notAuthorized')} ` + route.params.identifier);
            }
            else
                useLogger().error(e, `${t('errorLoading')} ` + route.params.identifier);
        }
        isLoading.value = false;
        
    }

</script>
<style scoped>
    .degree-of-alignment :deep(.form-control.km-value){
        background-color: unset!important;
        border: unset!important;
    }
</style>