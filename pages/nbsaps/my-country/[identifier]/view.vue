<template>
    <km-suspense>
      <view-actions print-selector=".print-section" :title="lstring(record?.title)"></view-actions>
      <div class="print-section">
        <view-nbsap v-if="identifier" :identifier="identifier" @on-document-load="onDocumentLoad"></view-nbsap>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route      = useRoute();
  const {locale}   = useI18n();
  const schema     = useGetRealmSchema(SCHEMAS.NATIONAL_NBSAP)
  const identifier = ref(route.params.identifier);
  const record     = ref(null);
  
  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  });

  // route.meta.breadcrumbs.replaceCrumbs = [ {'nbsaps' : lstring(schema?.title, locale)} ];

  const onDocumentLoad = (document)=>{
    record.value = document;
  }
</script>

<style scoped>

</style>