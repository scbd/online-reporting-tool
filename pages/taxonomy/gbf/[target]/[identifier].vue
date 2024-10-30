<script setup lang="ts">
const {t} = useI18n();
  useHead({
    title: "GBF Indicator",
  });

  definePageMeta({
    auth: false,
    roles : [],
    breadcrumbs : {
        replaceCrumbs : [{'gbf' : 'Global Biodiversity Framework'}]
    }
  });
</script>
<i18n src="@/i18n/dist/pages/taxonomy/gbf/[target]/[identifier].json"></i18n>
<template>
  <CCard>
        <CCardHeader>{{ t('gbfIndicator') }}</CCardHeader>
        <CCardBody>            
            <gbf-taxonomy-details></gbf-taxonomy-details>
        </CCardBody>
   </CCard>
</template>