<script setup lang="ts">
//@ts-nocheck
import {useRoute } from 'vue-router';
const {t} = useI18n();
  useHead({
    title: "GBF Taxonomy",
  });

  definePageMeta({
    auth: false,
    roles : [],
    breadcrumbs : {
        replaceCrumbs : [{'gbf' : 'Global Biodiversity Framework'}]
    }
  });
</script>
<i18n src="@/i18n/dist/pages/taxonomy/gbf/[identifier].json"></i18n>
<template>
  <CCard>
        <CCardHeader>{{ t('gbfTaxonomy') }}</CCardHeader>
        <CCardBody>            
            <gbf-taxonomy-details></gbf-taxonomy-details>
        </CCardBody>
   </CCard>
</template>