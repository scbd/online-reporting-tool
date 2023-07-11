<template>
  <km-suspense>
      <my-country-targets></my-country-targets>
  </km-suspense>
  
</template>

<script setup lang="ts">
  import MyCountryTargets from "@/components/pages/nbsap-targets/my-country/part-1/index.vue";

  import { KmSuspense } from '@/components/controls'

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

</script>