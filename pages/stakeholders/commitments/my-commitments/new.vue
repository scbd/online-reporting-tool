<template>
  <km-suspense>
    <edit-commitment></edit-commitment>
  </km-suspense>
</template>
  
<script setup lang="ts">

    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT,
        roles:[...ROLES.EVERYONE],
        breadcrumbs : {}
    });

</script>
  