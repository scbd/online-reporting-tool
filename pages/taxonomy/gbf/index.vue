<script setup lang="ts">
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

<template>
  <CCard>
        <CCardHeader>GBF Taxonomy</CCardHeader>
        <CCardBody>
            <div class="text-center border-bottom-1">
                <h5>Welcome to GBF Taxonomy!</h5>
            </div>
            <gbf-taxonomy-list></gbf-taxonomy-list>
        </CCardBody>
   </CCard>
</template>