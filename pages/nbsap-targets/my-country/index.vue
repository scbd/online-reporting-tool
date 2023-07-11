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
              <CCol :sm="3">
                <CCard>
                  <CCardBody>
                    <CCardTitle>Part I</CCardTitle>
                    <CCardText>Submit your national targets here</CCardText>
                    <CButton color="primary" href="#">Proceed</CButton>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol :sm="3">
                <CCard>
                  <CCardBody>
                    <CCardTitle>Part II</CCardTitle>
                    <CCardText>Submit your global golas/targets mapping information </CCardText>
                    <CButton color="primary" href="#">Proceed</CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

        </div>
      </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
  // import MyCountryTargets from "@/components/pages/nbsap-targets/my-country/part-2/index.vue";
  import { ROLES, SCHEMAS } from '@/constants'
  // import { KmSuspense } from '@/components/controls'

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

</script>