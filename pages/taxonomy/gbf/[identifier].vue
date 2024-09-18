<script setup lang="ts">
  useHead({
    title: "GBF Taxonomy",
  });

  definePageMeta({
    auth: false,
    roles : [],
    breadcrumbs : {
        replaceText : [{'gbf' : 'Global Biodiversity Framework'}]
    }
  });
</script>

<template>
  <CCard>
        <CCardHeader>GBF Taxonomy</CCardHeader>
        <CCardBody>            
            <gbf-taxonomy-details></gbf-taxonomy-details>
        </CCardBody>
   </CCard>
</template>