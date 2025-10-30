<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ t('overview') }} </slot>
      </CCardHeader>
      <CCardBody>
        <!-- {{ nrProgress }} -->
         
        <CRow>
          <!-- <CCol md="12">
            <div class="alert alert-success" role="alert">
              <p>
               {{t('welcome', { government :user.government})}}
              </p>
              <hr />
            </div>
          </CCol> -->
  
          <CCol md="12">
            <div class="card">
              <div class="card-body">                
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton :disabled="disableActions" @click="onPreview()" color="secondary">
                        <km-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                        <font-awesome-icon icon="fa-eye"></font-awesome-icon>
                        {{showPreview ? t('hidePreview') : t('preview')}}
                    </CButton>
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
                    <CButton color="secondary" @click="onPdf" style="z-index: 1000;" :disabled="isLoading||isPublishing||isValidating">
                        <font-awesome-icon icon="fa-file-pdf" :spin="isLoading"/> PDF
                    </CButton>
                </div>
                <small class="form-text text-muted float-end">Click on preview to generate PDF or print NR7</small>
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
                            
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_I+ '?preview=true'" :title="t('previewSectionI')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_I+ '?edit=true'" :title="t('editSectionI')" 
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
                            
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_II+ '?preview=true'" :title="t('previewSectionII')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_II+ '?edit=true'" :title="t('editSectionII')" 
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
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_III+ '?preview=true'" :title="t('previewSectionIII')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_III+ '?edit=true'" :title="t('editSectionIII')" 
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
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_IV+ '?preview=true'" :title="t('previewSectionIV')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_IV+ '?edit=true'" :title="t('editSectionIV')" 
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
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_V+ '?preview=true'" :title="t('previewSectionV')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_V+ '?edit=true'" :title="t('editSectionV')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>

            <CCol md="4" class="mt-2" >
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">{{ t('otherInformation') }}</div>
                    <hr>
                    <div>
                    {{ t('sectionOtherInfoDescription') }}
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        class="progress-bar bg-info"
                        :aria-valuenow="nrProgress.sectionOtherInfo"
                        :style="{ width: nrProgress.sectionOtherInfo + '%'}"
                    ></div>
                    </div>
                    <small class="text-muted d-grid gap-2 d-md-flex justify-content-md-end">
                        <div class="d-grid gap-1 d-flex mt-2">
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_OTHER_INFORMATION+ '?preview=true'" :title="t('previewSectionOtherInfo')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                            <km-link :disabled="disableActions" :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_OTHER_INFORMATION+ '?edit=true'" :title="t('editSectionOtherInfo')" 
                                role="button" class="btn btn-secondary btn-sm"></km-link>
                        </div>
                    </small>
                </div>
                </div>
            </CCol>          
        </CRow>
        <CRow v-if="validationErrorDrafts?.length">
            <CCol class="mt-1" :md="12">
                <CCard>
                    <CCardBody>
                        <table class="table table-bordered">
                            <tbody>
                                <tr>
                                    <th colspan="2">{{ t('hasErrors') }}</th>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div class="alert alert-danger">
                                            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                                            {{t('missingIndicatorFieldsMessage')}}                                            
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="document in validationErrorDrafts" :key="document" :class="{'table-danger': document.errors?.length}">
                                    <td>
                                        {{ lstring(document.workingDocumentTitle||document.title) }}
                                        <strong>({{ document?.body?.indicator?.identifier }})</strong>
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
                        <table class="table table-bordered" v-if="missingIndicatorData?.length">
                            <tbody>
                                <tr >                                    
                                    <th>{{ t('missingIndicatorData') }}</th>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colspan="2">
                                        <div class="alert alert-danger">
                                            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                                            {{t('missingIndicatorDataMessage')}}                                            
                                        </div>
                                    </td>
                                </tr>
                                <tr v-for="indicator in missingIndicatorData" :key="indicator">
                                    <td>
                                        {{ lstring(indicator.title) }}
                                        <strong>({{ indicator?.identifier }})</strong>
                                    </td>
                                    <td>
                                        <CBadge color="danger">
                                            {{t('notSubmitted')}}
                                        </CBadge>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- {{ validationErrorDrafts }} -->
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
        
        <CRow v-if="!isLoading && cleanDocumentInfo && showPreview" id="nr7-preview-section">
            <CCol class="mt-1" :md="12">     
                <view-actions print-selector=".nr7-section-view" :title="lstring(cleanDocumentInfo?.workingDocumentTitle||cleanDocumentInfo?.title, locale)"
                ref="viewActionsRef"></view-actions>
                <CRow v-if="openWorkflow">
                    <CCol class="mt-1" :md="12">     
                        <km-suspense>
                            <workflow-actions :workflow="openWorkflow" @on-workflow-action="onWorkflowAction"></workflow-actions>
                        </km-suspense>
                    </CCol>
                </CRow>
                <nr-7-view :document-info="cleanDocumentInfo" class="print-section"></nr-7-view>                
            </CCol>
        </CRow>
        <CRow>
            <CCol class="mt-1" :md="12">
                <CCard>
                    <CCardBody>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <CButton :disabled="disableActions" @click="onPreview()" color="secondary">
                                <km-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                                <font-awesome-icon icon="fa-eye"></font-awesome-icon>                                
                                {{showPreview ? t('hidePreview') : t('preview')}}
                            </CButton>
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
                            <CButton color="secondary" @click="onPdf" style="z-index: 1000;" :disabled="isLoading||isPublishing||isValidating">
                                <font-awesome-icon icon="fa-file-pdf" :spin="isLoading"/> PDF
                            </CButton>
                        </div>
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
                            <div v-if="security.role.isPublishingAuthority(SCHEMAS.NATIONAL_REPORT_7)">               
                                {{t('successMessagePA')}}
                            </div>
                            <div v-else-if="security.role.isNationalAuthorizedUser(SCHEMAS.NATIONAL_REPORT_7)">               
                                {{t('successMessageNau')}}
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
//@ts-nocheck
    import {cloneDeep } from 'lodash';
    import { useStorage } from '@vueuse/core'
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { useRealmConfStore } from '@/stores/realmConf';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { KmDocumentsService } from '~/services/kmDocuments';
    import { EditFormUtility } from '@/services/edit-form-utility';


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
    const draftIndicatorData          = ref([]);
    const publishedIndicatorData      = ref([]);
    const draftNr7Document      = ref({});
    const viewActionsRef           = ref();

    const isValidating       = ref(false);
    const isLoadingRecords   = ref(false);
    const isPublishing       = ref(false);
    const showValidationErrorDialog = ref(false);
    const showConfirmDialog = ref(false);
    const showSuccessDialog = ref(false);
    const showSpinnerDialog         = ref(false);
    const confirmationPromise       = ref(null);
    const openWorkflow              = ref(null);
    const stateTargetWorkflow       = useStorage('scbd-ort-nr7-workflow', { batchId : undefined });
    const mandatoryIndicators        = ref([]);
    const binaryIndicators           = ref([]);
    const showPreview              = ref(false);

    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};

        clean = useKmStorage().cleanDocument(clean);

        return clean;
    });
    const cleanDocumentInfo = computed(()=>{
        return {...nationalReport7Store.nationalReportInfo, body: cleanDocument.value};
    });

    const disableActions = computed(()=>isValidating.value || isBusy.value || isLoadingRecords.value || isPublishing.value ||
        cleanDocumentInfo.value?.workingDocumentLock);
    const validationErrorDrafts = computed(()=>draftIndicatorData.value)//.filter(e=>e.errors?.length)
    const missingIndicatorData  = computed(()=>{
        const indicatorData = [...(publishedIndicatorData.value||[]), ...(draftIndicatorData.value||[])];
        const identifier    = indicatorData.map(e=>e.body?.indicator?.identifier).filter(e=>e);
        const missingIndicators = mandatoryIndicators.value.filter(e=>!identifier.includes(e.identifier));
        if(!indicatorData.find(e=>e.type == SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA)){
            missingIndicators.push({
                identifier: SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA,
                title: 'Binary Indicator Data',
            })
        }
        return missingIndicators
    })
    const sectionIErrors    = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionI'));
    const sectionIIErrors   = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionII'));
    const sectionIIIErrors  = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionIII'));
    const sectionIVErrors   = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionIV'));
    const sectionVErrors    = computed(()=>draftNr7Document.value.errors?.filter(e=>e.parameters == 'sectionV'));

    async function init(){
        isBusy.value = true;

        try{
            const [headlineIndicators, binaryIndicators ] = 
                    await Promise.all([
                        GbfGoalsAndTargets.loadGbfHeadlineIndicator(),
                        GbfGoalsAndTargets.loadGbfBinaryIndicator(),
                        nationalReport7Store.loadNationalReport(undefined, true),
                    ]);  
            mandatoryIndicators.value = headlineIndicators;   
            binaryIndicators.value    = binaryIndicators;
            calculateEditProgress()      
            
            if(cleanDocumentInfo.value?.workingDocumentLock){
                await loadOpenWorkflow(cleanDocumentInfo.value);
                if(openWorkflow.value){
                    onPreview();
                }
            } 
        }
        catch(e){
            useLogger().error(e,  'Error loading NR7 Overview')
        }

        isBusy.value = false;
    }

    function calculateEditProgress(){
        const fields = {
            sectionI : ['nationalAuthorities', 'contactPerson', 'contactDetails', 'processUndertaken'],
            sectionII: [
                'hasRevisedNbsap',
                'anticipatedNbsapDate',
                'hasStakeholderEngagement',
                'stakeholders',
                'hasNbsapAdopted',
                'anticipatedNbsapAdoptionDate',
                'policyInstrument',
                'implementationProgress'
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
            sectionV: ['assessmentSummary']
        }

        const document= cleanDocument.value;
        const progress = {
            sectionI : 0,
            sectionII : 0,
            sectionIII : 0,
            sectionIV : 0,
            sectionV : 0,
            sectionOtherInfo : 0
        }

        fields.sectionI.forEach(field=>{
            if(document.sectionI?.[field] != undefined){
                progress.sectionI += 25;
            }
        })
        console.log('progress.sectionI', progress.sectionI);
        if(document.sectionII?.hasRevisedNbsap!=undefined){
            progress.sectionII = 25;
        }

        if(['no', 'inProgress'].includes(document.sectionII?.hasRevisedNbsap) 
            && document.sectionII?.anticipatedNbsapDate== undefined){
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
        if(['yes'].includes(document.sectionII?.hasNbsapAdopted) 
            && document.sectionII?.policyInstrument == undefined){
                progress.sectionII -= 15;
        }
        if(['no', 'other'].includes(document.sectionII?.hasNbsapAdopted) 
            && document.sectionII?.anticipatedNbsapAdoptionDate == undefined){
                progress.sectionII -= 15;
        }
        if(document.sectionII?.implementationProgress != undefined){
            progress.sectionII += 25;
        }
        

        if(document.sectionIII?.length){
            progress.sectionIII += 5;
        }

        if(document.sectionIV?.length){
            progress.sectionIV += 5;
            document.sectionIV.map(section=>{
                if(section.summaryOfProgress){
                    progress.sectionIV += 5;
                }
                for(const indicator in section.indicatorData||[]){
                    if(section.indicatorData[indicator]?.data?.length){
                        progress.sectionIV += 5;
                    }
                }
            })
        }

        if(document.sectionV?.assessmentSummary)
            progress.sectionV = 100;

        if(document.sectionOtherInfo?.additionalInformation)
            progress.sectionOtherInfo = 50;
        if(document.sectionOtherInfo?.additionalDocuments?.length)
            progress.sectionOtherInfo += 50;
        
        
        nrProgress.value = progress
    }

    async function onPreview(){
        showPreview.value = !showPreview.value;
        if(showPreview.value)
            nextTick(()=>scrollToElement(`#nr7-preview-section`));
    }

    async function onPublish(){
        
        try{ 
            //TODO: verify if indicator data was published later then the nr7 document, 
            // ask to go back to the nr7 section III
            await onValidate();
            const hasValidationErrors = [draftNr7Document.value, ...(draftIndicatorData.value||[])].some(e=>e.errors);
            
            if(hasValidationErrors){
                showValidationErrorDialog.value = true;
                return;
            }
            
            if(!draftIndicatorData.value?.length && !cleanDocumentInfo.value.workingDocumentBody){
                alert('No NR7 document to publish');
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
            
            if(draftIndicatorData.value?.length && !cleanDocumentInfo.value.workingDocumentBody){
                //NR7 document was not modified, only indicator data; 
                //crete a draft for the nr7 document to publish
                await EditFormUtility.saveDraft(cleanDocument.value);
            }
            
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

            if(!draftIndicatorData.value?.length){
                const drafts = await Promise.all([
                    KmDocumentDraftsService.loadSchemaDrafts(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA, user.value?.government),
                    KmDocumentDraftsService.loadSchemaDrafts(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA, user.value?.government),                    
                ]);

                draftIndicatorData.value = drafts.flat();

                const documents = await Promise.all([
                    KmDocumentsService.loadSchemaDocuments (SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA, user.value?.government),
                    KmDocumentsService.loadSchemaDocuments (SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA, user.value?.government)
                ]);
                publishedIndicatorData.value = documents.flat()
            }

            draftNr7Document.value = { body : cloneDeep(cleanDocument.value) };
            await validateDocuments([draftNr7Document.value, ...draftIndicatorData.value]);
 
            
        }
        catch(e){
            useLogger().error(e)
        }

        isValidating.value = false;  
    }

    async function onPdf(){
        showPreview.value = true;
        showSpinnerDialog.value = true;
        //sleep for 2 seconds to allow the preview to render
        await sleep(2000);
        showSpinnerDialog.value = false;
        await viewActionsRef.value?.pdfSection?.pdfDocument();        
    }

    async function validateDocument(document:any,  {collection, schema, identifier, validationSection}:KmStorageParam){
        
        const { $api } = useNuxtApp();
        const data     = await $api.kmStorage.documents.validate(document, {collection, schema, identifier, validationSection});
 
        return data?.errors;

    }

    async function validateDocuments(documents){

        const promises = documents.map(async document=>{
            try{
                document.isValidating = true
                document.validated    = false;
                document.errors = undefined;
                const validationErrors = await validateDocument(document.body, {schema:document.body?.header?.schema})
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
  