<template>
    <km-suspense>
      <view-actions print-selector=".nr7-section-view" :title="lstring(record?.workingDocumentTitle||record?.title, locale)"></view-actions>

      <workflow-request v-if="workflowId" :workflow-id="workflowId"></workflow-request>

      <div class="print-section">
        <nr-7-view class="print-section" :identifier="identifier" :public-data="true" @on-document-load="onDocumentLoad"></nr-7-view>
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
  
  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  });

  const onDocumentLoad = (document)=>{
    record.value = document;
  }
</script>

<style scoped>

</style>
                