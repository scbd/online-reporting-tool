<template>
    <km-suspense>
      <nr7-edit-section-II :workflow-active-tab="workflowActiveTab"></nr7-edit-section-II>
    </km-suspense>
</template>
  
<script setup lang="ts">
//@ts-nocheck

import { KmSuspense } from "~/components/controls";
import { SCHEMAS, ROLES } from '@/utils';
import {useRoute} from 'vue-router';

const Nr7EditSectionII = defineAsyncComponent(()=>import("@/components/pages/nr7/my-country/edit/nr7-edit-section-II.vue"))

  definePageMeta({
    auth:true,
    schema:'nationalReport7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
    breadcrumbs : {
      skip : ['identifier']
    }
  })
  const { query }  = useRoute();
  const workflowActiveTab = computed(()=>{
      if(query.preview == 'true')
        return 2;      
  })
  
</script>