<template>
    <div class="d-grid justify-content-end mb-2" v-if="binaryQuestion?.questions?.length">
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="props.identifier" :disabled="props.disabled">
            {{ t('editBinaryIndicatorData') }}
        </CButton>
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="!props.identifier" :disabled="props.disabled">
            {{ t('addBinaryIndicatorData') }}
        </CButton>
    </div>
    <CModal  class="show d-block nr7-add-binary-indicator-data-modal" size="xl"
        alignment="center" backdrop="static" @close="() => {showEditIndicatorDataModal=false}" :visible="showEditIndicatorDataModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                <km-term :value="indicator?.identifier" :locale="locale"></km-term>
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CCard>
                <CCardBody>
                    <div  v-if="isLoading">
                        <km-spinner></km-spinner>
                    </div>
                    <form v-if="!isLoading && document" name="editForm">
                        <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument" 
                            :container="container">

                            <template #validation-errors="{onJumpTo}" v-if="validationReport?.errors">
                                <km-validation-errors 
                                    :report="validationReport" :container="container" @on-jump-to="onJumpTo">
                                </km-validation-errors>
                            </template>
                            <template #submission>   
                                <div class="mb-3">
                                    <CAccordion always-open id="mapping-accordion" class="mt-3 mb-3">                    
                                        <CAccordionItem :visible="true">
                                            <CAccordionHeader id="generalAccordion">
                                               {{ t('general') }}                        
                                            </CAccordionHeader>
                                            <CAccordionBody> 
                                                <km-form-group name="government" :caption="t('government')" required>
                                                    <km-government v-model="document.government"></km-government>                           
                                                </km-form-group>   

                                                <km-form-group name="languages" :caption="t('selectLanguages')" required>
                                                    <km-languages v-model="document.header.languages"></km-languages>
                                                </km-form-group>                                
                                            </CAccordionBody>
                                        </CAccordionItem>
                                    </CAccordion>   
                                    <div class="">     
                                        <CCard>
                                            <CCardBody>             
                                                <km-questions :questions="binaryQuestion?.questions" @update:modelValue="onAnswer"
                                                    v-model="document[binaryQuestion.key].responses"></km-questions>
                                            </CCardBody>  
                                        </CCard>
                                    </div> 
                                    <div class="mt-3">
                                        <km-additional-information v-model="document[binaryQuestion.key].comments" :locales="document.header.languages"
                                            :identifier="cleanDocument?.header?.identifier">
                                            {{t('comments')}}
                                        </km-additional-information>
                                    </div>
                                </div>                                 
                            </template>
                            <template #review>
                                <nr7-view-binary-indicator-data :indicator-data="document[binaryQuestion.key]" :questions="binaryQuestion?.questions">
                                </nr7-view-binary-indicator-data>
                            </template>
                        </km-form-workflow>
                    </form>

                </CCardBody>
            </CCard>
        </CModalBody>   
    </CModal>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-add-binary-indicator-data.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    
    import {cloneDeep } from 'lodash';
    import { useToast } from 'vue-toast-notification';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { KmDocumentsService } from '~/services/kmDocuments';
    import { KmDocumentDraftsService } from '~/services/kmDocumentDrafts';
    import { getBinaryIndicatorQuestions} from '~/app-data/binary-indicator-questions'
   
    const props = defineProps({
        identifier         : {type:String, required:false},
        indicator          : {type:Object, required:true},
        workflowActiveTab  : {type:Number, default:1 }
    }) 
    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit  = defineEmits(['onClose', 'onPostSaveDraft'])

    const isEventDefined        = useHasEvents();
   
    const { user }                = useAuth();
    const security                = useSecurity();
    const route                   = useRoute();
    const {$appRoutes:appRoutes } = useNuxtApp();
    const {t, locale }            = useI18n()
    const $toast                  = useToast();
    const container               = useAttrs().container;
    const { $eventBus }           = useNuxtApp();

    const validationReport           = ref(null);
    const document                   = ref({});
    const isLoading                  = ref(false);
    const showEditIndicatorDataModal = ref(false);
    const customValidationErrors     = ref(null);
    const documentInfo              = ref({});
    const binaryIndicatorQuestions = computed(()=>{
        const questions = getBinaryIndicatorQuestions(locale.value);
        return cloneDeep(questions);
    });    
    const binaryQuestion = ref([]);
    
    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});

        //since the binary indicator for Goal C and Target 13 is same, overwrite to avoid answering double
        if(props.indicator?.identifier == "KMGBF-INDICATOR-BIN-C-13")            
            clean["binaryResponseTarget13"] = clean["binaryResponseGoalC"];

        return clean
    });
      
    const onPostClose = async (document)=>{
        
        documentInfo.value.body = document
        if(isEventDefined('onClose'))
            emit('onClose', documentInfo.value);

        showEditIndicatorDataModal.value = false;
        customValidationErrors.value = null;
        validationReport.value = {}
    }

    const onPreSaveDraft = async (document)=>{
        return document;
    };

    const onPostSaveDraft = async (document)=>{       
        //vue prepends 'on' to all events internally
        if(isEventDefined('onPostSaveDraft'))
            emit('onPostSaveDraft', document);
        
        documentInfo.value = document
    };
    
    const onPreReviewDocument = (document)=>{
        return document;
    }
    const onPostReviewDocument = (document, newValidationReport)=>{

        validationReport.value = cloneDeep(newValidationReport || {});

        const {questions, key, binaryIndicator, target } = binaryQuestion.value
        const flatQuestions = flattenQuestions(questions);

        if(!validationReport.value?.errors){


            // answers for the current binary target, show validation errors only for the current target.
            const answers = cleanDocument.value[key] ||{responses:{}}; 
            const errors = [];
            flatQuestions.forEach(e=>{
                if(!(answers.responses||{})[e.key])
                    errors.push({
                        "code": "Error.Mandatory",
                        "property": e.key
                    })
            });
            validationReport.value.errors = errors;
        }
        else{
            const currentTargetQuestions = flatQuestions.map(e=>e.key);
            validationReport.value.errors = validationReport.value?.errors?.filter(e=>currentTargetQuestions.includes(e.property));
        }
    }
    const onGetDocumentInfo = async ()=>{
        return documentInfo.value;
    }

    function showEditIndicatorData(target){ 
        showEditIndicatorDataModal.value = true;
        loadDocument();
    }

    async function loadDocument(){
        try{
            isLoading.value = true;
            if(props.identifier){
                documentInfo.value = await EditFormUtility.load(props.identifier, SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA)
                document.value = documentInfo.value.body;
            }
            else{
                document.value = EditFormUtility.buildEmptyDocument(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA);
                //TODO:validate if there is a mapping record for the given target and load it instead
            }

            let indicatorResponse = document.value[binaryQuestion.value.key];
            if(!indicatorResponse)
                indicatorResponse = document.value[binaryQuestion.value.key] = {}
            
            indicatorResponse.indicator = { identifier : props.indicator?.identifier}
            indicatorResponse.responses = indicatorResponse.responses || {},
            indicatorResponse.additionalInformation = indicatorResponse.additionalInformation || {}
            
            updateQuestionEnablement(indicatorResponse.responses);
        }
        catch(e){
            useLogger().error(e)
            $toast.error('Error loading document')
        }
        finally{
            isLoading.value = false;
        }
    }

    function flattenQuestions(questions){
        return questions.map(e=>{
            if(e?.questions?.length)
                return flattenQuestions(e.questions);

            return e;
        })
        .flat().filter(e=>e)        
    }

    const  onAnswer = function(ans){
        updateQuestionEnablement(ans);
    }
    
    function buildValidationMap(questions){
        const validationsMap = {}
        questions.forEach(q=>{
            if(q.validations?.length){
                q.validations.forEach(v=>{
                    validationsMap[v.question] = validationsMap[v.question] || [];
                    validationsMap[v.question].push({...v, baseQuestionKey: q.key});
                });
            }
        });
        return validationsMap;
    }

    function updateQuestionEnablement(flatAnswers:Record<string, string>):void{
        const {questions, key, binaryIndicator, target } = binaryQuestion.value
        const flatQuestions = flattenQuestions(questions);
        const validationsMap= buildValidationMap(flatQuestions);
        
        flatQuestions.forEach(q=>{
            q.enabled = true;
        })
        flatQuestions
        .forEach(q=>{
            if(validationsMap[q.key]?.length){
                q.enabled = validationsMap[q.key].some(v=>{
                                                    return canEnableQuestion(v.baseQuestionKey, v, flatAnswers);
                                                });
            }
        }); 
    }

    function canEnableQuestion(questionKey:string, validation:any, flatAnswers:any):void {
        const questionAnswer = flatAnswers?.[questionKey];
        let validationPositive = false;
        
        if (questionAnswer) {
            if (validation.type === '@hasValues') {
                if (validation.values) {
                    if(Array.isArray(questionAnswer)){
                        validationPositive = questionAnswer.some(a=>validation.values.includes(a));
                    }
                    else{
                        validationPositive = validation.values.includes(questionAnswer);
                    }
                }
            }
        }

        return validationPositive;
    }


    provide('kmWorkflowFunctions', {
        onPreReviewDocument,
        onPreSaveDraft,
        onPostSaveDraft,
        onPostReviewDocument,
        onPostClose,
        onGetDocumentInfo
    });

    provide("validationReview", {
        hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    });

    onMounted(()=>{
        binaryQuestion.value = binaryIndicatorQuestions.value?.find(e=>e.binaryIndicator == props.indicator?.identifier);
    })
</script>
<style>
    /* .km-nav-wizard .nav-header, .km-nav-wizard .nav-footer{
        display: none;
    } */
</style>

