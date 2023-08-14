<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> Country national target overview</slot>
      </CCardHeader>
      <CCardBody>
            <km-suspense>
                <national-targets-overview></national-targets-overview>
            </km-suspense>
      </CCardBody>
    </CCard>
</template>

<script setup lang="ts">

    import { KmSuspense, KmLink, KmNavLink } from '@/components/controls'
    import nationalTargetsOverview from '@/components/pages/nbsap-targets/my-country/overview.vue';
      import { SCHEMAS, ROLES } from '@/utils';
    
    definePageMeta({
        auth:true,
        schema:SCHEMAS.NATIONAL_TARGET_7,
        roles:[...ROLES.ALL_NATIONAL_USERS],
    })

    const {$appRoutes:appRoutes} = useNuxtApp();

</script>