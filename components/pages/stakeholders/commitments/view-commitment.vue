<template>
  <CCard>
    <CCardHeader>
      {{ t('nsaIntentTitle') }}
    </CCardHeader>
    <CCardBody>
      <div v-if="viewDocument">
        <div v-if="viewDocument.header.languages && viewDocument.header.languages.length > 1"
             class="d-grid d-md-flex justify-content-md-end mb-2">
          <km-locales v-model="selectedLocale" :locales="viewDocument.header.languages"></km-locales>
        </div>

        <!-- General Section -->
        <km-form-group v-if="viewDocument.isNonStateActor !== undefined">
          <div class="card">
            <div class="card-header bg-secondary">{{ t('general') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('isNonStateActor')">
                <km-lstring-value :value="t(viewDocument.isNonStateActor ? 'nonStateActor' : 'party')" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group v-if="viewDocument.isNonStateActor === false && viewDocument.government" :caption="t('government')">
                <km-value-term :value="viewDocument.government" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Contact Details Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('contactDetailsSection') }}</div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <km-form-group :caption="t('firstName')" v-if="viewDocument.firstName">
                    <km-value :value="viewDocument.firstName" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6">
                  <km-form-group :caption="t('lastName')" v-if="viewDocument.lastName">
                    <km-value :value="viewDocument.lastName" :locale="selectedLocale" />
                  </km-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <km-form-group :caption="t('designation')" v-if="viewDocument.designation">
                    <km-lstring-value :value="viewDocument.designation" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6">
                  <km-form-group :caption="t('department')" v-if="viewDocument.department">
                    <km-lstring-value :value="viewDocument.department" :locale="selectedLocale" />
                  </km-form-group>
                </div>
              </div>
              <km-form-group :caption="t('organization')" v-if="viewDocument.organization">
                <km-lstring-value :value="viewDocument.organization" :locale="selectedLocale" />
              </km-form-group>
              <div class="row">
                <div class="col-md-6">
                  <km-form-group :caption="t('organizationAcronym')" v-if="viewDocument.organizationAcronym">
                    <km-lstring-value :value="viewDocument.organizationAcronym" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6">
                  <km-form-group :caption="t('organizationType')" v-if="viewDocument.organizationType">
                    <km-value-term :value="viewDocument.organizationType" :locale="selectedLocale" />
                  </km-form-group>
                </div>
              </div>
              <km-form-group :caption="t('address')" v-if="viewDocument.address">
                <km-lstring-value :value="viewDocument.address" :locale="selectedLocale" />
              </km-form-group>
              <div class="row">
                <div class="col-md-6">
                  <km-form-group :caption="t('city')" v-if="viewDocument.city">
                    <km-lstring-value :value="viewDocument.city" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6">
                  <km-form-group :caption="t('state')" v-if="viewDocument.state">
                    <km-lstring-value :value="viewDocument.state" :locale="selectedLocale" />
                  </km-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <km-form-group :caption="t('postalCode')" v-if="viewDocument.postalCode">
                    <km-lstring-value :value="viewDocument.postalCode" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6">
                  <km-form-group :caption="t('country')" v-if="viewDocument.country">
                    <km-value-term :value="viewDocument.country" :locale="selectedLocale" />
                  </km-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <km-form-group :caption="t('phones')" v-if="viewDocument.phones">
                    <km-value-list :value="viewDocument.phones" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6">
                  <km-form-group :caption="t('emails')" v-if="viewDocument.emails">
                    <km-value-list :value="viewDocument.emails" :locale="selectedLocale" />
                  </km-form-group>
                </div>
              </div>
              <km-form-group :caption="t('websites')" v-if="viewDocument.websites">
                <km-view-links :can-edit="false" :links="viewDocument.websites" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Jurisdiction Details Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('jurisdictionDetailsSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('jurisdiction')" v-if="viewDocument.jurisdiction">
                <km-value-term :value="viewDocument.jurisdiction" :locale="selectedLocale" />
              </km-form-group>
              <div class="row">
                <div class="col-md-6" v-if="viewDocument.jurisdictionCountries">
                  <km-form-group :caption="t('jurisdictionCountries')">
                    <km-value-terms :value="viewDocument.jurisdictionCountries" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6" v-if="viewDocument.jurisdiction?.customValue">
                  <km-form-group :caption="t('localSubNational')">
                    <km-lstring-value :value="viewDocument.jurisdiction.customValue" :locale="selectedLocale" />
                  </km-form-group>
                </div>
                <div class="col-md-6" v-if="viewDocument.jurisdictionRegions">
                  <km-form-group :caption="t('jurisdictionRegions')">
                    <km-value-terms :value="viewDocument.jurisdictionRegions" :locale="selectedLocale" />
                  </km-form-group>
                </div>
              </div>
            </div>
          </div>
        </km-form-group>

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
        <km-form-group v-if="viewDocument.relevantInformation">
          <div class="card">
            <div class="card-header bg-secondary">{{ t('otherRelevantInformation') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('otherRelevantInformationInfo')">
                <km-lstring-value type="html" :value="viewDocument.relevantInformation" :locale="selectedLocale" />
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

<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/edit-commitment.json"></i18n>

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