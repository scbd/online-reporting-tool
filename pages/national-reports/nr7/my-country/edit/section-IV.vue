<template>
    <km-suspense>
      <edit-section-IV></edit-section-IV>
    </km-suspense>
</template>
  
<script setup lang="ts">

import { KmSuspense } from "@/components/controls";
import { SCHEMAS, ROLES } from '@/utils';

  definePageMeta({
    auth:true,
    schema:'nationalReport7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
    breadcrumbs : {
      skip : ['identifier']
    }
  })

</script>