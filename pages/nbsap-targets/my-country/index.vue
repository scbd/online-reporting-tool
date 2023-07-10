<template>
  <km-suspense>
      <my-country-targets></my-country-targets>
  </km-suspense>
</template>

<script setup lang="ts">
  import MyCountryTargets from "@/components/pages/nbsap-targets/my-country/index.vue";
  import { ROLES, SCHEMAS } from '@/constants'
  import { KmSuspense } from '@/components/controls'

    await new Promise(r => setTimeout(r, 1200))

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

</script>