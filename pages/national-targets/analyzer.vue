<template>
    <CCard>
      <CCardHeader>
        <template #header> 
          <font-awesome-icon :icon="['fas', 'chart-simple']" /> 
          {{ t('nationalTargetsAnalyzer') }} 
          <a class="float-end" v-if="query.embed" :href="realm.baseURL">
            <CTooltip content="SCBD Online Reporting Tool" trigger="hover">
                <template #toggler="{ on }">
                    <span v-on="on"><strong>{{realm.displayName}}</strong></span>
                </template>
            </CTooltip>            
          </a>
        </template>
      </CCardHeader>
      <CCardBody>        
        <km-suspense>
            <national-targets-analyzer></national-targets-analyzer>
        </km-suspense>
      </CCardBody>
    </CCard>
  </template>
  <i18n src="@/i18n/dist/pages/national-targets/analyzer.json"></i18n>
  <script setup lang="ts">

    import {useRoute} from 'vue-router';
    const { t }     = useI18n();
    const { query } = useRoute();
    const realm     = useRealm()
    
    definePageMeta({
        auth:false,
    })
  </script>