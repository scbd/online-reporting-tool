<template>
  <km-suspense>
    <edit-commitment></edit-commitment>
  </km-suspense>
</template>
  
<script setup lang="ts">

    const schema      = useGetRealmSchema(SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT)
    const { locale }  = useI18n();
    const route       = useRoute();
    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT,
        roles:[...ROLES.EVERYONE],
        breadcrumbs : {
          skip : ['identifier']
        }
    })
</script>
  