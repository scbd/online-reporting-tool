<template>
  <km-suspense>
    <edit-nbsap></edit-nbsap>
  </km-suspense>
</template>
  
<script setup lang="ts">

    const schema      = useGetRealmSchema(SCHEMAS.NATIONAL_NBSAP)
    const { locale }  = useI18n();
    const route       = useRoute();
    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_NBSAP,
        roles:[...ROLES.ALL_NATIONAL_USERS],
        breadcrumbs : {
          skip : ['identifier']
        }
    })
    // route.meta.breadcrumbs.replaceCrumbs = [ {'nbsaps' : lstring(schema?.title, locale)} ]
</script>
  