<template>
    <km-suspense>
      <view-actions print-selector=".nr7-section-view" :title="lstring(record?.workingDocumentTitle||record?.title, locale)"
          ref="viewActionsRef" @on-print-document="onPrintDocument" @on-before-print="onBeforePrint"
          @on-after-print="onAfterPrint" @on-pdf-document="onPdfDocument" @on-after-pdf="onAfterPdf"></view-actions>

      <workflow-request v-if="workflowId" :workflow-id="workflowId"></workflow-request>

      <div class="print-section">
        <nr-7-view class="print-section" :is-printing="isPrinting" :identifier="identifier" :public-data="true" @on-document-load="onDocumentLoad"></nr-7-view>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">
//@ts-nocheck
  import { useRoute } from 'vue-router';

  const route      = useRoute();
  const {locale}   = useI18n();
  const identifier = ref(route.params.identifier);
  const record     = ref(null);
  const workflowId = ref(route.query?.workflowId);
  const isPrinting = ref(false);
  
  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  });

  const onDocumentLoad = (document)=>{
    record.value = document;
  }

  const onPrintDocument = () => {
      isPrinting.value = true;
  }
  const onBeforePrint = () => {
      isPrinting.value = true;
  }
  const onAfterPrint = () => {
      isPrinting.value = false;
  }

  const onPdfDocument = () => {
      isPrinting.value = true;
  }    
  const onAfterPdf = () => {
      isPrinting.value = false;
  }  
</script>

<style scoped>

</style>
                