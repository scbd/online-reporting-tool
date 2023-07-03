<template>
    <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="6">
            <div class="clearfix">
              <h1 class="float-start display-3 me-4">403</h1>
              <h4 class="pt-3">Forbidden.</h4>
              <p class="text-medium-emphasis float-start">
                <div>You are not authorized to access or view this resource</div>
              </p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Page403',
  }
  </script>
  