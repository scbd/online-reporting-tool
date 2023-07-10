<template>
    <km-suspense>
      <view-target v-if="identifier" :identifier="identifier"></view-target>
    </km-suspense>

</template>

<script setup lang="ts">
  import { KmSuspense } from "@/components/controls";
  import viewTarget from '@components/pages/nbsap-targets/my-country/view-target.vue';
  import { useRoute } from 'vue-router';

  const route           = useRoute();
  const identifier = ref(route.params.identifier);


</script>

<style scoped>

</style>