<template>
    <km-suspense>
      <edit-section-I></edit-section-I>
    </km-suspense>
</template>
  
<script setup lang="ts">

import { KmSuspense } from "@/components/controls";
import { SCHEMAS, ROLES } from '@/utils';
import EditSectionI from "@/components/pages/nr7/my-country/edit/section-I.vue";
console.log(EditSectionI)
  definePageMeta({
    auth:true,
    schema:'nationalReport7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
    breadcrumbs : {
      skip : ['identifier']
    }
  })

</script>