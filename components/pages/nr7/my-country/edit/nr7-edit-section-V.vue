<template>
    <CCard>
      <CCardHeader>
        <slot name="header">
            {{ t('sectionV') }} : {{ t('sectionVDescription') }}
        </slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="isLoading">
            <km-spinner></km-spinner>
        </div>       
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument" :validation-report="validationReport" 
                :container="container" @on-pre-close="onClose" @on-post-save-draft="onPostSaveDraft" hidden-tabs="['introduction', 'publish']">
                <template #submission>
                    
                    <form v-if="!isLoading && sectionVComputed" name="editForm">   
                        <div class="card mt-2">                           
                            <div class="card-body"> 
                                <km-form-group name="sectionV" class="visually-hidden">
                                    <label class="form-label control-label" for="sectionV">
                                        <span >{{ t('sectionMandatory') }}</span>                                            
                                    </label>
                                </km-form-group>      
                                <div class="alert alert-info">
                                   {{ t('introduction') }}
                                </div>
                                <km-form-group name="assessmentSummaryInfo" required :caption="t('assessmentSummaryInfo')">                                    
                                    <km-input-rich-lstring v-model="sectionVComputed.assessmentSummaryInfo" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                                </km-form-group>                                    
                            </div>
                        </div>
                    </form>
                </template>
                <template #review>                
                    <nr7-view-section-V :identifier="document.header.identifier" :document="cleanDocument"></nr7-view-section-V>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-V.json"></i18n>
<script setup>
  
  import {cloneDeep } from 'lodash';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';

    const props = defineProps({
        workflowActiveTab  : {type:Number, default:1 },
    }) 
    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit  = defineEmits(['onClose', 'onPostSaveDraft'])

    const {t, locale }          = useI18n();     
    const nationalReport7Store  = useNationalReport7Store();
    const isBusy                = ref(true);
    const validationReport      = ref(null); 
    const container             = useAttrs().container;
    let document                = ref({});
    const isEventDefined        = useHasEvents();
    

    const sectionVComputed = computed({ 
        get(){ 
            return document.value.sectionV
        }
    });

    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};
        clean.sectionV = sectionVComputed.value;

        clean = useKmStorage().cleanDocument(clean);
        
        return clean;
    });

    const onPostClose = async (document)=>{
        
        if(isEventDefined('onClose'))
            emit('onClose', document);
        else{
            await useNavigateAppTo(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_OVERVIEW);
        }
    }

    const onPreSaveDraft = async (document)=>{
        return document;
    };

    const onPostSaveDraft = async (document)=>{
        emit('onPostSaveDraft', document);
        nationalReport7Store.updateNationalReport(document);
    }

    const onPostReviewDocument = async(document, newValidationReport)=>{
        validationReport.value     = cloneDeep(newValidationReport);

        if(validationReport.value?.errors)
            validationReport.value.errors = validationReport.value?.errors?.filter(e=>e.parameters=='sectionV');


        return validationReport.value;
    }
    
    const onPreReviewDocument = (document)=>{
        return document;
    }
    const onGetDocumentInfo = async ()=>{
        return nationalReport7Store.nationalReportInfo;
    }

    async function init(){
        isBusy.value = true;

        try{
            await nationalReport7Store.loadNationalReport();
            

            if(!nationalReport7Store.nationalReport.sectionV){
                nationalReport7Store.nationalReport.sectionV = {};
            }
            document.value = cloneDeep(nationalReport7Store.nationalReport);
        }
        catch(e){
            useLogger().error(e,  'Error loading Section V')
        }

        isBusy.value = false;
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
        // setTimeout(init, 200);
        init();
    })
</script>
