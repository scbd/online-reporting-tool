<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> National Targets </slot>
      </CCardHeader>
      <CCardBody>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
          <NuxtLink :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW" class="btn btn-secondary">
              <CIcon icon="addthis"/> Submit new target
          </NuxtLink>
        </div>

        <km-suspense>
            <national-target-list></national-target-list>
        </km-suspense>
      </CCardBody>
    </CCard>
  </template>
  
  <i18n  src="~/i18n/dist/pages/nbsap-targets/index.json"></i18n>
  <script setup lang="ts">
  import NationalTargetList from '@/components/pages/nbsap-targets/list.vue';
  import { SCHEMAS, ROLES } from '@/utils';
  import { KmSuspense } from "@/components/controls";
    const { $appRoutes:appRoutes } = useNuxtApp();

    definePageMeta({
        auth:false,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })
    const navigateToPage = async (url:string)=>{
      await navigateTo(url);
      await navigateTo(url);
    }
    
  </script>