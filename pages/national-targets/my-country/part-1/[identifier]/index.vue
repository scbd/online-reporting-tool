<template>
  {{ t('navigatingUserToPage') }}
</template>
<i18n src="@/i18n/dist/pages/national-targets/my-country/part-1/[identifier]/index.json"></i18n>

<script setup lang="ts">
  const {t} = useI18n();
  const { $appRoutes } = useNuxtApp();
  await useNavigateAppTo($appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I)

</script>
<style scoped>

</style>