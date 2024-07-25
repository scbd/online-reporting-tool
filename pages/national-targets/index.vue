<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ t('nationalTargets') }} </slot>
      </CCardHeader>
      <CCardBody>        
        <km-suspense>
            <national-target-list></national-target-list>
        </km-suspense>
      </CCardBody>
    </CCard>
  </template>
  
  <i18n  src="~/i18n/dist/pages/national-targets/index.json"></i18n>
  <script setup lang="ts">
  import NationalTargetList from '@/components/pages/national-targets/list.vue';
  import { SCHEMAS, ROLES } from '@/utils';
  import { KmSuspense } from "@/components/controls";

    const { $appRoutes:appRoutes } = useNuxtApp();
    const { t }  = useI18n();
    definePageMeta({
        auth:false,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })
  </script>