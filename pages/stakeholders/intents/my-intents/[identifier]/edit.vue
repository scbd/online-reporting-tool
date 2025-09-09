<template>
  <km-suspense>
    <edit-intent></edit-intent>
  </km-suspense>
</template>
  
<script setup lang="ts">

    const schema      = useGetRealmSchema(SCHEMAS.REFERENCE_NON_STATE_ACTOR_COMMITMENT_INTENT)
    const { locale }  = useI18n();
    const route       = useRoute();
    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_NON_STATE_ACTOR_COMMITMENT_INTENT,
        roles:[...ROLES.EVERYONE],
        breadcrumbs : {
          skip : ['identifier']
        }
    })
</script>
  