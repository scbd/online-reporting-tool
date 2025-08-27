<template>
  <km-suspense>
    <edit-intent></edit-intent>
  </km-suspense>
</template>
  
<script setup lang="ts">
//@ts-nocheck
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
  