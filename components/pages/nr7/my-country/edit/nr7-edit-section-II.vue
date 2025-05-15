<template>
    <CCard>
      <CCardHeader>
        <slot name="header">{{t('sectionII')}} {{t('sectionIIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="nationalReport7Store.isBusy">
            <km-spinner center></km-spinner>
        </div>
        <form v-if="!nationalReport7Store.isBusy && sectionIIComputed" name="editForm">          
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument"
                :container="container" :validate-server-draft="true">
                <template #submission>
                    <div class="card">
                        <div class="card-body">   
                            <km-form-group name="sectionII" class="visually-hidden">
                                <label class="form-label control-label" for="sectionII">
                                    <span >{{ t('sectionMandatory') }}</span>                                            
                                </label>
                            </km-form-group>      
                                
                            <km-form-group name="hasRevisedNbsap" :caption="t('revisedNbsap')" required>    
                                <km-form-check-item type="radio" name="hasRevisedNbsap"  for="hasRevisedNbsap" id="hasRevisedNbsapYes"       value="yes"        v-model="sectionIIComputed.hasRevisedNbsap" :label="t('yes')"/>
                                <km-form-check-item type="radio" name="hasRevisedNbsap"  for="hasRevisedNbsap" id="hasRevisedNbsapNo"        value="no"         v-model="sectionIIComputed.hasRevisedNbsap" :label="t('no')"/>
                                <km-form-check-item type="radio" name="hasRevisedNbsap"  for="hasRevisedNbsap" id="hasRevisedNbsapinProgress" value="inProgress"  v-model="sectionIIComputed.hasRevisedNbsap" :label="t('inProgress')"/>                               
                            </km-form-group>                       
                            <km-form-group name="anticipatedNbsapDate" :caption="t('anticipatedNbsapDate')" required
                                v-if="showAnticipatedNbsapDate"> 
                                <div class="col-1">
                                    <date-selector class="form-control" v-model="sectionIIComputed.anticipatedNbsapDate"></date-selector>
                                </div>
                            </km-form-group>   
                            
                            <km-form-group name="hasStakeholderEngagement" :caption="t('stakeholderEngagement')" required>                                       
                                <km-form-check-item type="radio" name="hasStakeholderEngagement"  for="hasStakeholderEngagement" id="hasStakeholderEngagementTrue"       :value="true"        v-model="sectionIIComputed.hasStakeholderEngagement" :label="t('yes')"/>
                                <km-form-check-item type="radio" name="hasStakeholderEngagement"  for="hasStakeholderEngagement" id="hasStakeholderEngagementFalse"      :value="false"       v-model="sectionIIComputed.hasStakeholderEngagement" :label="t('no')"/>                                                             
                            </km-form-group> 

                            <km-form-group name="stakeholders" :caption="t('stakeholders')"  required
                                v-if="sectionIIComputed.hasStakeholderEngagement==true">                                                                            
                                <km-select v-model="sectionIIComputed.stakeholders"
                                    class="validationClass" label="title" track-by="identifier" value-key="identifier"
                                    :placeholder="t('stakeholders')" :multiple="true" :disabled="false" :options="stakeholderLists"   
                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"
                                    :close-on-select="false" >
                                </km-select>
                            </km-form-group>

                            <km-form-group name="stakeholders.other" :caption="t('otherStakeholderInfo')"
                                v-if="showStakeholderInfo" required>                                  
                                <km-input-lstring id="stakeholders.other" :placeholder="t('otherStakeholderInfo')" 
                                    v-model="otherStakeholderInfo" :locales="document.header.languages">
                                </km-input-lstring>                                                       
                            </km-form-group>  

                            <km-form-group name="hasNbsapAdopted" :caption="t('hasNbsapAdopted')" required>              
                                <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedYes"       value="yes"        v-model="sectionIIComputed.hasNbsapAdopted" :label="t('yes')"/>
                                <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedNo"        value="no"         v-model="sectionIIComputed.hasNbsapAdopted" :label="t('no')"/>
                                <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedinProgress" value="inProgress"  v-model="sectionIIComputed.hasNbsapAdopted" :label="t('inProgress')"/>
                                <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedOther"     value="other"      v-model="sectionIIComputed.hasNbsapAdopted" :label="t('other')"/>
                            </km-form-group> 
 
                            <km-form-group name="hasNbsapAdoptedInfo" :caption="t('hasNbsapAdoptedInfo')"
                                v-if="showAnticipatedNbsapAdoptionDate" required>                                  
                                <km-input-lstring id="hasNbsapAdoptedInfo" :placeholder="t('hasNbsapAdoptedInfo')" 
                                    v-model="sectionIIComputed.hasNbsapAdoptedInfo" :locales="document.header.languages">
                                </km-input-lstring>                                                       
                            </km-form-group>  
                            <km-form-group name="anticipatedNbsapAdoptionDate" :caption="t('anticipatedNbsapAdoptionDate')"
                                v-if="showAnticipatedNbsapAdoptionDate" required>  
                                <div class="col-1">                                  
                                    <date-selector class="form-control" v-model="sectionIIComputed.anticipatedNbsapAdoptionDate"></date-selector>                            
                                </div>   
                            </km-form-group> 

                            <km-form-group name="policyInstrument" :caption="t('policyInstrument')"  required
                                v-if="sectionIIComputed.hasNbsapAdopted=='yes'">  
                                <km-select v-model="sectionIIComputed.policyInstrument"
                                    class="validationClass" label="title" track-by="identifier"
                                    value-key="identifier" :placeholder="t('policyInstrument')"
                                    :disabled="false" :options="policyInstrumentLists" :custom-label="customLabel"
                                    :custom-selected-item="customSelectedItem">
                                </km-select>
                            </km-form-group>
                            <km-form-group name="policyInstrument.other" :caption="t('otherPolicyInstrumentInfo')"
                                v-if="sectionIIComputed.policyInstrument?.identifier == THESAURUS.OTHER" required>                                  
                                <km-input-lstring id="policyInstrument.other" :placeholder="t('otherPolicyInstrumentInfo')" 
                                    v-model="sectionIIComputed.policyInstrument.customValue" :locales="document.header.languages">
                                </km-input-lstring>                                                       
                            </km-form-group>  
                                
                            <km-form-group required :caption="t('implementationProgress')" name="implementationProgress">
                                <km-input-rich-lstring v-model="sectionIIComputed.implementationProgress" :locales="document.header.languages" :identifier="cleanDocument?.header?.identifier"></km-input-rich-lstring>
                            </km-form-group>  
                        </div>
                    </div>
                </template>
                <template #review>                
                    <nr7-view-section-II :identifier="cleanDocument.header.identifier" :document="cleanDocument"></nr7-view-section-II>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-II.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
  
    import {cloneDeep } from 'lodash';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useThesaurusStore }    from '@/stores/thesaurus';

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
    const document              = ref({});
    const otherStakeholderInfo  = ref(null);
    const isEventDefined        = useHasEvents();
    const thesaurusStore        = useThesaurusStore ();
    

    const sectionIIComputed = computed({ 
        get(){ 
            return document.value.sectionII
        }
    });

    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};
        clean.sectionII = sectionIIComputed.value;

        if(!showAnticipatedNbsapDate.value)
            clean.sectionII.anticipatedNbsapDate = undefined;
        if(!showAnticipatedNbsapAdoptionDate.value){ 
            clean.sectionII.anticipatedNbsapAdoptionDate = undefined;
            clean.sectionII.hasNbsapAdoptedInfo          = undefined;
        }

        if(!clean.sectionII.hasStakeholderEngagement)
            clean.sectionII.stakeholders = undefined;

        if(showStakeholderInfo.value){            
            const otherStakeholder = clean.sectionII.stakeholders.find(e=>e.identifier == THESAURUS.OTHER);
            otherStakeholder.customValue = otherStakeholderInfo.value;
        }

        if(clean.sectionII.hasNbsapAdopted!='yes')
            clean.sectionII.policyInstrument = undefined;
        
        clean = useKmStorage().cleanDocument(clean);
        
        return clean;
    });
    const stakeholderLists                  = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.STAKEHOLDERS)||[]));
    const policyInstrumentLists             = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.POLICY_INSTRUMENTS)||[]));
    const showAnticipatedNbsapDate          = computed(()=>['no', 'inProgress'].includes(sectionIIComputed.value?.hasRevisedNbsap))
    const showAnticipatedNbsapAdoptionDate  = computed(()=>['no', 'other'].includes(sectionIIComputed.value?.hasNbsapAdopted))
    const showStakeholderInfo               = computed(()=>sectionIIComputed.value?.stakeholders?.map(e=>e.identifier)?.includes(THESAURUS.OTHER))
    
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
            validationReport.value.errors = validationReport.value?.errors?.filter(e=>e.parameters=='sectionII');


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

            await Promise.all([
                        thesaurusStore.loadDomainTerms(THESAURUS.STAKEHOLDERS, {other: true}),
                        thesaurusStore.loadDomainTerms(THESAURUS.POLICY_INSTRUMENTS, {other: true}),
                        nationalReport7Store.loadNationalReport()
                    ]);
            

            if(!nationalReport7Store.nationalReport.sectionII){
                nationalReport7Store.nationalReport.sectionII = {};
            }
            const sectionII = nationalReport7Store.nationalReport.sectionII;
            if(!sectionII.hasRevisedNbsap){
                sectionII.hasRevisedNbsap = {};
            }
            if(!sectionII.hasNbsapAdopted){
                sectionII.hasNbsapAdopted = {};
            }
            if(!sectionII.hasStakeholderEngagement){
                sectionII.hasStakeholderEngagement = {};
            }         
            if(sectionII.stakeholders?.length){
                const otherStakeholder = sectionII.stakeholders.find(e=>e.identifier == THESAURUS.OTHER);
                otherStakeholderInfo.value = otherStakeholder.customValue;
            }

            nationalReport7Store.nationalReport.sectionII = sectionII;
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

