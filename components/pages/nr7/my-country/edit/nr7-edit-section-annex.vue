<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> NR7 Annex</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="isLoading">
            <km-spinner></km-spinner>
        </div>
        <form v-if="!isLoading" name="editForm">          
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument" :validation-report="validationReport" 
                :container="container" @on-pre-close="onClose" @on-post-save-draft="onPostSaveDraft"  :validate-server-draft="true">
                <template #submission>
                    
                    <km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                                Any other information
                            </div>
                            <div class="card-body">                      
                                <km-form-group required caption="" name="elementOfGlobalTargetsInfo">
                                    <km-input-rich-lstring v-model="document.elementOfGlobalTargetsInfo" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                                </km-form-group>                                    
                            </div>
                        </div>
                    </km-form-group>
                </template>
                <template #review>                
                    <view-nr7-section-I :identifier="document.header.identifier" :document="cleanDocument"></view-nr7-section-I>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import { useAsyncState } from '@vueuse/core'
    import { KmInputRichLstring, KmSelect, KmFormGroup, KmValidationErrors,KmGovernment, KmLanguages,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmSpinner, KmFormWorkflow
    } from "~/components/controls";
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
    const locale          = useI18n().locale
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
</script>
