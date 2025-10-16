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

        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('general') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('title')">
                <km-lstring-value :value="viewDocument.title" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('description')">
                <km-lstring-value type="html" :value="viewDocument.description" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Timeline Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('timeline') }}</div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <km-form-group :caption="t('startDate')" v-if="viewDocument.timelineStartDate">
                    <km-value :value="viewDocument.timelineStartDate" />
                  </km-form-group>
                </div>
                <div class="col-md-6" v-if="viewDocument.timelineEndDate">
                  <km-form-group :caption="t('endDate')">
                    <km-value :value="viewDocument.timelineEndDate" />
                  </km-form-group>
                </div>
              </div>
              <km-form-group :caption="t('isOpenEnded')" v-if="viewDocument.isOpenEnded">
                <km-value :value="viewDocument.isOpenEnded ? t('yes') : t('no')" />
              </km-form-group>
              <km-form-group v-if="viewDocument.nextStepsInformation" :caption="t('nextStepsInformation')">
                <km-lstring-value type="html" :value="viewDocument.nextStepsInformation" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <km-form-group>
              <km-form-group v-if="viewDocument.performanceInformation" :caption="t('performanceInformation')">
                <km-lstring-value type="html" :value="viewDocument.performanceInformation" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group v-if="viewDocument.endorsementsInformation" :caption="t('endorsementsInformation')">
                <km-lstring-value type="html" :value="viewDocument.endorsementsInformation" :locale="selectedLocale" />
              </km-form-group>
        </km-form-group>

        <!-- Coverage Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('coverageSection') }}</div>
            <div class="card-body">

              <km-form-group :caption="t('coverageCountries')" v-if="viewDocument.coverageCountries && showCoverage">
                <km-value-terms :value="viewDocument.coverageCountries" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('coverageRegions')" v-if="viewDocument.coverageRegions && showCoverage">
                <km-value-terms :value="viewDocument.coverageRegions" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('coverageOther')" v-if="viewDocument.coverageOther">                
                <div v-for="otherCoverage in viewDocument.coverageOther" :key="otherCoverage" class="mb-1">
                    <km-lstring-value :value="otherCoverage" :locale="selectedLocale"></km-lstring-value>
                </div>
              </km-form-group>

              <km-form-group :caption="t('countryReviewTitle')" v-if="canShowCountryReviews"> 
                <div v-if="countryReviews?.length">
                    <div class="alert alert-success" v-if="showEnhancedReviews || reviewedByCountries.length">
                      {{ t('countryReviewHelp') }}
                    </div>
                    <country-review-list v-if="showEnhancedReviews"
                      :countryReviews="countryReviews"
                      @on-status-change="onStatusChange"></country-review-list>

                    <table v-else class="table table-bordered">
                      <tbody>
                        <tr v-for="review in reviewedByCountries" :key="review.government">
                          <td>
                            <km-term :value="{identifier: review.government}" :locale="selectedLocale"></km-term>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </div>
                <div  v-if="(!reviewedByCountries?.length && !showEnhancedReviews) || (canShowCountryReviews && !countryReviews?.length)" class="alert alert-info">{{ t('noCountryReviews') }}</div>
              </km-form-group>

              <km-form-group :caption="t('isLinkedToNbsap')" v-if="viewDocument.isLinkedToNbsap !== undefined">
                <km-value :value="viewDocument.isLinkedToNbsap ? t('yes') : t('no')" />
              </km-form-group>
              <km-form-group v-if="viewDocument.linkedToNbsapCountries" :caption="t('linkedToNbsapCountries')">
                <km-value-terms :value="viewDocument.linkedToNbsapCountries" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>
        <!-- Alignment Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('alignmentSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('primaryNationalTarget')" v-if="viewDocument.primaryNationalTarget">
                <km-value>
                  <km-link target="_blank"
                    :to="localePath(resolveSchemaViewRoute(SCHEMAS.NATIONAL_TARGET_7, viewDocument.primaryNationalTarget.identifier))" >
                    {{ lstring(nationalTargets[viewDocument.primaryNationalTarget.identifier]?.toString(), selectedLocale) }}
                  </km-link>
                </km-value>
              </km-form-group>
              <km-form-group :caption="t('primaryGlobalAlignment')" v-if="viewDocument.primaryGlobalAlignment">
                <km-value-term :value="viewDocument.primaryGlobalAlignment" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('otherNationalTargets')" v-if="viewDocument.otherNationalTargets">
                 <km-value v-for="target in viewDocument.otherNationalTargets" :key="target" class="mb-1">
                  <km-link target="_blank"
                    :to="localePath(resolveSchemaViewRoute(SCHEMAS.NATIONAL_TARGET_7, target.identifier))" >
                    {{ lstring(nationalTargets[target.identifier], selectedLocale) }}
                  </km-link>
                </km-value>
              </km-form-group>
              <km-form-group :caption="t('otherGlobalAlignments')" v-if="viewDocument.otherGlobalAlignments">
                <km-value-terms :value="viewDocument.otherGlobalAlignments" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('indicators')" v-if="viewDocument.indicators">
                <km-value-terms :value="viewDocument.indicators" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('implementingConsiderations')" v-if="viewDocument.implementingConsiderations">
                <km-value-terms :value="viewDocument.implementingConsiderations" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('alignmentInformation')" v-if="viewDocument.alignmentInformation">
                <km-lstring-value type="html" :value="viewDocument.alignmentInformation" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Funding Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('fundingSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('fundingSource')" v-if="viewDocument.fundingSource">
                <km-lstring-value type="html" :value="viewDocument.fundingSource" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('isFundingSufficient')" v-if="viewDocument.isFundingSufficient !== undefined">
                <km-value :value="viewDocument.isFundingSufficient ? t('yes') : t('no')" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Partners & Frameworks -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('partnersFrameworksSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('internationalFrameworks')" v-if="viewDocument.internationalFrameworks">
                <km-lstring-value type="html" :value="viewDocument.internationalFrameworks" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('partners')" v-if="viewDocument.partners">
                <km-lstring-value type="html" :value="viewDocument.partners" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Progress Section -->
        <km-form-group>
          <div class="card">
            <div class="card-header bg-secondary">{{ t('progressSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('isReportingOnTarget15')" v-if="viewDocument.isReportingOnTarget15 !== undefined">
                <km-value :value="viewDocument.isReportingOnTarget15 ? t('yes') : t('no')" />
              </km-form-group>
              <km-form-group v-if="viewDocument.target15Information" :caption="t('target15Information')">
                <km-lstring-value type="html" :value="viewDocument.target15Information" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('isProgressTracked')" v-if="viewDocument.isProgressTracked !== undefined">
                <km-value :value="viewDocument.isProgressTracked ? t('yes') : t('no')" />
              </km-form-group>
              <km-form-group v-if="viewDocument.progressInformation" :caption="t('progressInformation')">
                <km-lstring-value type="html" :value="viewDocument.progressInformation" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group v-if="viewDocument.progressTrackingUrl" :caption="t('progressTrackingUrl')">
                <km-value :value="viewDocument.progressTrackingUrl" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Implementation Strategies -->
        <km-form-group v-if="viewDocument.implementationStrategies">
          <div class="card">
            <div class="card-header bg-secondary">{{ t('implementationStrategiesSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('implementationStrategies')">
                <km-lstring-value type="html" :value="viewDocument.implementationStrategies" :locale="selectedLocale" />
              </km-form-group>
            </div>
          </div>
        </km-form-group>

        <!-- Additional Information -->
        <km-form-group v-if="viewDocument.additionalInformation || viewDocument.additionalDocuments?.length">
          <div class="card">
            <div class="card-header bg-secondary">{{ t('additionalInformationSection') }}</div>
            <div class="card-body">
              <km-form-group :caption="t('additionalInformation')">
                <km-lstring-value type="html" :value="viewDocument.additionalInformation" :locale="selectedLocale" />
              </km-form-group>
              <km-form-group :caption="t('additionalDocuments')">
                <km-view-links :can-edit="false" :links="viewDocument.additionalDocuments" />
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
<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/view-commitment.json"></i18n>

<script setup lang="ts">

  import { useRoute } from 'vue-router'
  import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";
  import { KmDocumentsService } from "@/services/kmDocuments";
  import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
  import KmStakeholderCommitmentApi from '~/api/km-stakeholder-commitment';
  import type { EStakeholderCommitment } from '~/types/schemas/EStakeholderCommitment';
  import type { ETerm } from '~/types/schemas/base/ETerm';
  import type { ECommitmentCountryReview } from '~/types/schemas/ECommitmentCountryReview';
  import { useThesaurusStore } from '@/stores/thesaurus';
  import _ from 'lodash';
  import { resolveSchemaViewRoute } from '~/utils';
import type { EDictionary } from '~/types/schemas/base/EDictionary';
import type { EDocumentInfo } from '~/types/schemas/base/EDocumentInfo';

  const kmStakeholderCommitmentApi = new KmStakeholderCommitmentApi({});

  const emit = defineEmits(['onDocumentLoad', 'onStatusChange']);
  const route = useRoute();
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const localePath  = useLocalePath();
  const thesaurusStore = useThesaurusStore();
  const security      = useSecurity();

  const props = defineProps({
    document: { type: Object, default: undefined },
    identifier: { type: String, required: true },
    hideCountryReviews: {type:Boolean, default:false}
  });

  const { document, identifier } = toRefs(props);
  const lDocument = ref<EStakeholderCommitment|null>(null);
  const documentInfo = ref<EDocumentInfo|null>();
  const isLoading = ref(false);
  const documentLoadError = ref(null);
  const selectedLocale = ref(locale.value);
  const nationalTargets = ref<EDictionary<string>>({});
  const countryReviews = ref<ECommitmentCountryReview[]>([]);
  const showCoverage = ref(true);

  const viewDocument = computed(() => {
    return document?.value || lDocument?.value;
  })

  const showEnhancedReviews = computed(()=>{
    if(user.value?.government){
      if(security.role.isNationalFocalPoint())
        return countryReviews.value.find((e: ECommitmentCountryReview)=>e.government == user.value.government)
    }
    const contributors = [
      documentInfo.value?.submittedBy?.userID,
      documentInfo.value?.createdBy?.userID,
      documentInfo.value?.updatedBy?.userID,
      documentInfo.value?.workingDocumentCreatedBy?.userID,
      documentInfo.value?.workingDocumentUpdatedBy?.userID
     ]
    return  contributors.includes(user.value?.userID);
  })
  const canShowCountryReviews = computed(()=>countryReviews.value?.length || 
        showEnhancedReviews.value ||
        (!reviewedByCountries.value?.length && !showEnhancedReviews.value))
  const reviewedByCountries = computed(()=>{
    return countryReviews.value.filter((e:ECommitmentCountryReview)=>e.reviewed===true)
  });

  onMounted(async() => {
    if (props.identifier && !props.document) {
      await loadDocument(props.identifier)
    }
    if(viewDocument.value?.primaryNationalTarget || viewDocument.value?.otherNationalTargets?.length){
        loadNationalTargets([viewDocument.value?.primaryNationalTarget, ...(viewDocument.value?.otherNationalTargets||[])].filter(e=>e).map(e=>e.identifier));
    }

    if(viewDocument.value?.coverageCountries?.length || viewDocument.value?.coverageRegions?.length)
      await loadCountryReviews();
  })

  async function loadDocument(identifier:string) {
    isLoading.value = true;
    try {
      if (route.query?.draft == 'true' || route.query?.draft === null) {
        const draftRecord = await KmDocumentDraftsService.loadDraftDocument(route.params.identifier as string);
        lDocument.value = draftRecord?.body as EStakeholderCommitment;
        documentInfo.value = draftRecord;
        emit('onDocumentLoad', draftRecord);
      } else {
        const record = await KmDocumentsService.loadDocument(route.params.identifier as string);
        lDocument.value = record.body;
        documentInfo.value = record;
        showCoverage.value = false;
        emit('onDocumentLoad', record);
      }

    } catch (e:any) {
      if ([404, 401, 403].includes(e.status)) {
        documentLoadError.value = e.status;
        useLogger().error(e, `${t(e.status == 404 ? 'notFound' : 'notAuthorized')} ` + route.params.identifier);
      } else
        useLogger().error(e, `${t('errorLoading')} ` + route.params.identifier);
    }
    isLoading.value = false;
  }
  async function loadNationalTargets(identifiers: string[]) {
      const queries:Array<String> = [];

      queries.push(`identifier_s:(${identifiers.map(e=>escape(e)).join(' ')})`);

      const targetQuery = {
          query: queries,            
          rowsPerPage: identifiers.length,
          fields : 'identifier:identifier_s,title:title_EN_s'
      }

      const result = await queryIndex(parseSolrQuery(targetQuery, locale.value))
      
      const targets:EDictionary<string> = {};
      result.docs.forEach((doc: any)=>{
          targets[doc.identifier] = doc.title as string;
      })
      nationalTargets.value = targets;
  }
  async function loadCountryReviews(){
    countryReviews.value = await kmStakeholderCommitmentApi.getCountryReviews(
      { identifier: props.identifier }, { length : 500});
  }
  async function onStatusChange(identifier:string, reviewed:boolean){
    loadCountryReviews();
      emit('onStatusChange', identifier, reviewed)
  }

  // async function getCoverageCountries (draft:EStakeholderCommitment): Promise<string[]> {
  //   if (draft === undefined) { return [] }

  //   let countries: string[] = []
  //   if (draft.coverageCountries?.length > 0) {
  //     countries = draft.coverageCountries.map(c => c.identifier)
  //   }
  //   if (draft.coverageRegions?.length > 0) {
  //     const regionCountries = await getRegionCountries(draft.coverageRegions)
  //     if (regionCountries?.length > 0) { 
  //       countries = [...countries, ...regionCountries] 
  //     }
  //   }

  //   return countries
  // }

  // async function getRegionCountries (regions:ETerm[]): Promise<string[]> {
  //   const regionCountries = await Promise.all(regions?.map((term:ETerm)=>thesaurusStore.loadTerm(term.identifier)))

  //   return _(regionCountries).map((e:any)=>e.ss).flatten().filter((e:string) => e.length > 3).uniq().value();
  // }

</script>