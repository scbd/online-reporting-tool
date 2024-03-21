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
                {{lstring(props.indicator.title)}}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CCard>
                <CCardBody>
                    <div  v-if="isLoading">
                        <km-spinner></km-spinner>
                    </div>
                    <form v-if="!isLoading && document" name="editForm">
                        <km-form-workflow :focused-tab="props.workflowActiveTab" :get-document="onGetDocument" :validation-report="validationReport" 
                            :container="container" :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft"
                            @on-validation-errors="onValidationErrors">

                            <template #validation-errors="{onJumpTo}" v-if="customValidationErrors">
                                <km-validation-errors 
                                    :report="customValidationErrors" :container="container" @on-jump-to="onJumpTo">
                                </km-validation-errors>
                            </template>
                            <template #submission>   
                                <div class="mb-3">
                                    <CAccordion always-open id="mapping-accordion" class="mt-3 mb-3">                    
                                        <CAccordionItem :visible="true">
                                            <CAccordionHeader id="generalAccordion">
                                                General                       
                                            </CAccordionHeader>
                                            <CAccordionBody> 
                                                <km-form-group name="government" caption="Government" required>
                                                    <km-government v-model="document.government"></km-government>                           
                                                </km-form-group>   

                                                <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                                    <km-languages v-model="document.header.languages"></km-languages>
                                                </km-form-group>                                
                                            </CAccordionBody>
                                        </CAccordionItem>
                                    </CAccordion>   
                                    <div class="">     
                                        <CCard>
                                            <CCardBody>                 
                                                <km-questions :questions="binaryQuestion?.questions" 
                                                    v-model="document[binaryQuestion.key].responses"></km-questions>
                                            </CCardBody>  
                                        </CCard>
                                    </div> 
                                    <div class="mt-3">
                                        <km-additional-information v-model="document[binaryQuestion.key].comments" :locales="document.header.languages">
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
<script setup>
    
    import {cloneDeep} from 'lodash';
    import { useToast } from 'vue-toast-notification';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { KmDocumentsService } from '~/services/kmDocuments';
    import { KmDocumentDraftsService } from '~/services/kmDocumentDrafts';
    import ViewData from './nr7-view-indicator-data.vue';
    import {binaryIndicatorQuestions as binaryIndicatorSource} from '~/app-data/binary-indicator-questions.js'
   
    const props = defineProps({
        identifier         : {type:String, required:false},
        // rawDocument        : {type: Object },
        indicator          : {type:Object, required:true},
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    }) 

    const binaryIndicatorQuestions = reactive(cloneDeep(binaryIndicatorSource));
    const { user }                = useAuth();
    const security                = useSecurity();
    const route                   = useRoute();
    const {$appRoutes:appRoutes } = useNuxtApp();
    const {t, locale }            = useI18n()
    const $toast                  = useToast();
    const container               = useAttrs().container;
    const { $eventBus }           = useNuxtApp();

    const validationReport           = ref(null);
    let   document                   = ref({});
    let   isLoading                  = ref(false);
    const showEditIndicatorDataModal = ref(false);
    const customValidationErrors     = ref(null);

    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        
        return clean
    });
    
    const binaryQuestion = computed(()=>{
        return binaryIndicatorQuestions
                .find(e=>e.binaryIndicator == props.indicator?.identifier);
    })

    function onGetDocument(){
        return cleanDocument;
    }

    const onClose = async (document)=>{
        if(props.onClose)
            props.onClose(document);

        showEditIndicatorDataModal.value = false;
    }

    const onPostSaveDraft = async (document)=>{
        if(props.onPostSaveDraft)
            props.onPostSaveDraft(document)
    }
    const onValidationErrors = (validationResponse)=>{
        console.log(validationResponse);
        if(!validationReport?.error){
            customValidationErrors.value = {
                errors : [
                    // {
                    //     "code": "Error.Mandatory",
                    //     "property": "b_2"
                    // },
                ]
            }
        $eventBus.emit('onReviewError', customValidationErrors.value);
        }
    }

    function showEditIndicatorData(target){ 
        showEditIndicatorDataModal.value = true;
        loadDocument();
    }


    async function loadDocument(){
        try{
            isLoading.value = true;
            if(props.identifier){
                const documentInfo = await EditFormUtility.load(props.identifier, SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA)
                document.value = documentInfo.body;
                // const keys = binaryQuestions.questions.flat(3).map(e=>e.key)
                // binaryData.value.answers = answersDummy.filter(e=>keys.includes(e.question))
                // binaryQuestion
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
        }
        catch(e){
            useLogger().error(e)
            $toast.error('Error loading document')
        }
        finally{
            isLoading.value = false;
        }
    }

</script>
<style>
    /* .km-nav-wizard .nav-header, .km-nav-wizard .nav-footer{
        display: none;
    } */
</style>

