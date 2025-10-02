<template>
  <km-suspense>
    <edit-credential></edit-credential>
  </km-suspense>
</template>
  
<script setup lang="ts">

    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL,
        roles:[ROLES.USER],
        breadcrumbs : {
          skip : ['identifier']
        }
    })
</script>
  