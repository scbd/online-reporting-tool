<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('title')}}</slot>
      </CCardHeader>
      <CCardBody>
            <km-suspense>
                <national-targets-overview></national-targets-overview>
            </km-suspense>
      </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/pages/national-targets/my-country/index.json"></i18n>
<script setup lang="ts">
//@ts-nocheck

    import { KmSuspense, KmLink, KmNavLink } from '~/components/controls'
    import nationalTargetsOverview from '@/components/pages/national-targets/my-country/overview.vue';
      import { SCHEMAS, ROLES } from '@/utils';

      const { t } = useI18n();
      
    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

    const {$appRoutes:appRoutes} = useNuxtApp();

</script>