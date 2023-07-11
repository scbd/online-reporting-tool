<template>
  <km-suspense>
      <my-country-targets-mapping></my-country-targets-mapping>
  </km-suspense>
  
</template>

<script setup lang="ts">
  import MyCountryTargetsMapping from "@/components/pages/nbsap-targets/my-country/part-2/index.vue";
  import { ROLES, SCHEMAS } from '@/constants'
  import { KmSuspense } from '@/components/controls'

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

</script>