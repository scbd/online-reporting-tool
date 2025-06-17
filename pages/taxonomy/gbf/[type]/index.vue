<script setup lang="ts">
//@ts-nocheck
import {useRoute } from 'vue-router';
    const {t} = useI18n();
    const route          = useRoute();
console.log("route", route);
    const filterTerm = route.params?.identifier?.toUpperCase();

    useHead({
        title: "GBF Taxonomy"
    });

  definePageMeta({
    auth: false,
    roles : [],
    breadcrumbs : {
        replaceCrumbs : [{'gbf' : 'Global Biodiversity Framework'},
                        ]
    }
  });
</script>
<i18n src="@/i18n/dist/pages/taxonomy/gbf/[identifier].json"></i18n>
<template>
  <CCard>
        <CCardHeader>{{ t('gbfTaxonomy') }}</CCardHeader>
        <CCardBody>            
             <gbf-taxonomy-list :type="route.params.type"></gbf-taxonomy-list>
        </CCardBody>
   </CCard>
</template>