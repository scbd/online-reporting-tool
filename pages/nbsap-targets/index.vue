<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ caption }} </slot>
      </CCardHeader>
      <CCardBody>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <NuxtLink to="/nbsap-targets/new">
            <CButton color="secondary" size="sm" @click="navigateToPage(appRoutes.NBSAPS_TARGETS_NEW)">
              <CIcon icon="addthis"/> Submit new target
            </CButton>
          </NuxtLink>
        </div>
        List of reports
      </CCardBody>
    </CCard>
  </template>
  
  <i18n  src="~/i18n/dist/pages/nbsap-targets/index.json"></i18n>
  <script setup lang="ts">
  
    const { appRoutes } = useNuxtApp();

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })
    const navigateToPage = async (url:string)=>{
      await navigateTo(url);
      await navigateTo(url);
    }
    
  </script>