<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ t('nationalTargetsAnalyzer') }} </slot>
      </CCardHeader>
      <CCardBody>        
        <km-suspense>
            <national-targets-analyzer></national-targets-analyzer>
        </km-suspense>
      </CCardBody>
    </CCard>
  </template>
  
  <script setup lang="ts">

    const { t }  = useI18n();
    definePageMeta({
        auth:false,
        schema:SCHEMAS.NATIONAL_TARGET_7
    })
  </script>