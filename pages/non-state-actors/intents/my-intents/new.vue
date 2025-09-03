<template>
  <km-suspense>
    <edit-intent></edit-intent>
  </km-suspense>
</template>
  
<script setup lang="ts">

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_NBSAP,
        roles:[...ROLES.ALL_NATIONAL_USERS],
        breadcrumbs : {}
    });

</script>
  