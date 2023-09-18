<template>
    <km-suspense>
      <edit-section-III></edit-section-III>
    </km-suspense>
</template>
  
<script setup lang="ts">

import { KmSuspense } from "@/components/controls";
import { SCHEMAS, ROLES } from '@/utils';
import EditSectionIII from "@/components/pages/nr7/my-country/edit/section-III.vue";

  definePageMeta({
    auth:true,
    schema:'nationalReport7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
    breadcrumbs : {
      skip : ['identifier']
    }
  })

</script>