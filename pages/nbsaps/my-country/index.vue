<template>
  <km-suspense>
      <my-country-nbsaps></my-country-nbsaps>
  </km-suspense>
  
</template>

<script setup lang="ts">
  import MyCountryNbsaps from "@/components/pages/nbsaps/my-country/index.vue";
  import { SCHEMAS, ROLES } from '@/utils';

    const schema      = useGetRealmSchema(SCHEMAS.NATIONAL_NBSAP)
    const { locale }  = useI18n();
    const route       = useRoute();

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_NBSAP,
        roles:[...ROLES.ALL_NATIONAL_USERS],
        breadcrumbs : {}
    });

    // route.meta.breadcrumbs.replaceCrumb = [ {'nbsaps' : lstring(schema?.title, locale)} ];

</script>