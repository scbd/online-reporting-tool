<script setup lang="ts">
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
<i18n src="@/i18n/dist/pages/taxonomy/gbf/index.json"></i18n>
<template>
  <CCard>
        <CCardHeader>{{ t('gbfTaxonomy') }}</CCardHeader>
        <CCardBody>
            <div class="text-center border-bottom-1">
                <h5>{{ t('welcomeToGBFTaxonomy') }}</h5>
            </div>
            <gbf-taxonomy-list></gbf-taxonomy-list>
        </CCardBody>
   </CCard>
</template>