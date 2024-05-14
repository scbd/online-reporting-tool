<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> {{t('nationalTarget')}} </slot>
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
                        {{t('general')}}
                    </div>
                    <div class="card-body">  
                        <km-form-group v-if="viewDocument.government && viewDocument.government.identifier">
                            <label class="form-label" for="government">{{t('government')}}</label>
                            <km-value-term :value="viewDocument.government" :locale="selectedLocale"></km-value-term>                                    
                        </km-form-group>

                        <km-form-group>
                            <label class="form-label" for="targetTitle">{{t('title')}}</label>                           
                            <km-lstring-value :value="viewDocument.title" :locale="selectedLocale"></km-lstring-value>                                    
                        </km-form-group>

                        <km-form-group v-if="viewDocument.description">
                            <label class="form-label" for="description">{{t('description')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.description" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.mainPolicyOfMeasureOrActionInfo">
                            <label class="form-label" for="mainPolicyOfMeasureOrActionInfo">{{t('mainPolicyMeasures')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.mainPolicyOfMeasureOrActionInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('alignment')}}
                    </div>
                    <div class="card-body">
                             
                        <km-form-group v-if="viewDocument.globalGoalAlignment">
                            <label class="form-label" for="contributionToGlobalGoals">{{t('contributionToGoals')}}</label>
                            <km-value-terms :value="viewDocument.globalGoalAlignment" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>

                        <km-form-group>
                            
                            <label class="form-label" for="targetsAlignment">{{t('targetsAlignment')}} </label>
                            <table class="table table-bordered">                                            
                                <tbody>
                                    <tr>
                                        <td>{{t('globalTargets')}}</td>
                                        <td>{{t('degreeOfAlignment')}}</td>
                                    </tr>
                                    <tr v-for="target in viewDocument.globalTargetAlignment" :key="target.identifier">
                                        <td>
                                            <km-value-term class="degree-of-alignment" :value="target" :locale="selectedLocale">
                                                <template #help="{term}">
                                                    <km-help class="ms-1 me-1" :title="lstring(term.shortTitle)">
                                                        <template #content>
                                                            <h5>{{ lstring(term.title)}}</h5>
                                                            <div>
                                                                <i>
                                                                    <small>
                                                                    {{lstring(term.longDescription)}}
                                                                    </small>
                                                                </i>
                                                            </div>
                                                        </template>
                                                    </km-help>
                                                </template> 
                                            </km-value-term>
                                        </td>
                                        <td>
                                            <km-value-term class="degree-of-alignment" :value="target.degreeOfAlignment" v-if="target.degreeOfAlignment" :locale="selectedLocale"></km-value-term>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </km-form-group>
                                                                        
                        <km-form-group v-if="viewDocument.implementingConsiderations">
                            <label class="form-label" for="relatedOtherProcesses">{{t('considerationForImplementation')}}</label>
                            <km-value-terms :value="viewDocument.implementingConsiderations" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>
                        <km-form-group v-if="viewDocument.implementingConsiderationsInfo">
                            <label class="form-label" for="implementingConsiderationsInfo">{{t('explainConsideration')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.implementingConsiderationsInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.degreeOfAlignmentInfo">
                            <label class="form-label" for="implementingConsiderationsInfo">{{t('explainCoveredGoals')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.degreeOfAlignmentInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('indicatorsUsedToMonitor')}}
                    </div>
                    <div class="card-body">
                        <km-form-group v-if="viewDocument.headlineIndicators">
                            <label class="form-label" for="headlineIndicators">{{t('headlineIndicators')}}</label>
                            <km-value-terms :value="viewDocument.headlineIndicators" :locale="selectedLocale"></km-value-terms>                                    
                        </km-form-group>
                        <km-form-group v-if="viewDocument.binaryIndicators">
                            <label class="form-label" for="binaryIndicators">{{t('binaryIndicators')}}</label>
                            <km-value-terms :value="viewDocument.binaryIndicators" :locale="selectedLocale"></km-value-terms>                                    
                        </km-form-group>
                        <km-form-group v-if="viewDocument.componentIndicators">
                            <label class="form-label" for="componentIndicators">{{t('componentIndicators')}}</label>
                            <km-value-terms :value="viewDocument.componentIndicators" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>
                        <km-form-group v-if="viewDocument.complementaryIndicators">
                            <label class="form-label" for="complementaryIndicators">{{t('complementaryIndicators')}}</label>
                            <km-value-terms :value="viewDocument.complementaryIndicators" :locale="selectedLocale"></km-value-terms>
                        </km-form-group>
                        <km-form-group v-if="viewDocument.otherNationalIndicators">
                            <label class="form-label" for="otherNationalIndicators">{{t('nationalIndicators')}}</label>       
                            <div v-for="otherIndicator in viewDocument.otherNationalIndicators" :key="otherIndicator" class="mb-1">
                                <km-lstring-value type="html" :value="otherIndicator.value" :locale="selectedLocale"></km-lstring-value>
                            </div>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group  v-if="viewDocument.nonStateActorCommitmentInfo || viewDocument.hasNonStateActors || viewDocument.nonStateActorsInfo">
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('nonStateActorCommitments')}}
                    </div>
                    <div class="card-body">
                        <km-form-group v-if="viewDocument.nonStateActorCommitmentInfo">
                            <label class="form-label" for="nonStateActorCommitmentInfo">{{t('listOfNonStateActors')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.nonStateActorCommitmentInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.hasNonStateActors">                                    
                            <label class="form-check-label" for="hasNonStateActors">
                                {{t('anyOverlaps')}}</label>
                            <km-form-check-group>
                                <km-value-bool :value="viewDocument.hasNonStateActors" :locale="selectedLocale"></km-value-bool>
                            </km-form-check-group>
                        </km-form-group> 

                        <km-form-group v-if="viewDocument.hasNonStateActors && viewDocument.nonStateActorsInfo">
                            <label class="form-label" for="nonStateActorsInfo">{{t('commitmentsAndActors')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.nonStateActorsInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group v-if="viewDocument.additionalImplementationInfo || viewDocument.additionalImplementation">
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('meansToImplement')}}
                    </div>
                    <div class="card-body">
                        <km-form-group v-if="viewDocument.additionalImplementation">
                            <label class="form-check-label" for="additionalImplementation">
                                {{t('additionalMeanOfImplementation')}}</label>                                    
                            <!-- TODO move to thesaurus -->
                            <km-value>
                                <span v-if="viewDocument.additionalImplementation.identifier == 'additionalImplementationRequired'"  >{{t('yesMeansOfImplementation')}}</span>
                                <span v-if="viewDocument.additionalImplementation.identifier == 'additionalImplementationAvailable'" >{{t('noMeansOfImplementation')}}</span>
                                <span v-if="viewDocument.additionalImplementation.identifier == 'additionalImplementationOther'"     >{{t('other')}}</span>
                            </km-value>                                    
                        </km-form-group> 

                        <km-form-group v-if="(viewDocument.additionalImplementation||{}).customValue">
                            <label class="form-label" for="additionalImplementationCustomValue"> 
                                {{t('pleaseExplain')}}
                            </label>
                            <km-lstring-value type="html" :value="viewDocument.additionalImplementation.customValue" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.additionalImplementationInfo">
                            <label class="form-label" for="additionalImplementationInfo">{{t('additionalExplanation')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.additionalImplementationInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group v-if="viewDocument.additionalInformation">
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('additionalInformation')}}
                    </div>
                    <div class="card-body">
                        <km-form-group>
                            <label class="form-label" for="referencePeriodInfo">{{t('relevantInformation')}}</label>
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
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-1/edit-target-part-1.json"></i18n>
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
        await useNavigateAppTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I)
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