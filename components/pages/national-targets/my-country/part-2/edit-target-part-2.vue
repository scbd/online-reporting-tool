<template>
    <CCard>
      <CCardHeader>
        <slot name="header">{{t('title')}}</slot>
      </CCardHeader>
      <CCardBody>

            <div  v-if="isLoading">
                <km-spinner center></km-spinner>
            </div>           
            <km-form-workflow v-if="!isLoading && document?.header" :focused-tab="props.workflowActiveTab" :document="cleanDocument"
                :container="container">
                <template #submission>
                    <form name="editForm">                     
                        <km-form-group>
                            <CAccordion always-open id="mapping-accordion" class="mt-3 mb-3">                    
                                <CAccordionItem :visible="true">
                                    <CAccordionHeader id="generalAccordion">
                                        {{t('governmentAndLanguages')}}
                                        <small class="text-muted float-end">({{t('clickToChange')}})</small>                       
                                    </CAccordionHeader>
                                    <CAccordionBody> 
                                        <km-form-group name="government" :caption="t('government')" required>
                                            <km-government v-model="document.government" ></km-government>                           
                                        </km-form-group>   

                                        <km-form-group name="languages" :caption="t('submissionLanguage')" required>
                                            <km-languages v-model="document.header.languages"></km-languages>
                                        </km-form-group>   
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>
                        </km-form-group>         
                        <km-form-group v-if="nationalTargets?.length">
                            <CCard>
                                <CCardHeader>
                                    {{t('linkedTargets')}}
                                </CCardHeader>
                                <CCardBody>
                                    <ul class="list-group">
                                    <li  class="list-group-item" v-for="(target, index) in nationalTargets" :key="target.identifier">
                                        {{lstring(target.workingDocumentTitle||target.title)}}
                                    </li>
                                    </ul>
                                </CCardBody>
                            </CCard>                            
                        </km-form-group>
                        <km-form-group>
                            <CCard>
                                <CCardHeader>
                                    {{t('elementsOfTargets')}}
                                </CCardHeader>
                                <CCardBody>                      
                                    <km-form-group required :caption="t('elementsAddressed')" 
                                        name="elementOfGlobalTargetsInfo" :data-content="t('aspectsOfTargets')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload" :identifier="document.header.identifier" v-model="document.elementOfGlobalTargetsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>                                
                                </CCardBody>
                            </CCard>         
                        </km-form-group>
                        <km-form-group>
                            <CCard>
                                <CCardHeader>
                                    {{t('referencePeriod')}}
                                </CCardHeader>
                                <CCardBody>   
                                    <CCard class="mb-2" v-for="(indicator, index) in document.referencePeriod" :key="indicator.identifier">
                                        <CCardBody>
                                            <CCardTitle>{{lstring(getIndicator(indicator.headlineIndicator).title)}}</CCardTitle>
                                            <hr/>
                                            <CCardText>
                                                <div class="table-responsive">

                                                <table class="table" v-if="indicator.headlineIndicator">
                                                    <tr>
                                                        <td>   
                                                            <km-form-group name="hasReferencePeriod" required :caption="t('referencePeriodForIndicators')">
                                                                <km-form-check-group>
                                                                    <km-form-check-item :inline="true" type="radio" :name="'hasReferencePeriod' + indicator.headlineIndicator.identifier"  :for="'hasReferencePeriod' + indicator.headlineIndicator.identifier" :id="'hasReferencePeriodYes'+ indicator.headlineIndicator.identifier"  :value="true"  v-model="indicator.hasReferencePeriod" :label="t('yes')"/>
                                                                    <km-form-check-item :inline="true" type="radio" :name="'hasReferencePeriod' + indicator.headlineIndicator.identifier"  :for="'hasReferencePeriod' + indicator.headlineIndicator.identifier" :id="'hasReferencePeriodNo' + indicator.headlineIndicator.identifier"  :value="false" v-model="indicator.hasReferencePeriod" :label="t('no')"
                                                                        @update:modelValue="()=>indicator.referencePeriodInfo=undefined"/>
                                                                </km-form-check-group>
                                                            </km-form-group> 

                                                            <km-form-group v-if="indicator.hasReferencePeriod" name="referencePeriodInfo" :caption="t('explain')" required>                                                                
                                                                <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="indicator.referencePeriodInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                                            </km-form-group>                                     
                                                        </td>
                                                    </tr> 
                                                </table>   
                                                </div>                                             
                                            </CCardText>

                                        </CCardBody>
                                    </CCard>                                
                                </CCardBody>
                            </CCard>         
                        </km-form-group>
                    </form>                   
                </template>
                <template #review>                    
                    <view-target :identifier="document.header.identifier" :document="cleanDocument"></view-target>
                </template>
            </km-form-workflow>
            <km-document-error v-if="!isLoading &&  documentLoadError" :document-error="documentLoadError"></km-document-error>        
      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-2/edit-target-part-2.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
  
    import viewTarget               from "./view-target-part-2.vue";
    import { useRoute } from 'vue-router' 
    import { useStorage } from '@vueuse/core'
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import {cloneDeep} from 'lodash';
    
    const props = defineProps({
        identifier         : {type:String, required:false},
        rawDocument        : {type: Object },
        globalGoalOrTarget : {type:String, required:true},
        headlineIndicators : {type:Array, required:true},
        workflowActiveTab  : {type:Number, default:1 }
    }) 
    
    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit  = defineEmits(['onClose', 'onPostSaveDraft'])

    const { t }           = useI18n();
    const { user }        = useAuth();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const container = useAttrs().container;
    const stateTargetWorkflow       = useStorage('scbd-ort-target-workflow', { batchId : undefined });
    
    const headlineIndicators = ref(null);
    const document = ref({});
    const isLoading = ref(false);
    const documentLoadError = ref(null); 
    const validationReport  = ref({}); 
    const documentInfo      = ref({});
    let isNewDocument       = false;

    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        
        // incase if national target record was modified and global target was removed after 
        // the mapping was submitted then filter such reference period
        if(clean.referencePeriod && headlineIndicators.value?.length){            
            const referencePeriod = clean.referencePeriod.filter(e=>{
                return headlineIndicators.value.find(indicator=>indicator.identifier == e.headlineIndicator.identifier);
            })
            clean.referencePeriod = referencePeriod.length ? referencePeriod : undefined;
        }
        else{
            clean.referencePeriod = []
            headlineIndicators.value.forEach(indicator => {
                clean.referencePeriod.push({
                    headlineIndicator   : { identifier : indicator.identifier},
                    hasReferencePeriod : false
                })
            });  
        }
        if(!clean.referencePeriod?.length)
            clean.referencePeriod = undefined;
        
        return clean
    });

    const nationalTargets = computed(()=>{
        return props.headlineIndicators[0].nationalTargets
    });

    onMounted(() => {
        init();
    })

    const onPostClose = async (document)=>{
        emit('onClose', isNewDocument ? undefined : document);
    }

    const onPostSaveDraft = async (document)=>{
        isNewDocument = false;
        emit('onPostSaveDraft', document);
        documentInfo.value = document
    }

    const onPostReviewDocument = async(document, newValidationReport)=>{
        validationReport.value     = cloneDeep(newValidationReport);
    }
    
    const onGetDocumentInfo = async ()=>{
        return documentInfo.value;
    }
    
    function onFileUpload({file, locale}){
        useOnFileUpload({document, file, locale});
    }

    function emptyDocument(){

        const additionalProps = {
            globalGoalOrTarget : {
                identifier  : props.globalGoalOrTarget
            },
            referencePeriod :   headlineIndicators.value?.map(indicator => {
                                    return {
                                        headlineIndicator  : { identifier : indicator.identifier},
                                        hasReferencePeriod : false
                                    }
                                })
        }
        const emptyDoc = EditFormUtility.buildEmptyDocument(SCHEMAS.NATIONAL_TARGET_7_MAPPING, additionalProps);

        return emptyDoc
        
    }

    async function loadHeadlineIndicators(globalTarget){
        const indicators = await GbfGoalsAndTargets.loadGbfHeadlineIndicator(globalTarget);
        headlineIndicators.value = sortBy(indicators?.flat()||[], 'title')
    }

    function getIndicator(indicator){
        return headlineIndicators.value?.find(e=>e.identifier == indicator?.identifier)
    }

    async function init(){
        isLoading.value = true;
        const identifier = props.identifier || route?.params?.identifier;
        try{

            await loadHeadlineIndicators(props.globalGoalOrTarget)

            if(props.rawDocument){
                document.value = {...props.rawDocument};
            }
            else if(identifier){
                documentInfo.value = await EditFormUtility.load(identifier); 
                document.value = documentInfo.value.body;               
            }
            else{
                document.value = emptyDocument();
                isNewDocument = true;
                //validate if there is a mapping record for the given target and load it instead
            }
        }
        catch(e){
            if([404, 401, 403].includes(e.status)){
                documentLoadError.value = e.status;
                useLogger().error(e, `${t(e.status==404 ? 'notFound' : 'notAuthorized')} ` + identifier);
            }
            else
                useLogger().error(e, `${t('errorLoading')} ` + identifier);
            
        }

        isLoading.value = false;
    }

    provide('kmWorkflowFunctions', {
        onPostSaveDraft,
        onPostReviewDocument,
        onPostClose,
        onGetDocumentInfo
    });

    provide("validationReview", {
        hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    });
</script>
<style scoped>
.accordion-button small{
    display: none;
}
.accordion-button.collapsed small{
    display: block;
}
</style>
