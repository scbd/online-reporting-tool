<script setup lang="ts">
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

<template>
  <CCard>
        <CCardHeader>GBF Indicator</CCardHeader>
        <CCardBody>            
            <gbf-taxonomy-details></gbf-taxonomy-details>
        </CCardBody>
   </CCard>
</template>