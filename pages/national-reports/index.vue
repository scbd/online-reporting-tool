<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ caption }} </slot>
      </CCardHeader>
      <CCardBody>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <NuxtLink to="/national-targets/new">
            <CButton color="secondary" size="sm">
              <CIcon icon="addthis"/>All national reports
            </CButton>
          </NuxtLink>
        </div>
        List of reports
      </CCardBody>
    </CCard>
  </template>
  <!-- <i18n src="../i18n/dist/pages/index.json"></i18n> -->
  <script>
 
  </script>