<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> Overview </slot>
      </CCardHeader>
      <CCardBody>
        <CRow>
       
            <CCol md="3" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section I</div>
                    <div>Brief overview of the process of preparation of the report</div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="25"
                        class="progress-bar bg-info"
                        style="width: 25%"
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
            <CCol md="3" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section II</div>
                    <div>
                        Status of the revised or updated national biodiversity strategies and action plans (NBSAPs) in the light of the Kunming-Montreal Global Biodiversity Framework 
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="25"
                        class="progress-bar bg-info"
                        style="width: 10%"
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
            <CCol md="3" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section III</div>
                    <div>
                        Assessment of progress towards national targets 
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="25"
                        class="progress-bar bg-info"
                        style="width: 25%"
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
            <CCol md="3" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section IV</div>
                    <div>Assessment of national progress towards the goals and targets of the Kunming-Montreal Global Biodiversity Framework</div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="25"
                        class="progress-bar bg-info"
                        style="width: 55%"
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
            <CCol md="3" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Section V</div>
                    <div>
                        Conclusions on the national implementation of the Convention and the Kunming-Montreal Global Biodiversity Framework
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="25"
                        class="progress-bar bg-info"
                        style="width: 85%"
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
            <CCol md="3" class="mt-2">
                <div class="card">
                <div class="card-body">
                    <div class="h4 m-0">Annex</div>
                    <div>
                    Information as requested in related decisions adopted by the
                    Conference of the Parties at its fifteenth meeting
                    </div>
                    <div class="progress-xs my-3 mb-0 progress">
                    <div
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="25"
                        class="progress-bar bg-info"
                        style="width: 25%"
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
  
  <i18n src="@/i18n/dist/pages/national-reports/nr7/my-country/edit/overview.json"></i18n>

  <script setup lang="ts">

    import { KmSuspense, KmLink } from "@/components/controls";
    import { SCHEMAS, ROLES } from '@/utils';
    import EditSectionI from "@/components/pages/nr7/my-country/edit/section-I.vue";
    
    const { $appRoutes:appRoutes, $api } = useNuxtApp();
    const security                  = useSecurity();
    const { t }                     = useI18n();

    const disableActions = false;

    definePageMeta({
      auth:true,
      schema:'nationalReport7',
      roles:[...ROLES.ALL_NATIONAL_USERS],
      breadcrumbs : {
        skip : ['identifier']
      }
    })
  
  </script>
  
  
