<template>
    <km-suspense>
      <view-actions print-selector=".print-section" :title="record?.title"></view-actions>
      <div class="print-section">
        <view-target-part-2 v-if="identifier" :identifier="identifier" @on-document-load="onDocumentLoad"></view-target-part-2>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">
  import { KmSuspense } from "@/components/controls";
  import viewTargetPart2 from '@/components/pages/national-targets/my-country/part-2/view-target-part-2.vue';
  import { useRoute } from 'vue-router';

  const route           = useRoute();
  const identifier = ref(route.params.identifier);
  const record = ref(null);

  const onDocumentLoad = (document)=>{
    console.log(document)
    record.value = document;
  }
</script>

<style scoped>

</style>