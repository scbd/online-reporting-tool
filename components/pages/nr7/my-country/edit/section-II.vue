<template>
    <CCard>
      <CCardHeader>
        <slot name="header">{{t('sectionII')}} {{t('sectionIIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="nationalReportStore.isBusy">
            <km-spinner></km-spinner>
        </div>
        <form v-if="!nationalReportStore.isBusy && nationalReportStore.nationalReportDraft" name="editForm">          
            <nr7-workflow :focused-tab="props.workflowActiveTab" :get-document="cleanDocument" :validation-report="validationReport" 
                :container="container" :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft">
                <template #submission>
                    <km-form-group>
                        <div class="card">
                            <div class="card-body">              
                                <km-form-group name="hasRevisedNbsap" :caption="t('revisedNbsap')">                                       
                                    <km-form-check-group>
                                        <km-form-check-item type="radio" name="hasRevisedNbsap"  for="hasRevisedNbsap" id="hasRevisedNbsapYes"       value="yes"        v-model="sectionII.hasRevisedNbsap.value" :label="t('yes')"/>
                                        <km-form-check-item type="radio" name="hasRevisedNbsap"  for="hasRevisedNbsap" id="hasRevisedNbsapNo"        value="no"         v-model="sectionII.hasRevisedNbsap.value" :label="t('no')"/>
                                        <km-form-check-item type="radio" name="hasRevisedNbsap"  for="hasRevisedNbsap" id="hasRevisedNbsapInProcess" value="inProcess"  v-model="sectionII.hasRevisedNbsap.value" :label="t('inProcess')"/>
                                    </km-form-check-group>                                    
                                </km-form-group>                       
                                <km-form-group name="hasRevisedNbsap.additionalInformation" :caption="t('indicateCompletionDate')"
                                    v-if="sectionII.hasRevisedNbsap && (sectionII.hasRevisedNbsap.value=='no' || sectionII.hasRevisedNbsap.value == 'inProcess')">  
                                    <CFormInput type="text" id="additionalInformation" v-model="sectionII.hasRevisedNbsap.additionalInformation"/>                             
                                </km-form-group>   
                                
                                <km-form-group name="hasStakeholderEngagement" :caption="t('stakeholderEngagement')">                                       
                                    <km-form-check-group>
                                        <km-form-check-item type="radio" name="hasStakeholderEngagement"  for="hasStakeholderEngagement" id="hasStakeholderEngagementTrue"       :value="true"        v-model="sectionII.hasStakeholderEngagement" :label="t('yes')"/>
                                        <km-form-check-item type="radio" name="hasStakeholderEngagement"  for="hasStakeholderEngagement" id="hasStakeholderEngagementFalse"      :value="false"       v-model="sectionII.hasStakeholderEngagement" :label="t('no')"/>
                                    </km-form-check-group>                                    
                                </km-form-group> 
                                <km-form-group name="stakeholders" :caption="t('stakeholders')" v-if="sectionII.hasStakeholderEngagement">    
                                            <!--   -->                                   
                                    <km-select
                                            v-model="sectionII.stakeholders"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            :placeholder="t('stakeholders')"
                                            :multiple="true"
                                            :disabled="false"    
                                            :options="stakeholderLists"   
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"                                    
                                        >
                                        </km-select>
                                </km-form-group>

                                <km-form-group name="hasNbsapAdopted" :caption="t('hasNbsapAdopted')">                                       
                                    <km-form-check-group>
                                        <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedYes"       value="yes"        v-model="sectionII.hasNbsapAdopted.value" :label="t('yes')"/>
                                        <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedNo"        value="no"         v-model="sectionII.hasNbsapAdopted.value" :label="t('no')"/>
                                        <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedInProcess" value="inProcess"  v-model="sectionII.hasNbsapAdopted.value" :label="t('inProcess')"/>
                                    </km-form-check-group>                                    
                                </km-form-group>                       
                                <km-form-group name="hasNbsapAdopted.additionalInformation" :caption="t('indicateAdoptionDate')"
                                    v-if="sectionII.hasNbsapAdopted && (sectionII.hasNbsapAdopted.value=='no' || sectionII.hasNbsapAdopted.value == 'inProcess')">                                       
                                    <CFormInput type="text" id="additionalInformation" v-model="sectionII.hasNbsapAdopted.additionalInformation"/>                             
                                </km-form-group>  

                                <km-form-group name="policyInstrument" :caption="t('policyInstrument')" v-if="(sectionII.hasNbsapAdopted||{}).value=='yes'">   
                                    <km-select
                                            v-model="sectionII.policyInstrument"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            :placeholder="t('stakeholders')"
                                            :multiple="false"
                                            :disabled="false"    
                                            :options="policyInstrumentLists"   
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"                                    
                                        >
                                        </km-select>
                                </km-form-group>
                            </div>
                        </div>
                    </km-form-group>
                </template>
                <template #review>                
                    <view-nr7-section-II :identifier="nationalReportStore.nationalReportDraft.header.identifier" :document="nationalReportStore.nationalReportDraft"></view-nr7-section-II>
                </template>
            </nr7-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/section-II.json"></i18n>
<script setup>
  
    import { useAsyncState } from '@vueuse/core'
    import { KmInputRichLstring, KmSelect, KmFormGroup, KmValidationErrors,KmGovernment, KmLanguages,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmSpinner
    } from "~/components/controls";
    import Nr7Workflow              from './NR7Workflow.vue'
    import viewNr7SectionII         from "@/components/pages/nr7/my-country/view/section-II.vue";
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
    const nationalReportStore = useNationalReport7Store();

    await nationalReportStore.loadNationalReportDraft()

    let sectionII = nationalReportStore.nationalReportDraft.sectionII;
    if(!sectionII){
        nationalReportStore.nationalReportDraft.sectionII = sectionII = toRef({});
    }
    if(!sectionII.hasRevisedNbsap){
        sectionII.hasRevisedNbsap = {};
    }
    if(!sectionII.hasNbsapAdopted){
        sectionII.hasNbsapAdopted = {};
    }
    if(!sectionII.hasStakeholderEngagement){
        sectionII.hasStakeholderEngagement = {};
    }


    const stakeholderLists = [
        {identifier: '1', title: 'Indigenous peoples and local communities,,'},
        {identifier: '1', title: 'Focal points for other multilateral environmental agreements,'},
        {identifier: '1', title: 'The Protocols and SDGs,  '},
        {identifier: '1', title: 'Subnational governments,'},
        {identifier: '1', title: 'Cities and other local authorities,'},
        {identifier: '1', title: 'Non-governmental organizations,'},
        {identifier: '1', title: 'Women\'s groups, youth groups,'},
        {identifier: '1', title: 'The business and finance community,'},
        {identifier: '1', title: 'The scientific community,'},
        {identifier: '1', title: 'Academia,'},
        {identifier: '1', title: 'Faith-based organizations'},
        {identifier: '1', title: 'Representatives of sectors related to or dependent on biodiversity,'},
        {identifier: '1', title: 'Citizens at large,'},
        {identifier: '1', title: 'Other stakeholders'},
        
    ]
    const policyInstrumentLists = [
        {identifier: '1', title: 'Adopted through legislation or otherwise by parliament'},
        {identifier: '1', title: 'Adopted by Council of Ministers, Office of the President/Prime Minister or equivalent whole-of-government body'},
        {identifier: '1', title: 'Adopted by Ministry of Environment or other sectoral ministry'},
        {identifier: '1', title: 'Integrated into the poverty reduction strategy, sustainable development strategy, national development plan, and other related strategies or plans'},
        {identifier: '1', title: 'Other (please specify)'},
    ]

    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }


    function cleanDocument(){
        const  clean = useKmStorage().cleanDocument({...nationalReportStore.nationalReportDraft});
        clean.sectionIII = undefined;
        return toRef(clean);
    }
</script>
