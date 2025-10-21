<template>
   navigating to stakeholder commitments...
</template>
<script setup lang="ts">
  const { appRoutes } = useNuxtApp();
  await useNavigateAppTo((appRoutes as any).STAKEHOLDER_COMMITMENTS);
</script>