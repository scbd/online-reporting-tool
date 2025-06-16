<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('sectionOtherInformation')}} {{t('sectionOtherInformationDescription')}}</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="isBusy">
            <km-spinner></km-spinner>
        </div>
        <form v-if="!isBusy" name="editForm">          
            <km-form-workflow v-if="!isBusy && !nationalReport7Store.isBusy && nationalReport7Store.nationalReport"
            :focused-tab="props.workflowActiveTab" :document="cleanDocument" :validation-report="validationReport" 
                :container="container" @on-post-save-draft="onPostSaveDraft" 
                hidden-tabs="['introduction', 'publish']"  :admin-tags="['section-other-information']">
                <template #submission>
                    <form v-if="!isBusy && otherInformationComputed" name="editForm">   
                        <div class="card mt-2">                           
                            <div class="card-body"> 
                                <km-form-group name="additionalDocuments" :caption="t('additionalDocuments')">
                                    <small id="emailHelp" class="form-text text-muted">{{t('additionalDocumentsHelp')}}</small>
                                    <km-add-link-file name="additionalDocuments" v-model="otherInformationComputed.additionalDocuments" :allow-link="true" 
                                        :allow-file="true"  :identifier="document.header.identifier">
                                    </km-add-link-file>
                                </km-form-group>

                                <km-form-group :caption="t('additionalInformation')" name="additionalInformation">
                                    <small id="emailHelp" class="form-text text-muted">{{t('additionalInformationHelp')}}</small>
                                    <km-input-rich-lstring v-model="otherInformationComputed.additionalInformation" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                                </km-form-group>
                                </div>
                        </div>
                    </form>
                </template>
                <template #review>          
                    <nr7-view-section-other-information :identifier="document.header.identifier" :document="cleanDocument"></nr7-view-section-other-information>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-other-information.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    import {defineProps, defineEmits} from 'vue';
    import {cloneDeep } from 'lodash';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';

    const props = defineProps({
        workflowActiveTab  : {type:Number, default:0 },
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
    

    const otherInformationComputed = computed(()=>document.value.sectionOtherInfo);

    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};
        clean.sectionOtherInfo = otherInformationComputed.value;

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
            validationReport.value.errors = validationReport.value?.errors?.filter(e=>e.parameters=='otherInformation');


        return validationReport.value;
    }
    
    const onPreReviewDocument = (document:ENationalReport7)=>{
        return document;
    }
    const onGetDocumentInfo = async ()=>{
        return nationalReport7Store.nationalReportInfo;
    }

    async function init(){
        isBusy.value = true;

        try{
            await nationalReport7Store.loadNationalReport();
            

            if(!nationalReport7Store.nationalReport.sectionOtherInfo){
                nationalReport7Store.nationalReport.sectionOtherInfo = {};
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
        hasError : (name:string)=>validationReport.value?.errors?.find((e:any)=>e.property == name)
    });
    
    onMounted(()=>{
        // setTimeout(init, 200);
        init();
    })
</script>
