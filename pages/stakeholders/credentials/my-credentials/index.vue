<template>
  <km-suspense>
      <my-credentials></my-credentials>
  </km-suspense>
  
</template>

<script setup lang="ts">

  import { SCHEMAS, ROLES } from '@/utils';

    const schema      = useGetRealmSchema(SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL)
    const { locale }  = useI18n();
    const route       = useRoute();

    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL,
        // roles:[ROLES.USER],
        breadcrumbs : {}
    });

    // route.meta.breadcrumbs.replaceCrumb = [ {'nbsaps' : lstring(schema?.title, locale)} ];

</script>