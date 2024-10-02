<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ t('nbsap') }} </slot>
      </CCardHeader>
      <CCardBody>        
        <km-suspense>
            <nbsap-list></nbsap-list>
        </km-suspense>
      </CCardBody>
    </CCard>
  </template>
  <i18n src="@/i18n/dist/pages/nbsaps/index.json"></i18n>
  <script setup lang="ts">

    const schema        = useGetRealmSchema(SCHEMAS.NATIONAL_NBSAP)
    const { t, locale } = useI18n();
    const route         = useRoute();
    definePageMeta({
        auth:false,
        schema:SCHEMAS.NATIONAL_NBSAP,
        // roles:[...ROLES.ALL_NATIONAL_USERS],
        breadcrumbs : {}
    });

    route.meta.breadcrumbs.replaceCrumb = [ {'nbsaps' : lstring(schema?.title, locale)} ];
  </script>