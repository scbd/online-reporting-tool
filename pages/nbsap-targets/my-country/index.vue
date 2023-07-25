<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> Global Goals/Target Mapping view</slot>
      </CCardHeader>
      <CCardBody>
        <div class="justify-content-center">
            <div class="mb-5">
              <strong>Welcome to your countries National Targets submission section. please select option to proceed.</strong>
            </div>  

            <CRow>
              <CCol :sm="6">
                <CCard>
                  <CCardBody>
                    <CCardTitle>Part I</CCardTitle>
                    <CCardText>Submit your national targets here</CCardText>
                    <CButton color="primary" href="#">Proceed</CButton>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol :sm="6">
                <CCard>
                  <CCardBody>
                    <CCardTitle>Part II</CCardTitle>
                    <CCardText>Submit your global golas/targets mapping information </CCardText>
                    <CButton color="primary" href="#">Proceed</CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <validation></validation>
                </CCol>
            </CRow>
        </div>
      </CCardBody>
    </CCard>
</template>

<script setup lang="ts">

    import { KmSuspense } from '@/components/controls'
    import validation from '@/components/pages/nbsap-targets/my-country/validation.vue';
    
    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

</script>