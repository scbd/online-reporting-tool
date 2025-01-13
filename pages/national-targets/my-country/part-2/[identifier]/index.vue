<template>
    {{ t('redirectToView') }}
</template>
  <i18n src="@/i18n/dist/pages/national-targets/my-country/part-2/[identifier]/index.json"></i18n>
  <script setup lang="ts">
//@ts-nocheck
  const {t} = useI18n();
  import TargetView from './view.vue'
  </script>
  
  <style scoped>
  
  </style>