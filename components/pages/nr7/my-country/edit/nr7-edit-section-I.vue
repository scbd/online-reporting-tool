<template>
    <CCard>
      <CCardHeader>
        <slot name="header">{{t('sectionI')}} {{t('sectionIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="nationalReport7Store.isBusy">
            <km-spinner center  ></km-spinner>
        </div>  

        <km-form-workflow v-if="!nationalReport7Store.isBusy && nationalReport7Store.nationalReport"
            :focused-tab="props.workflowActiveTab" :document="cleanDocument" 
            :container="container" :validate-server-draft="true">
            <template #submission>
                <form  name="editForm">  
                    <km-form-group name="sectionI" class="visually-hidden">
                        <label class="form-label control-label" for="sectionI">
                            <span >{{ t('sectionMandatory') }}</span>                                            
                        </label>
                    </km-form-group>      
                
                    <div class="card mb-3" v-if="document?.header">
                        <div class="card-header bg-secondary">
                            General
                        </div>
                        <div class="card-body">
                            <km-form-group name="government" caption="Government" required>
                                <km-government v-model="document.government"></km-government>                           
                            </km-form-group>   

                            <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                <km-languages v-model="document.header.languages"></km-languages>
                            </km-form-group>   
                        </div>
                    </div>
                    <div class="card" v-if="sectionIComputed">
                        <div class="card-body">                      
                            <km-form-group required :caption="t('preparationProcess')" name="processUndertaken">
                                <ul>
                                    <li>{{ t('coordination') }}</li>
                                    <li>{{ t('consultation') }}</li>
                                </ul>
                                <km-input-rich-lstring v-model="sectionIComputed.processUndertaken" :locales="document.header.languages"></km-input-rich-lstring>
                            </km-form-group>                                    
                        </div>
                    </div>
                </form>
            </template>
            <template #review>                
                <nr7-view-section-I :identifier="cleanDocument.header.identifier" :document="cleanDocument"></nr7-view-section-I>
            </template>
        </km-form-workflow>

        <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-I.json"></i18n>
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
    

    const sectionIComputed = computed({ 
        get(){ 
            return document.value.sectionI
        }
    });

    const cleanDocument = computed(()=>{
        let clean = {...document.value};
        clean.sectionI = sectionIComputed.value;
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
        if(newValidationReport.value?.errors)
            newValidationReport.value.errors = newValidationReport.value?.errors?.filter(e=>e.parameters=='sectionI');

        validationReport.value     = newValidationReport.value;

        return newValidationReport.value;
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
            

            if(!nationalReport7Store.nationalReport.sectionI){
                nationalReport7Store.nationalReport.sectionI = {};
            }                   
            document.value = cloneDeep(nationalReport7Store.nationalReport);
        }
        catch(e){
            useLogger().error(e,  'Error loading Section I')
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

