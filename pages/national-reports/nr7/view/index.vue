<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> Overview </slot>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="12">
            <div class="alert alert-success" role="alert">
              <p>
                Welcome to <strong>Holy See</strong> 7th National Report Overview
              </p>
              <hr />
            </div>
          </CCol>
  
          <CCol md="12">
            <div class="card">
              <div class="card-body">
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton color="secondary m-1">
                    <font-awesome-icon icon="fa-save" /> Save
                  </CButton>
                  <CButton color="success m-1">
                    <font-awesome-icon icon="fa-save" /> Publish
                  </CButton>
                  <CButton color="warning m-1">
                    <font-awesome-icon icon="fa-share" /> Share
                  </CButton>
  
                  <CButton color="danger m-1">
                    <font-awesome-icon icon="fa-file-pdf" /> PDF
                  </CButton>
                </div>
              </div>
            </div>
          </CCol>
  
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">Section I</div>
                <div>Executive summary of the report</div>
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
                      <font-awesome-icon icon="fa-edit" /> Update
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">Section II</div>
                <div>
                  Brief overview of the process of preparation of the report
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
                      <font-awesome-icon icon="fa-edit" /> Update
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">Section III</div>
                <div>
                  Status of the updated or revised national biodiversity
                  strategies and action plans (NBSAPs) in the light of the
                  post-2020 global biodiversity framework
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
                      <font-awesome-icon icon="fa-edit" /> Update
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">Section IV</div>
                <div>Assessment of progress towards the 2050 goals</div>
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
                      <font-awesome-icon icon="fa-edit" /> Update
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">Section V</div>
                <div>
                  Assessment of progress towards national targets and
                  contributions to progress in the 2030 action targets
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
                      <font-awesome-icon icon="fa-edit" /> Update
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
            <div class="card">
              <div class="card-body">
                <div class="h4 m-0">Section VI</div>
                <div>
                  Conclusions on the implementation of the Convention and the
                  post-2020 global biodiversity framework
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
                      <font-awesome-icon icon="fa-edit" /> Update
                    </CButton>
                  </NuxtLink>
                </small>
              </div>
            </div>
          </CCol>
          <CCol md="3">
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
                <small
                  class="text-muted d-grid gap-2 d-md-flex justify-content-md-end"
                >
                  <NuxtLink to="/national-reports/nr7/edit/section-7">
                    <CButton color="secondary" size="sm">
                      <font-awesome-icon icon="fa-edit" /> Update
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
                          <font-awesome-icon icon="fa-plus" /> Add new
                      </CButton>
                  </NuxtLink>
              </div> -->
      </CCardBody>
    </CCard>
  </template>
  
  <script>
  export default {
    name: 'Nr7View',
    auth:false,
    meta:{
      schema:'nationalReport7'
    },
    props: {},
    methods: {},
  }
  </script>
  