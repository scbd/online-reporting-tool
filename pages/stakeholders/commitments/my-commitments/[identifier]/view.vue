<template>
    <km-suspense>{{ record?.workingDocumentTitle }}
      <view-actions print-selector=".print-section" :title="lstring(record?.workingDocumentTitle||record?.title)"></view-actions>

      <workflow-request v-if="workflowId" :workflow-id="workflowId"></workflow-request>

      <div class="print-section">
        <view-commitment v-if="identifier" :identifier="identifier" @on-document-load="onDocumentLoad"></view-commitment>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">
//@ts-nocheck
  import { useRoute } from 'vue-router';

  const route      = useRoute();
  const {locale}   = useI18n();
  const schema     = useGetRealmSchema(SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT)
  const identifier = ref(route.params.identifier);
  const record     = ref(null);
  const workflowId = ref(route.query?.workflowId);
  
  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  });

  // route.meta.breadcrumbs.replaceCrumbs = [ {'nbsaps' : lstring(schema?.title, locale)} ];

  const onDocumentLoad = (documentInfo)=>{
    record.value = documentInfo.body;
    if(documentInfo?.workingDocumentLock)
      workflowId.value = documentInfo?.workingDocumentLock?.lockID?.replace('workflow-', '');;
  }
</script>

<style scoped>

</style>