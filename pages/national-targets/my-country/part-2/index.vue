<template>
  <km-suspense>
      <my-country-targets-mapping></my-country-targets-mapping>
  </km-suspense>
  
</template>

<script setup lang="ts">
  import MyCountryTargetsMapping from "@/components/pages/national-targets/my-country/part-2/index.vue";
  import { KmSuspense } from '@/components/controls'
  import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
      import { SCHEMAS, ROLES } from '@/utils';

    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

    onMounted(async()=>{      
    })

</script>