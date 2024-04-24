<template>
    <km-suspense>
      <nr7-edit-overview @on1-close="onClose"></nr7-edit-overview>
    </km-suspense>    
</template>
  
  <i18n src="@/i18n/dist/pages/national-reports/nr7/my-country/edit/overview.json"></i18n>

  <script setup lang="ts">

    import { KmSuspense, KmLink } from "@/components/controls";
    import { SCHEMAS, ROLES } from '@/utils';
    
    const { $appRoutes:appRoutes, $api } = useNuxtApp();
    const security                  = useSecurity();
    const { t }                     = useI18n();

    const disableActions = false;

    definePageMeta({
      auth:true,
      schema:'nationalReport7',
      roles:[...ROLES.ALL_NATIONAL_USERS],
      breadcrumbs : {
        skip : ['identifier']
      }
    })
  
  </script>
  
  
