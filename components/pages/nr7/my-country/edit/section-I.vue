<template>
    <CCard>
      <CCardHeader>
        <slot name="header">{{t('sectionI')}} {{t('sectionIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="nationalReport7Store.isBusy">
            <km-spinner></km-spinner>
        </div>
        <form v-if="!nationalReport7Store.isBusy && nationalReport7Store.nationalReport" name="editForm">          
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument" :validation-report="validationReport" 
                :container="container" @on-pre-close="onClose" @on-post-save-draft="onPostSaveDraft">
                <template #submission>
                    <km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                                General
                            </div>
                            <div class="card-body">  
                                <km-form-group name="government" caption="Government" required>
                                    <km-government v-model="nationalReport7Store.nationalReport.government"></km-government>                           
                                </km-form-group>   

                                <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                    <km-languages v-model="nationalReport7Store.nationalReport.header.languages"></km-languages>
                                </km-form-group>   
                            </div>
                        </div>
                    </km-form-group>
                    <km-form-group>
                        <div class="card">
                            <div class="card-body">                      
                                <km-form-group required :caption="t('preparationProcess')" name="processUndertaken">
                                    <ul>
                                        <li>{{ t('coordination') }}</li>
                                        <li>{{ t('consultation') }}</li>
                                    </ul>
                                    <km-input-rich-lstring v-model="sectionI.processUndertaken" :locales="nationalReport7Store.nationalReport.header.languages"></km-input-rich-lstring>
                                </km-form-group>                                    
                            </div>
                        </div>
                    </km-form-group>
                </template>
                <template #review>                
                    <view-nr7-section-I :identifier="nationalReport7Store.nationalReport.header.identifier" :document="nationalReport7Store.nationalReport"></view-nr7-section-I>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/section-I.json"></i18n>
<script setup>
  
    import { useAsyncState } from '@vueuse/core'
    import { KmInputRichLstring, KmSelect, KmFormGroup, KmValidationErrors,KmGovernment, KmLanguages,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmSpinner
    } from "~/components/controls";
    import Nr7Workflow              from './NR7Workflow.vue'
    import viewNr7SectionI          from "@/components/pages/nr7/my-country/view/section-I.vue";
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { useStorage } from '@vueuse/core'
    import { EditFormUtility } from "@/services/edit-form-utility";

    const props = defineProps({
        workflowActiveTab  : {type:Number, default:0 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    }) 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }              = useI18n();
    const $toast                    = useToast();        
    const container = useAttrs().container;
    const nationalReport7Store = useNationalReport7Store();

    await nationalReport7Store.loadNationalReport()

    const sectionI = nationalReport7Store.nationalReport.sectionI;

    function cleanDocument(){
        const clean = useKmStorage().cleanDocument({...nationalReport7Store.nationalReport});
        return toRef(clean)
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
