<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> Overview </slot>
      </CCardHeader>
      <CCardBody>
        <!-- {{ nrProgress }} -->
        <CRow>
          <CCol md="12">
            <div class="alert alert-success" role="alert">
              <p>
               {{t('welcome', { government :user.government})}}
              </p>
              <hr />
            </div>
          </CCol>
  
          <CCol md="12">
            <div class="card">
              <div class="card-body">
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton :disabled="disableActions || !showPublishBtn" @click="onPublish()" color="secondary">
                        <c-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                        <font-awesome-icon icon="fa-bullhorn" :beat="isPublishing"></font-awesome-icon>
                        {{t('publish')}}
                    </CButton>
                    <CButton :disabled="disableActions" @click="onValidate(undefined)" color="secondary">
                        <c-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                        <font-awesome-icon icon="fa-file-shield"></font-awesome-icon>
                        {{t('validate')}}
                    </CButton>
                    <CButton @click="onRefresh()" color="secondary" style="z-index: 1000;" :disabled="isLoading||isPublishing||isValidating">
                        <font-awesome-icon icon="fa-arrows-rotate" :spin="isLoading"/>
                        {{t('refresh')}}
                    </CButton>
                  <!-- <CButton color="warning m-1">
                    <CIcon icon="cil-share"/> Share
                  </CButton>
  
                  <CButton color="danger m-1">
                    <CIcon icon="cil-file-pdf"/> PDF
                  </CButton> -->
                </div>
              </div>
            </div>
          </CCol>
        </CRow>
        <CRow>
       
            <CCol md="4" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section I</div>
                    <hr>
                    <div>Brief overview of the process of preparation of the report</div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        class="progress-bar bg-info"
                        :aria-valuenow="nrProgress.sectionI"
                        :style="{ width: nrProgress.sectionI + '%'}"
                    ></div>
                    </div>
                    <small class="text-muted d-grid gap-2 d-md-flex justify-content-md-end">
                        <div class="d-grid gap-1 d-flex mt-2">
                            <button role="button" class="btn btn-secondary btn-sm">Preview section I</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_I" title="Edit section I" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section II</div>
                    <hr>
                    <div>
                        Status of the revised or updated national biodiversity strategies and action plans (NBSAPs) in the light of the Kunming-Montreal Global Biodiversity Framework 
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        class="progress-bar bg-info"
                        :aria-valuenow="nrProgress.sectionII"
                        :style="{ width: nrProgress.sectionII + '%'}"
                    ></div>
                    </div>
                    <small class="text-muted d-grid gap-2 d-md-flex justify-content-md-end">
                        <div class="d-grid gap-1 d-flex mt-2">
                            <button role="button" class="btn btn-secondary btn-sm">Preview section I</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_II" title="Edit section I" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section III</div>
                    <hr>
                    <div>
                        Assessment of progress towards national targets 
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        class="progress-bar bg-info"
                        :aria-valuenow="nrProgress.sectionIII"
                        :style="{ width: nrProgress.sectionIII + '%'}"
                    ></div>
                    </div>
                    <small class="text-muted d-grid gap-2 d-md-flex justify-content-md-end">
                        <div class="d-grid gap-1 d-flex mt-2">
                            <button role="button" class="btn btn-secondary btn-sm">Preview section I</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_III" title="Edit section I" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section IV</div>
                    <hr>
                    <div>Assessment of national progress towards the goals and targets of the Kunming-Montreal Global Biodiversity Framework</div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        class="progress-bar bg-info"
                        :aria-valuenow="nrProgress.sectionIV"
                        :style="{ width: nrProgress.sectionIV + '%'}"
                    ></div>
                    </div>
                    <small class="text-muted d-grid gap-2 d-md-flex justify-content-md-end">
                        <div class="d-grid gap-1 d-flex mt-2">
                            <button role="button" class="btn btn-secondary btn-sm">Preview section I</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_IV" title="Edit section I" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section V</div>
                    <hr>
                    <div>
                        Conclusions on the national implementation of the Convention and the Kunming-Montreal Global Biodiversity Framework
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        class="progress-bar bg-info"
                        :aria-valuenow="nrProgress.sectionV"
                        :style="{ width: nrProgress.sectionV + '%'}"
                    ></div>
                    </div>
                    <small class="text-muted d-grid gap-2 d-md-flex justify-content-md-end">
                        <div class="d-grid gap-1 d-flex mt-2">
                            <button role="button" class="btn btn-secondary btn-sm">Preview section I</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_V" title="Edit section I" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Annex</div>
                    <hr>
                    <div>
                    Information as requested in related decisions adopted by the
                    Conference of the Parties at its fifteenth meeting
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        class="progress-bar bg-info"
                        :aria-valuenow="nrProgress.sectionAnnex"
                        :style="{ width: nrProgress.sectionAnnex + '%'}"
                    ></div>
                    </div>
                    <small class="text-muted d-grid gap-2 d-md-flex justify-content-md-end">
                        <div class="d-grid gap-1 d-flex mt-2">
                            <button role="button" class="btn btn-secondary btn-sm">Preview section I</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_ANNEX" title="Edit section I" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>          
        </CRow>
        <CRow>
            <CCol class="mt-1" :md="12">
                <CCard>
                    <CCardBody>
                    <div class=" float-end d-grid gap-1 d-flex">
                        <CButton :disabled="disableActions || !showPublishBtn" @click="onPublish()" color="secondary">
                            <c-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            {{t('publish')}}
                        </CButton>
                        <CButton :disabled="disableActions" @click="onValidate(undefined)" color="secondary">
                            <c-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            {{t('validatePartIAndPartII')}}
                        </CButton>
                    </div>
                    <km-suspense>
                        <workflow-actions v-if="openWorkflow" :workflow="openWorkflow" @on-workflow-action="onWorkflowAction"></workflow-actions>
                    </km-suspense>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        
      </CCardBody>
    </CCard>
  </template>
  <i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-overview.json"></i18n>

  <script setup lang="ts">
    import {cloneDeep } from 'lodash';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';

    const { user } = useAuth()
    const {t, locale }          = useI18n();     
    const nationalReport7Store  = useNationalReport7Store();
    const isBusy                = ref(true);
    const validationReport      = ref(null); 
    const container             = useAttrs().container;
    let document                = ref({});
    const isEventDefined        = useHasEvents();
    const nrProgress            = ref({});
    
    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};

        clean = useKmStorage().cleanDocument(clean);

        return clean;
    });

    async function init(){
        isBusy.value = true;

        try{
            await nationalReport7Store.loadNationalReport();     
            validatedProgress()       
        }
        catch(e){
            useLogger().error(e,  'Error loading NR7 Overview')
        }

        isBusy.value = false;
    }

    function validatedProgress(){
        const fields = {
            sectionI : ['processUndertaken'],
            sectionII: [
                'hasRevisedNbsap',
                'anticipatedNbsapDate',
                'hasStakeholderEngagement',
                'stakeholders',
                'hasNbsapAdopted',
                'anticipatedNbsapAdoptionDate',
                'policyInstrument',
            ],
            sectionIII:[
                'target',
                'mainActionsInfo',
                'levelOfProgress',
                'progressSummaryInfo',
                'data',
                'actionEffectivenessInfo',
                'sdgRelationInfo'
            ],
            sectionIV :[
                'gbfGoal',
                'summaryOfProgress',
                'indicatorData'
            ],
            sectionV: ['assessmentSummaryInfo']
        }

        const document= cleanDocument.value;
        const progress = {
            sectionI : 0,
            sectionII : 0,
            sectionIII : 0,
            sectionIV : 0,
            sectionV : 0,
            sectionAnnex : 0
        }

        if(document.sectionI?.processUndertaken)
            progress.sectionI = 100;
            
        
        if(document.sectionII?.hasRevisedNbsap!=undefined){
            progress.sectionII = 25;
        }

        if(['no', 'inProgress'].includes(document.sectionII?.hasRevisedNbsap) 
            && document.sectionII?.anticipatedNbsapDate!= undefined){
                progress.sectionII -= 15;
        }

        if(document.sectionII?.hasStakeholderEngagement != undefined){
            progress.sectionII += 25;
        }
        if(document.sectionII?.hasStakeholderEngagement && 
            document.sectionII?.stakeholders == undefined){
                progress.sectionII -= 15;
        }

        if(document.sectionII?.hasNbsapAdopted != undefined){
            progress.sectionII += 25;
        }
        if(['no', 'inProgress'].includes(document.sectionII?.hasNbsapAdopted) 
            && document.sectionII?.anticipatedNbsapAdoptionDate != undefined){
                progress.sectionII -= 15;
        }

        if(document.sectionII?.policyInstrument != undefined){
            progress.sectionII += 25;
        }

        if(document.sectionV?.assessmentSummaryInfo)
            progress.sectionV = 100;

        if(document.annex?.additionalInformation)
            progress.sectionAnnex = 100;
        
        
        nrProgress.value = progress
    }
    

    // provide('kmWorkflowFunctions', {
    //     onPreReviewDocument,
    //     onPreSaveDraft,
    //     onPostSaveDraft,
    //     onPostReviewDocument,
    //     onPostClose,
    //     onGetDocumentInfo
    // });

    // provide("validationReview", {
    //     hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    // });
    
    onMounted(()=>{
        // setTimeout(init, 200);
        init();
    })
  </script>
  