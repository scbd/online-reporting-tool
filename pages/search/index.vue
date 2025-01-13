<script setup lang="ts">
//@ts-nocheck
const {t} = useI18n();
  useHead({
    title: "ORT Search",
  });

  definePageMeta({
    auth: false,
    roles : []
  });
</script>
<i18n src="@/i18n/dist/pages/search/index.json"></i18n>
<template>
  <div>
    <code>
        {{ t('welcomeToSearch') }}   
    </code>
  </div>
</template>