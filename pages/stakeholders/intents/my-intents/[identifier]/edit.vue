<template>
  <km-suspense>
    <edit-intent></edit-intent>
  </km-suspense>
</template>
  
<script setup lang="ts">

    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT_INTENT,
        roles:[ROLES.USER],
        breadcrumbs : {
          skip : ['identifier']
        }
    })
</script>
  