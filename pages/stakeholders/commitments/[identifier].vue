<template>
    <km-suspense>
      <view-actions v-if="documentInfo" print-selector=".print-section"  :file-name="documentInfo?.identifier"
        :title="lstring(documentInfo?.workingDocumentTitle||documentInfo?.title, locale)"></view-actions>

      <div class="print-section">
        <view-commitment v-if="identifier" :identifier="identifier" @on-document-load="onDocumentLoad" ></view-commitment>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">

  import { useRoute } from 'vue-router';
import type { EDocumentInfo } from '~/types/schemas/base/EDocumentInfo';

  const route      = useRoute();
  const { locale } = useI18n();
  const identifier = ref<string>(route.params.identifier as string || '');
  const documentInfo = ref<EDocumentInfo|undefined>(undefined);
  
  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  });

  const onDocumentLoad = (lDocumentInfo:EDocumentInfo)=>{
    documentInfo.value = lDocumentInfo;
  }

</script>

<style scoped>

</style>