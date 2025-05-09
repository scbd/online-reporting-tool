<template>
    <km-suspense>
      <edit-section-III></edit-section-III>
    </km-suspense>
</template>
  
<script setup lang="ts">
//@ts-nocheck

import { KmSuspense } from "~/components/controls";
import { SCHEMAS, ROLES } from '@/utils';

    const EditSectionIII = defineAsyncComponent(()=>import("@/components/pages/nr7/my-country/edit/nr7-edit-section-III.vue"))
    
    definePageMeta({
        auth:true,
        schema:'nationalReport7',
        roles:[...ROLES.ALL_NATIONAL_USERS],
        breadcrumbs : {
        skip : ['identifier']
        }
    })
    useNavigateAppTo('/')

</script>