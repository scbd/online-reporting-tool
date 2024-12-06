<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ t('overview') }} </slot>
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
                    <CButton :disabled="disableActions" @click="onPublish()" color="secondary">
                        <km-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                        <font-awesome-icon icon="fa-bullhorn" :beat="isPublishing"></font-awesome-icon>
                        {{t('publish')}}
                    </CButton>
                    <CButton :disabled="disableActions" @click="onValidate(undefined)" color="secondary">
                        <km-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"  message=" "></km-spinner>
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
                <div class="card" :class="{'border-danger bg-danger text-white' : sectionIErrors?.length}">
                <div class="card-body">
                    <div class="h4 m-0">{{ t('sectionI') }}</div>
                    <hr>
                    <div>{{ t('briefOverviewOfProcess') }}</div>
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
                           
                            <CBadge color="info" v-if="isValidating">
                                <km-spinner :message="t('validating')"></km-spinner>
                            </CBadge>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_I" 
                                :title="t('hasErrors') + '('+ sectionIErrors.length + ')'" color="warning" v-if="sectionIErrors?.length"
                                role="button" class="btn btn-warning btn-sm">
                            </km-link>
                            <button :disabled="disableActions" role="button" class="btn btn-secondary btn-sm">{{ t('previewSectionI') }}</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_I" :title="t('editSectionI')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card" :class="{'border-danger bg-danger text-white' : sectionIIErrors?.length}">
                <div class="card-body">
                    <div class="h4 m-0">{{ t('sectionII') }}</div>
                    <hr>
                    <div>
                        {{ t('sectionIIDescription') }}
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
                            <CBadge color="info" v-if="isValidating">
                                <km-spinner :message="t('validating')"></km-spinner>
                            </CBadge>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_II" 
                                :title="t('hasErrors') + '('+ sectionIIErrors.length + ')'" color="warning" v-if="sectionIIErrors?.length"
                                role="button" class="btn btn-warning btn-sm">
                            </km-link>
                            
                            <button :disabled="disableActions" role="button" class="btn btn-secondary btn-sm">{{ t('previewSectionII') }}</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_II" :title="t('editSectionII')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">               
                <div class="card" :class="{'border-danger bg-danger text-white' : sectionIIIErrors?.length}">
                <div class="card-body">
                    <div class="h4 m-0">{{ t('sectionIII') }}</div>
                    <hr>
                    <div>
                        {{ t('assessmentOfProgressNationalTargets') }} 
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
                            <CBadge color="info" v-if="isValidating">
                                <km-spinner :message="t('validating')"></km-spinner>
                            </CBadge>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_III" 
                                :title="t('hasErrors') + '('+ sectionIIIErrors.length + ')'" color="warning" v-if="sectionIIIErrors?.length"
                                role="button" class="btn btn-warning btn-sm">
                            </km-link>
                            <button :disabled="disableActions" role="button" class="btn btn-secondary btn-sm">{{ t('previewSectionIII') }}</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_III" :title="t('editSectionIII')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card" :class="{'border-danger bg-danger text-white' : sectionIVErrors?.length}">
                <div class="card-body">
                    <div class="h4 m-0">{{ t('sectionIV') }}</div>
                    <hr>
                    <div>{{ t('sectionIVDescription') }}</div>
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
                            <CBadge color="info" v-if="isValidating">
                                <km-spinner :message="t('validating')"></km-spinner>
                            </CBadge>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_IV" 
                                :title="t('hasErrors') + '('+ sectionIVErrors.length + ')'" color="warning" v-if="sectionIVErrors?.length"
                                role="button" class="btn btn-warning btn-sm">
                            </km-link>
                            <button :disabled="disableActions" role="button" class="btn btn-secondary btn-sm">{{ t('previewSectionIV') }}</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_IV" :title="t('editSectionIV')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2">
                <div class="card" :class="{'border-danger bg-danger text-white' : sectionVErrors?.length}">
                <div class="card-body">
                    <div class="h4 m-0">{{ t('sectionV') }}</div>
                    <hr>
                    <div>
                        {{ t('conclusionsImplementationConvention') }}
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
                            <CBadge color="info" v-if="isValidating">
                                <km-spinner :message="t('validating')"></km-spinner>
                            </CBadge>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_V" 
                                :title="t('hasErrors') + '('+ sectionVErrors.length + ')'" color="warning" v-if="sectionVErrors?.length"
                                role="button" class="btn btn-warning btn-sm">
                            </km-link>
                            <button :disabled="disableActions" role="button" class="btn btn-secondary btn-sm">{{ t('previewSectionV') }}</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_V" :title="t('editSectionV')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>
            <CCol md="4" class="mt-2 d-none" >
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">{{ t('annex') }}</div>
                    <hr>
                    <div>
                    {{ t('informationAsRequested') }}
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
                            <button :disabled="disableActions" role="button" class="btn btn-secondary btn-sm">{{ t('previewSectionANNEX') }}</button>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_ANNEX" :title="t('editSectionANNEX')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>          
        </CRow>
        <CRow v-if="validationErrorDocuments?.length">
            <CCol class="mt-1" :md="12">
                <CCard>
                    <CCardBody>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>{{ t('draftRecords') }}</th>
                                    <td></td>
                                </tr>
                                <tr v-for="document in validationErrorDocuments" :key="document">
                                    <td>
                                        {{ lstring(document.title) }}
                                        {{ document?.body?.indicator?.identifier }}
                                    </td>
                                    <td >
                                        <div class="d-flex m-1">
                                            <CBadge color="info" v-if="document.isValidating">
                                                    <km-spinner :message="t('validating')"></km-spinner>
                                            </CBadge>
                                            <CBadge class="ms-1" color="warning" v-if="!document.isValidating && document.errors">
                                                {{t('hasErrors')}} ({{ document.errors.length }})
                                            </CBadge>
                                            <CBadge class="ms-1" color="info" v-if="document.validated && !document.isValidating && !document.errors">
                                                {{t('passedValidation')}}
                                            </CBadge>
                                            <km-document-status class="ms-1" :document="document" @on-status-change="onRecordStatusChange"></km-document-status>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- {{ validationErrorDocuments }} -->
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        <CRow>
            <CCol class="mt-1" :md="12">
                <CCard>
                    <CCardBody>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <CButton :disabled="disableActions" @click="onPublish()" color="secondary">
                                <km-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                                <font-awesome-icon icon="fa-bullhorn" :beat="isPublishing"></font-awesome-icon>
                                {{t('publish')}}
                            </CButton>
                            <CButton :disabled="disableActions" @click="onValidate(undefined)" color="secondary">
                                <km-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
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
                    <km-suspense>
                        <workflow-actions v-if="openWorkflow" :workflow="openWorkflow" @on-workflow-action="onWorkflowAction"></workflow-actions>
                    </km-suspense>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        
        <km-modal-spinner :visible="showSpinnerDialog" :message="t('spinnerMessage')"></km-modal-spinner>

        <CModal  class="show d-block" alignment="center" backdrop="static" @close="() => {showConfirmDialog=false}" :visible="showConfirmDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle class="bg-red">
                    {{t('confirmationTitle')}}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                {{t('confirmationMessage')}}
            </CModalBody>
            <CModalFooter>
                <CButton @click="confirmationDialogProceed()" color="success">{{t('yes')}}</CButton>
                <CButton @click="() => {showConfirmDialog=false}" color="danger">{{t('no')}}</CButton>
            </CModalFooter>
        </CModal>

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showSuccessDialog=false}" :visible="showSuccessDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{t('successTitle')}}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CAlert color="success" class="d-flex">
                    <font-awesome-icon icon="fa-solid fa-check" size="2x"/>
                    <div class="p-2">                             
                        {{t('successfulMessage')}}
                        <strong>
                            <div v-if="security.role.isNationalAuthorizedUser(SCHEMAS.NATIONAL_REPORT_7)">               
                                {{t('successMessageNau')}}
                            </div>
                            <div v-if="security.role.isPublishingAuthority(SCHEMAS.NATIONAL_REPORT_7)">               
                                {{t('successMessagePA')}}
                            </div>
                        </strong>
                    </div>
                </CAlert>
            </CModalBody>
            <CModalFooter>
                <CButton @click="() => {showSuccessDialog=false}" color="secondary">{{t('close')}}</CButton>
            </CModalFooter>
        </CModal>

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showValidationErrorDialog=false}" :visible="showValidationErrorDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{t('validationErrorsTitle')}}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                    <CAlert color="danger" class="d-flex align-items-center">
                        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                        <span class="p-2">                                
                            {{t('validationErrorsMessage')}}
                        </span>
                    </CAlert>
            </CModalBody>
            <CModalFooter>
                <CButton @click="() => {showValidationErrorDialog=false}" color="secondary">{{t('close')}}</CButton>
            </CModalFooter>
        </CModal>
      </CCardBody>
    </CCard>
  </template>
  <i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-overview.json"></i18n>

  <script setup lang="ts">
    import {cloneDeep } from 'lodash';
    import { useStorage } from '@vueuse/core'
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { useRealmConfStore } from '@/stores/realmConf';


    const { $appRoutes:appRoutes, $api } = useNuxtApp();
    const { user }              = useAuth()
    const {t, locale }          = useI18n(); 
    const security              = useSecurity();
    const isEventDefined        = useHasEvents();  
    const { container }         = useAttrs();
    const nationalReport7Store  = useNationalReport7Store();
    const realmConfStore        = useRealmConfStore();
    const realmConf             = realmConfStore.realmConf;
    const isBusy                = ref(true);
    const validationReport      = ref(null); 
    const document              = ref({});
    const nrProgress            = ref({});
    const draftRecords          = ref([]);
    const draftNr7Document      = ref({});

    const isValidating       = ref(false);
    const isLoadingRecords   = ref(false);
    const isPublishing       = ref(false);
    const showValidationErrorDialog = ref(false);
    const showConfirmDialog = ref(false);
    const showSuccessDialog = ref(false);
    const showSpinnerDialog         = ref(false);
    const confirmationPromise       = ref(null);
    const openWorkflow              = ref(null);
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });
    

    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};

        clean = useKmStorage().cleanDocument(clean);

        return clean;
    });

    const disableActions = computed(()=>isValidating.value || isBusy.value || isLoadingRecords.value || isPublishing.value)
    const validationErrorDocuments = computed(()=>draftRecords.value)//.filter(e=>e.errors?.length)
    const sectionIErrors    = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionI'));
    const sectionIIErrors   = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionII'));
    const sectionIIIErrors  = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionIII'));
    const sectionIVErrors   = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionIV'));
    const sectionVErrors    = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionV'));

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

        // if(document.annex?.additionalInformation)
        //     progress.sectionAnnex = 100;
        
        
        nrProgress.value = progress
    }


    async function onPublish(){
        
        try{ 

            await onValidate();
            const hasValidationErrors = [draftNr7Document.value, ...(draftRecords.value||[])].some(e=>e.errors);
            
            if(hasValidationErrors){
                showValidationErrorDialog.value = true;
                return;
            }
            
            //show user final confirmation
            const confirmationResponse = await showConfirmation();
            confirmationPromise.value = null;
            showConfirmDialog.value = false;

            if(confirmationResponse == 'close'){
                return;
            }

            showSpinnerDialog.value = true;
            isPublishing.value = true;
            const result = await KmDocumentDraftsService.bulkPublish(realmConf.realm, [SCHEMAS.NATIONAL_REPORT_7])
            //save batch id from api to local storage
            // result.batchId

            await sleep(10000);
            //disable all action buttons
            // disableActionButtons();
            //show user message
            showSuccessDialog.value = true;
        }
        catch(e){
            useLogger().error(e);
        }
        
        isPublishing.value = false;
        showSpinnerDialog.value = false;
    }

    async function onValidate(){
        try{
            isValidating.value = true; 

            if(!draftRecords.value?.length){
                const drafts = await Promise.all([
                    loadDraftRecords(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA),
                    loadDraftRecords(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA)
                ]);

                draftRecords.value = drafts.flat();
            }

            draftNr7Document.value = { body : cloneDeep(cleanDocument.value) };
            await validateDocuments([draftNr7Document.value, ...draftRecords.value]);
 
            
        }
        catch(e){
            useLogger().error(e)
        }

        isValidating.value = false;  
    }

    async function validateDocument(document:any){
        
        const { $api } = useNuxtApp();
        const data     = await $api.kmStorage.documents.validate(document);
 
        return data?.errors;

    }

    async function validateDocuments(documents){

        const promises = documents.map(async document=>{
            try{
                document.isValidating = true
                document.validated    = false;
                document.errors = undefined;
                const validationErrors = await validateDocument(document.body)
                if(validationErrors)
                    document.errors = [...validationErrors];
                
            }
            catch(e){
                useLogger().error(e);
                document.error = e;
            }
            document.validated = true;
            document.isValidating = false
        });

        return await Promise.all(promises);
    }
    
    async function loadDraftRecords(schema:String){

        let query = `(type eq '${schema}')`;
        if(user.value?.government)
            query += ` and owner eq 'country:${user.value.government}'` ;

        const result = await KmDocumentDraftsService.loadDraftDocuments(query,500, 'updatedOn desc', 0, true);  

        return result.Items;//?.map(e=>e.body);

    }
    
    async function showConfirmation(){
        const dialogPromise = new Promise(async function (resolvePromise,reject){
            showConfirmDialog.value = true;
            confirmationPromise.value = resolvePromise;
        })

        return dialogPromise;
    }

    async function confirmationDialogClose(){
        confirmationPromise.value('close')
    }
    async function confirmationDialogProceed(){
        confirmationPromise.value('proceed')
    }

    async function loadOpenWorkflow(lockedRecord: any, iteration:number=0) {
        const workflowId=lockedRecord?.workingDocumentLock?.lockID?.replace('workflow-', '');
        
        if(!workflowId)
            return;

        const workflow=await $api.kmWorkflows.getWorkflow(workflowId);
        if(workflow) {
            if(!workflow?.activities?.length && iteration < 5){
                await sleep(2000);
                return loadOpenWorkflow(lockedRecord, iteration+1)
            }
            else{
                openWorkflow.value=workflow;
                stateTargetWorkflow.value.batchId=undefined;
            }
        }
    }

    async function onWorkflowAction(actionData){
        // console.log(actionData);
        showSpinnerDialog.value = true;
        const workflow =  await $api.kmWorkflows.getWorkflow(actionData.workflowId);
        if(workflow){
            openWorkflow.value = undefined;
            stateTargetWorkflow.value.batchId = undefined;
        }

        showSpinnerDialog.value = false;
        
    }
    
    const onRecordStatusChange = async ({identifier, newDocument})=>{
        if(!openWorkflow.value){
            // if(!newDocument)
            //     newDocument = await KmDocumentDraftsService.loadDraftDocument(identifier);
            // loadOpenWorkflow(newDocument)
        }
    }

    onMounted(()=>{
        init();
    })
  </script>
  