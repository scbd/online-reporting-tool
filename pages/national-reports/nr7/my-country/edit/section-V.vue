<template>
    <km-suspense>
      <nr7-edit-section-V></nr7-edit-section-V>
    </km-suspense>
</template>
  
<script setup lang="ts">
//@ts-nocheck

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