<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ t('commitments') }} </slot>
      </CCardHeader>
      <CCardBody>        
        <km-suspense>
            <list-commitments></list-commitments>
        </km-suspense>
      </CCardBody>
    </CCard>
  </template>
  <!-- <i18n src="@/i18n/dist/pages/stakeholders/commitments/index.json"></i18n> -->
  <script setup lang="ts">

    const { t, locale } = useI18n();
    const route         = useRoute();
    definePageMeta({
        auth:false,
        schema:SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT,
        breadcrumbs : {}
    });

  </script>