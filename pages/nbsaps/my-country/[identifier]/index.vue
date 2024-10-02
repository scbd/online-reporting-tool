<template>
  navigating user to page
</template>

<script setup lang="ts">
  
  const { $appRoutes } = useNuxtApp();
  await useNavigateAppTo($appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I)

</script>

<style scoped>

</style>