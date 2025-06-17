<template>
    <km-suspense>
      <nr7-edit-section-V :workflow-active-tab="workflowActiveTab"></nr7-edit-section-V>
    </km-suspense>
</template>
  
<script setup lang="ts">
//@ts-nocheck

import { KmSuspense } from "@/components/controls";
import { SCHEMAS, ROLES } from '@/utils';
import {useRoute} from 'vue-router';

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
      if(query.edit == 'true')
        return 1;   
      if(query.preview == 'true')
        return 2;      
  })

</script>