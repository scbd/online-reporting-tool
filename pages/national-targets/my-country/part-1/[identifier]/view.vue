<template>
    <km-suspense>
      <view-target-part-1 v-if="identifier" :identifier="identifier"></view-target-part-1>
    </km-suspense>

</template>

<script setup lang="ts">
  import { KmSuspense } from "@/components/controls";
      import { SCHEMAS, ROLES } from '@/utils';
  import viewTargetPart1 from '@/components/pages/national-targets/my-country/part-1/view-target-part-1.vue';
  import { useRoute } from 'vue-router';

  const route           = useRoute();
  const identifier = ref(route.params.identifier);

  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  })

</script>

<style scoped>

</style>