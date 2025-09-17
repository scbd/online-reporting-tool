<template>
</template>
<script setup lang="ts">
   const {t} = useI18n();
  const { $appRoutes } = useNuxtApp();
  await useNavigateAppTo($appRoutes.NATIONAL_REPORTS_STAKEHOLDER_MY_INTENTS);

</script>

<style scoped>

</style>