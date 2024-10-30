
<template>
    <div>
      <code>
          {{ t('welcomeToSearch') }}   
      </code>
    </div>
</template>
<i18n src="@/i18n/dist/pages/search/[identifier].json"></i18n>
<script setup lang="ts">
const {t} = useI18n();
  useHead({
    title: "ORT Search",
  });

  definePageMeta({
    auth: false,
    roles : []
  });
</script>