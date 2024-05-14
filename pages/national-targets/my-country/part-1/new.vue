<template>
  <km-suspense>
    <edit-target-part-1></edit-target-part-1>
  </km-suspense>
</template>
  
<script setup lang="ts">
  
    definePageMeta({
        auth:true,
        schema:'nationalTarget7',
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })
</script>
  