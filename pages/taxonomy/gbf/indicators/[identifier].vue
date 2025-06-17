<script setup lang="ts">
//@ts-nocheck

  const thesaurusStore = useThesaurusStore();
  
  const {t} = useI18n();
  const route = useRoute();    
    
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
  const indicatorTermDetails = computed(() => thesaurusStore.getTerm(route.params.identifier));
  
  if(route.params.identifier)
    thesaurusStore.loadTerm(route.params.identifier)
</script>
<i18n src="@/i18n/dist/pages/taxonomy/gbf/[identifier].json"></i18n>
<template>
  <CCard>
        <CCardHeader>{{ t('gbfTaxonomy') }}</CCardHeader>
        <CCardBody v-if="indicatorTermDetails"> 
          <term-details :header="t('globalBiodiversityFrameworkGoal')" :term="indicatorTermDetails" ></term-details>
        </CCardBody>
   </CCard>
</template>