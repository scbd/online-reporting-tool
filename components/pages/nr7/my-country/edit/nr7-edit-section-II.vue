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
                                <km-form-check-item type="radio" name="hasRevisedNbsap"  for="hasRevisedNbsap" id="hasRevisedNbsapInProcess" value="inProcess"  v-model="sectionIIComputed.hasRevisedNbsap" :label="t('inProcess')"/>                               
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

                            <km-form-group name="hasNbsapAdopted" :caption="t('hasNbsapAdopted')" required>              
                                <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedYes"       value="yes"        v-model="sectionIIComputed.hasNbsapAdopted" :label="t('yes')"/>
                                <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedNo"        value="no"         v-model="sectionIIComputed.hasNbsapAdopted" :label="t('no')"/>
                                <km-form-check-item type="radio" name="hasNbsapAdopted"  for="hasNbsapAdopted" id="hasNbsapAdoptedInProcess" value="inProcess"  v-model="sectionIIComputed.hasNbsapAdopted" :label="t('inProcess')"/>
                            </km-form-group>  

                            <km-form-group name="anticipatedNbsapAdoptionDate" :caption="t('anticipatedNbsapAdoptionDate')"
                                v-if="showAnticipatedNbsapAdoptionDate" required>                                       
                                <CFormInput type="text" id="anticipatedNbsapAdoptionDate" v-model="sectionIIComputed.anticipatedNbsapAdoptionDate"/>                             
                            </km-form-group>  

                            <km-form-group name="policyInstrument" :caption="t('policyInstrument')"  required
                                v-if="sectionIIComputed.hasNbsapAdopted=='yes'">  
                                <km-select v-model="sectionIIComputed.policyInstrument"
                                    class="validationClass" label="title" track-by="identifier"
                                    value-key="identifier" :placeholder="t('policyInstrument')" :multiple="true"
                                    :close-on-select="false" 
                                    :disabled="false" :options="policyInstrumentLists" :custom-label="customLabel"
                                    :custom-selected-item="customSelectedItem">
                                </km-select>
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

<script setup>
  
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
    let document                = ref({});
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

        clean = useKmStorage().cleanDocument(clean);
        
        return clean;
    });
    const stakeholderLists                  = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.STAKEHOLDERS)||[]));
    const policyInstrumentLists             = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.POLICY_INSTRUMENTS)||[]));
    const showAnticipatedNbsapDate          = computed(()=>['no', 'inProcess'].includes(sectionIIComputed.value?.hasRevisedNbsap))
    const showAnticipatedNbsapAdoptionDate  = computed(()=>['no', 'inProcess'].includes(sectionIIComputed.value?.hasRevisedNbsap))

    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }

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
            newValidationReport.value.errors = newValidationReport.value?.errors?.filter(e=>e.parameters=='sectionII');

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

            await Promise.all([
                        thesaurusStore.loadDomainTerms(THESAURUS.STAKEHOLDERS),
                        thesaurusStore.loadDomainTerms(THESAURUS.POLICY_INSTRUMENTS),
                        nationalReport7Store.loadNationalReport()
                    ]);
            

            if(!nationalReport7Store.nationalReport.sectionII){
                nationalReport7Store.nationalReport.sectionII = {};
            }
            const sectionII = nationalReport7Store.nationalReport;
            if(!sectionII.hasRevisedNbsap){
                sectionII.hasRevisedNbsap = {};
            }
            if(!sectionII.hasNbsapAdopted){
                sectionII.hasNbsapAdopted = {};
            }
            if(!sectionII.hasStakeholderEngagement){
                sectionII.hasStakeholderEngagement = {};
            }                   
            nationalReport7Store.nationalReport = sectionII;
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

