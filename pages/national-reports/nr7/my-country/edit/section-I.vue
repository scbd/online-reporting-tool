<template>
    <km-suspense>
      <nr7-edit-section-I @on1-close="onClose"></nr7-edit-section-I>
    </km-suspense>
</template>
  
<script setup lang="ts">
//@ts-nocheck

import { KmSuspense } from "~/components/controls";
import { SCHEMAS, ROLES } from '@/utils';
const Nr7EditSectionI = defineAsyncComponent(()=>import("@/components/pages/nr7/my-country/edit/nr7-edit-section-I.vue"))
  definePageMeta({
    auth:true,
    schema:'nationalReport7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
    breadcrumbs : {
      skip : ['identifier']
    }
  })

  useNavigateAppTo('/')
    async function onClose(){
        await useNavigateAppTo(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_OVERVIEW);
    }
</script>