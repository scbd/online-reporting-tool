<template>
  <CCard>
    <CCardHeader>
      <slot name="header"> <CIcon name="cil-grid" /> {{ t('allNationalReports') }} </slot>
    </CCardHeader>
    <CCardBody>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
        <NuxtLink :to="appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_OVERVIEW" class="btn btn-secondary">
            <font-awesome-icon icon="fa-plus"></font-awesome-icon> {{ t('myCountryNr7') }}
        </NuxtLink>
      </div>

      <km-suspense>
          <nr7-list></nr7-list>
      </km-suspense>
    </CCardBody>
  </CCard>
</template>
<i18n src="@/i18n/dist/pages/national-reports/index.json"></i18n>
<script setup lang="ts">

import { SCHEMAS, ROLES } from '@/utils';
import { KmSuspense } from "@/components/controls";

  const { $appRoutes:appRoutes } = useNuxtApp();
  const { t }  = useI18n();
  definePageMeta({
      auth:false,
      schema:SCHEMAS.NATIONAL_TARGET_7,
      roles:[...ROLES.ALL_NATIONAL_USERS],
  })
  const navigateToPage = async (url:string)=>{
    await useNavigateAppTo(url);
  }
  
</script>