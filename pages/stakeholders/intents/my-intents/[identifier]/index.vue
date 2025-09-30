<template>
</template>
<script setup lang="ts">
   const {t} = useI18n();
  const { $appRoutes } = useNuxtApp();
  await useNavigateAppTo($appRoutes.STAKEHOLDER_MY_INTENTS);

</script>

<style scoped>

</style>