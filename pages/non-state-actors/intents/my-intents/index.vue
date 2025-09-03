<template>
  <km-suspense>
      <my-intents></my-intents>
  </km-suspense>
  
</template>

<script setup lang="ts">

  import { SCHEMAS, ROLES } from '@/utils';

    const schema      = useGetRealmSchema(SCHEMAS.NATIONAL_NBSAP)
    const { locale }  = useI18n();
    const route       = useRoute();

    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_NON_STATE_ACTOR_COMMITMENT_INTENT,
        roles:[...ROLES.EVERYONE],
        breadcrumbs : {}
    });

    // route.meta.breadcrumbs.replaceCrumb = [ {'nbsaps' : lstring(schema?.title, locale)} ];

</script>