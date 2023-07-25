<template>
    <km-suspense>
      <view-target-part-2 v-if="identifier" :identifier="identifier"></view-target-part-2>
    </km-suspense>

</template>

<script setup lang="ts">
  import { KmSuspense } from "@/components/controls";
  import viewTargetPart2 from '@/components/pages/nbsap-targets/my-country/part-2/view-target-part-2.vue';
  import { useRoute } from 'vue-router';

  const route           = useRoute();
  const identifier = ref(route.params.identifier);


</script>

<style scoped>

</style>