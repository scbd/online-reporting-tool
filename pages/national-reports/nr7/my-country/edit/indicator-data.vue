<template>
    <km-suspense>
      <indicator-data-overview></indicator-data-overview>
    </km-suspense>
</template>
  
<script setup lang="ts">
//@ts-nocheck

import { KmSuspense } from "~/components/controls";
import { SCHEMAS, ROLES } from '@/utils';
import IndicatorDataOverview from "@/components/pages/nr7/my-country/edit/indicator-data/nr7-indicator-data-overview.vue";

  definePageMeta({
    auth:true,
    schema:SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA,
    roles:[...ROLES.ALL_NATIONAL_USERS],
    breadcrumbs : {
      skip : ['identifier']
    }
  })

  useNavigateAppTo('/')
</script>