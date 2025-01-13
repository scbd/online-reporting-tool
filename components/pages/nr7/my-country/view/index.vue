<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ t('overview') }} </slot>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="12">
            <div class="alert alert-success" role="alert">
              <p>
                {{ t('welcomeTo') }} <strong>{{ t('holySee') }}</strong> {{ t('7thNationalReportOverview') }}
              </p>
              <hr />
            </div>
          </CCol>
  
          <CCol md="12">
            <div class="card">
              <div class="card-body">
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton color="secondary m-1">
                    <CIcon icon="cil-save"/> {{ t('save') }}
                  </CButton>
                  <CButton color="success m-1">
                    <CIcon icon="cil-save"/> {{ t('publish') }}
                  </CButton>
                  <CButton color="warning m-1">
                    <CIcon icon="cil-share"/> {{ t('share') }}
                  </CButton>

                  <CButton color="danger m-1">
                    <CIcon icon="cil-file-pdf"/> {{ t('pdf') }}
                  </CButton>
                </div>
              </div>
            </div>
          </CCol>
  
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">{{ t('sectionI') }}</div>
                <div>{{ t('executiveSummaryReport') }}</div>
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
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-1">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> {{ t('update') }}
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">{{ t('sectionII') }}</div>
                <div>
                  {{ t('briefOverviewPreparationReport') }}
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
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-2">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> {{ t('update') }}
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">{{ t('sectionIII') }}</div>
                <div>
                  {{ t('statusUpdatedNationalBiodiversity') }}
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
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-3">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> {{ t('update') }}
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">{{ t('sectionIV') }}</div>
                <div>{{ t('assessmentOfProgress2050Goals') }}</div>
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
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-4">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> {{ t('update') }}
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">{{ t('sectionV') }}</div>
                <div>
                  {{ t('assessmentOfProgressNationalTargets') }}
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
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-5">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> {{ t('update') }}
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">{{ t('sectionVI') }}</div>
                <div>
                  {{ t('conclusionsImplementationConvention') }}
                </div>
                <div class="progress-xs my-3 mb-0 progress">
                  <div
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow="25"
                    class="progress-bar bg-info"
                    style="width: 5%"
                  ></div>
                </div>
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-6">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> {{ t('update') }}
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">{{ t('annex') }}</div>
                <div>
                  {{ t('informationAsRequested') }}
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
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-7">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> {{ t('update') }}
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
        </CRow>
        <!-- <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <NuxtLink to="/national-reports/nr7/edit/section-1">
                      <CButton color="secondary" size="sm">
                          <CIcon icon="addthis"/> Add new
                      </CButton>
                  </NuxtLink>
              </div> -->
      </CCardBody>
    </CCard>
  </template>
    <i18n src="@/i18n/dist/components/pages/nr7/my-country/view/index.json"></i18n>
  <script lang="ts">
  export default {
    name: 'Nr7View',
    auth:false,
    meta:{
      schema:'nationalReport7'
    },
    setup(){
          const { t } = useI18n();
          return { t };
    },
    props: {},
    methods: {},
  }
  </script>