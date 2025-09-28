<template>
  <km-suspense>
      <my-commitments></my-commitments>
  </km-suspense>
  
</template>

<script setup lang="ts">

  import { SCHEMAS, ROLES } from '@/utils';

    const schema      = useGetRealmSchema(SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT)
    const { locale }  = useI18n();
    const route       = useRoute();

    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT,
        roles:[ROLES.STAKEHOLDER_COMMITMENT_AUTHORIZED_USER],
        breadcrumbs : {}
    });

    // route.meta.breadcrumbs.replaceCrumb = [ {'nbsaps' : lstring(schema?.title, locale)} ];

</script>