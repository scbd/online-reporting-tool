<template>
  <km-suspense>
    <edit-intent></edit-intent>
  </km-suspense>
</template>
  
<script setup lang="ts">

    definePageMeta({
        auth:true,
        schema:SCHEMAS.REFERENCE_NON_STATE_ACTOR_COMMITMENT_INTENT,
        roles:[...ROLES.EVERYONE],
        breadcrumbs : {}
    });

</script>
  