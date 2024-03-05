<template>
    
    <div class="d-grid justify-content-end mb-2">
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="props.identifier" :disabled="props.disabled">
            {{ t('editIndicatorData') }}
        </CButton>
        <CButton color="primary" size="sm" @click="showEditIndicatorData(target)" v-if="!props.identifier" :disabled="props.disabled">
            {{ t('addIndicatorData') }}
        </CButton>
    </div>
    <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showEditIndicatorDataModal=false}" :visible="showEditIndicatorDataModal" >
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
                            :container="container" :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft">
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
                                                <km-questions :questions="binaryQuestion?.questions" v-model="binaryData[indicator.identifier]"></km-questions>
                                            </CCardBody>  
                                        </CCard>
                                    </div> 
                                    <div class="mt-3">
                                        <km-additional-information v-model="document.additionalInformation" :locales="document.header.languages">
                                            Any other information
                                        </km-additional-information>
                                    </div>
                                </div>                                 
                            </template>
                        </km-form-workflow>
                    </form>

                </CCardBody>
            </CCard>
        </CModalBody>   
    </CModal>
</template>

<script setup>
  
    import { useToast } from 'vue-toast-notification';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import ViewData from './nr7-view-indicator-data.vue';
    import {binaryIndicatorQuestions} from '~/app-data/binary-indicator-questions.js'
   
    const props = defineProps({
        identifier         : {type:String, required:false},
        rawDocument        : {type: Object },
        indicator          : {type:Object, required:true},
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    }) 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }          = useI18n()
    const $toast                = useToast();        
    const container = useAttrs().container;

    const binaryData = ref({});     
    const validationReport = ref(null);
    let document = ref({});
    let isLoading = ref(false);
    const showEditIndicatorDataModal = ref(false);
      
    if(props.rawDocument){
        document.value = cloneDeep({...props.rawDocument});
    }
    else{
        document.value = emptyDocument();
        //TODO:validate if there is a mapping record for the given target and load it instead
    }
    
    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        
        return clean
    });
    
    const binaryQuestion = computed(()=>{
        return binaryIndicatorQuestions.find(e=>e.binaryIndicator == props.indicator?.identifier)
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
    function emptyDocument(){        

        return {
            header : {
                schema : SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA,
                identifier : useGenerateUUID(),
                languages  : EditFormUtility.getPreferredEditLanguages()
            },        
            government : {
                identifier : user.value?.government
            },
            indicator : {
                identifier: props.indicator.identifier
            }
        }
    }

    function showEditIndicatorData(target){        
        showEditIndicatorDataModal.value = true;
    }

</script>
<style>
    /* .km-nav-wizard .nav-header, .km-nav-wizard .nav-footer{
        display: none;
    } */
</style>

