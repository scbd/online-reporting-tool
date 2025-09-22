<template>
  <CCard>
    <CCardHeader>
      {{ t('commitmentTitle') }}
    </CCardHeader>
    <CCardBody>
      <div v-if="viewDocument">
        <div v-if="viewDocument.header.languages && viewDocument.header.languages.length > 1"
             class="d-grid d-md-flex justify-content-md-end mb-2">
          <km-locales v-model="selectedLocale" :locales="viewDocument.header.languages"></km-locales>
        </div>
        
        <view-contact-details :document="viewDocument" :locale="selectedLocale"></view-contact-details>
        
      </div>
      <km-document-error v-if="!viewDocument && !isLoading && documentLoadError" :document-error="documentLoadError" />
      <km-spinner :visible="isLoading" v-if="isLoading" center />
    </CCardBody>
  </CCard>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/edit-commitment.json"></i18n>
<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/view-commitment.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
import { useRoute } from 'vue-router'
import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";
import { KmDocumentsService } from "@/services/kmDocuments";

const emit = defineEmits(['onDocumentLoad']);
const route = useRoute();
const { t, locale } = useI18n();
const security = useSecurity();
const { ACCOUNTS_HOST_URL } = useRuntimeConfig().public;

const props = defineProps({
  document: { type: Object, default: undefined },
  identifier: { type: String, required: true }
})

const { document, identifier } = toRefs(props);
const lDocument = ref(undefined);
const isLoading = ref(false);
const documentLoadError = ref(false);
const selectedLocale = ref(locale.value);

const viewDocument = computed(() => {
  return document?.value || lDocument?.value;
})

onMounted(() => {
  if (props.identifier && !props.document) {
    loadDocument(props.identifier)
  }
})

async function loadDocument(identifier) {
  isLoading.value = true;
  try {
    if (route.query?.draft == 'true' || route.query?.draft === null) {
      const draftRecord = await KmDocumentDraftsService.loadDraftDocument(route.params.identifier);
      lDocument.value = draftRecord.body;
      emit('onDocumentLoad', draftRecord);
    } else {
      const record = await KmDocumentsService.loadDocument(route.params.identifier);
      lDocument.value = record.body;
      emit('onDocumentLoad', record);
    }
  } catch (e) {
    if ([404, 401, 403].includes(e.status)) {
      documentLoadError.value = e.status;
      useLogger().error(e, `${t(e.status == 404 ? 'notFound' : 'notAuthorized')} ` + route.params.identifier);
    } else
      useLogger().error(e, `${t('errorLoading')} ` + route.params.identifier);
  }
  isLoading.value = false;
}
</script>