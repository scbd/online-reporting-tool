<template>
    <km-suspense>
      <view-actions print-selector=".print-section" :title="lstring(record?.title)"></view-actions>
      <div class="print-section">
        <view-target-part-1 v-if="identifier" :identifier="identifier" @on-document-load="onDocumentLoad"></view-target-part-1>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">
  import { KmSuspense } from "@/components/controls";
      import { SCHEMAS, ROLES } from '@/utils';
  import viewTargetPart1 from '@/components/pages/national-targets/my-country/part-1/view-target-part-1.vue';
  import { useRoute } from 'vue-router';

  const route      = useRoute();
  const {locale}   = useI18n();
  const identifier = ref(route.params.identifier);
  const record     = ref(null);
  


  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  })
  const onDocumentLoad = (document)=>{
    console.log(document)
    record.value = document;
  }
</script>

<style scoped>

</style>