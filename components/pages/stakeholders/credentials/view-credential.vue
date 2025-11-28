<template>
  <CCard>
    <CCardHeader>
      {{ t('nsaCredentialTitle') }}
    </CCardHeader>
    <CCardBody>
      <div v-if="viewDocument">
        <div v-if="viewDocument.header.languages && viewDocument.header.languages.length > 1"
             class="d-grid d-md-flex justify-content-md-end mb-2">
          <km-locales v-model="selectedLocale" :locales="viewDocument.header.languages"></km-locales>
        </div>

        <!-- General Section -->
        <km-form-group v-if="viewDocument.isParty !== undefined">
          <div class="card">
            <div class="card-header bg-secondary">{{ t('general') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('isParty')">
                <km-lstring-value :value="t(viewDocument.isParty ? 'party' : 'nonStateActor')" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group v-if="viewDocument.isParty === true && viewDocument.government" :caption="t('government')">
                <km-value-term :value="viewDocument.government" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <view-contact-details :document="viewDocument" :locale="selectedLocale"></view-contact-details>

        <!-- Authority Documents Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('authorityDocumentsSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('authorityDocuments')" v-if="viewDocument.authorityDocuments">
                <km-view-links :can-edit="false" :links="viewDocument.authorityDocuments" />
              </km-form-group>
              <km-form-group :caption="t('authorizedEmails')" v-if="viewDocument.authorizedEmails">
                <km-value-list  v-if="!security.role.isAdministrator()" :value="viewDocument.authorizedEmails" />
                <div v-else>
                    <km-value v-for="(item, index) in viewDocument.authorizedEmails" :key="index" class="mb-1">
                      <a :href="`${ACCOUNTS_HOST_URL}/admin/users?freetext=${item}`" target="_blank">{{ item }} </a>
                    </km-value>
                </div>
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Other Relevant Information Section -->
        <km-form-group v-if="viewDocument.additionalInformation">
          <div class="card">
            <div class="card-header bg-secondary">{{ t('otherRelevantInformation') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('otherRelevantInformationInfo')">
                <km-lstring-value type="html" :value="viewDocument.additionalInformation" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>
      </div>
      <km-document-error v-if="!viewDocument && !isLoading && documentLoadError" :document-error="documentLoadError" />
      <km-spinner :visible="isLoading" v-if="isLoading" center />
    </CCardBody>
  </CCard>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/credentials/edit-credential.json"></i18n>

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