<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{ t('nr7SectionVI') }}</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="isLoading">
            <km-spinner></km-spinner>
        </div>
        <form v-if="!isLoading" name="editForm">          
            <km-form-workflow v-if="!isBusy && !nationalReport7Store.isBusy && nationalReport7Store.nationalReport"
            :focused-tab="props.workflowActiveTab" :document="cleanDocument" :validation-report="validationReport" 
                :container="container" @on-pre-close="onClose" @on-post-save-draft="onPostSaveDraft" hidden-tabs="['introduction', 'publish']">
                <template #submission>
                    
                    <km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                               {{ t('elementsOfTheGlobalTargets') }}
                            </div>
                            <div class="card-body">                      
                                <km-form-group required :caption="t('elementsOfTheGlobalTargetsAddress')" name="elementOfGlobalTargetsInfo">
                                    <km-input-rich-lstring v-model="document.elementOfGlobalTargetsInfo" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                                </km-form-group>                                    
                            </div>
                        </div>
                    </km-form-group>
                </template>
                <template #review>                
                    <view-nr7-section-VI :identifier="document.header.identifier" :document="cleanDocument"></view-nr7-section-VI>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-VI.json"></i18n>
<script setup>

    // import viewTarget               from "./view-target-part-2.vue";
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { useStorage } from '@vueuse/core'
    import { EditFormUtility } from "@/services/edit-form-utility";

    const props = defineProps({
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    }) 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }              = useI18n();
    const $toast                = useToast();        
    const container = useAttrs().container;

    let document = {
        header : {
            schema : SCHEMAS.NATIONAL_REPORT_7,
            identifier : useGenerateUUID(),
            languages  : EditFormUtility.getPreferredEditLanguages()
        },        
        government : {
            identifier : user.value?.government
        },
    }


    // provide('kmWorkflowFunctions', {
    //     onPreReviewDocument,
    //     onPreSaveDraft,
    //     onPostSaveDraft,
    //     onPostReviewDocument,
    //     onPostClose
    // });

    // provide("validationReview", {
    //     hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    // });
</script>
