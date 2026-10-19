<template>
    <km-suspense>
      <view-actions print-selector=".print-section" :title="lstring(record?.workingDocumentTitle||record?.title)"></view-actions>
      <div class="print-section">
        <view-nbsap v-if="identifier" :identifier="identifier" @on-document-load="onDocumentLoad"></view-nbsap>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">
//@ts-nocheck
  import { useRoute } from 'vue-router';

  const route      = useRoute();
  const {locale}   = useI18n();
  const schema     = useGetRealmSchema(SCHEMAS.NATIONAL_NBSAP)
  const identifier = ref(route.params.identifier);
  const record     = ref(null);
  const workflowId = ref(route.query?.workflowId);
  
  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  });

  const onDocumentLoad = (documentInfo)=>{
    record.value = documentInfo.body;
  }
</script>

<style scoped>

</style>