<template>
    <CCard>
        <CCardHeader>
            <slot name="header">{{ t('stakeholderCommitmentTitle') }}</slot>
        </CCardHeader>
        <CCardBody>
            <km-form-workflow v-if="!isBusy && cleanDocument?.header" :focused-tab="props.workflowActiveTab"
                :document="cleanDocument" :container="container">
                <template v-slot:submission>
                    <form name="editForm">
                        <km-form-group name="languages" :caption="t('submissionLanguage')" required>
                            <km-languages v-model="document.header.languages"></km-languages>
                        </km-form-group>
                        <div class="vld-parent">
                            <km-suspense>
                                <edit-contact-details v-model="contactDetails" 
                                    :locales="document.header.languages"
                                    @update:modelValue="onContactDetailsUpdate"></edit-contact-details>

                                <overlay-loading :active="myIntents?.length" background-color="rgb(9 9 9)"
                                    :opacity="0.1" :is-full-page="false">
                                    <CAlert class="m-2" color="info">
                                        <strong>  {{ t('contactModifyMessage') }}</strong> 
                                    </CAlert>
                                </overlay-loading>
                            </km-suspense>
                        </div>
                        
                        <!-- General Section -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('general') }}</div>
                                <div class="card-body">
                                    <km-form-group name="title" :caption="t('title')" required>
                                        <km-input-lstring v-model="document.title"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                    <km-form-group name="description" :caption="t('description')" required>
                                        <div class="alert alert-info">
                                            <font-awesome-icon icon="fa-info-circle" class="me-2" /> {{ t('including')
                                            }}
                                            <p>{{ t('descriptionHelp_a') }}</p>
                                            <p>{{ t('descriptionHelp_b') }}</p>
                                        </div>
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier" v-model="document.description"
                                            :locales="document.header.languages" />
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
                                            <km-form-group name="timelineStartDate" :caption="t('startDate')" required>
                                                <input type="date" class="form-control"
                                                    v-model="document.timelineStartDate" :disabled="isOpenEnded" />
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="timelineEndDate" :caption="t('endDate')">
                                                <input type="date" class="form-control"
                                                    v-model="document.timelineEndDate" :disabled="isOpenEnded" />
                                            </km-form-group>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-center align-items-center" style="height: 30px;">
                                        <strong class="rounded-circle border border-dark p-2">{{ t('or') }}</strong>
                                    </div>

                                    <km-form-group name="isOpenEnded" :caption="t('isOpenEnded')" required>
                                        <CFormCheck id="isOpenEnded" :label="t('openEnded')"
                                            :disabled="hasTimelineDates" v-model="document.isOpenEnded" />
                                    </km-form-group>

                                    <km-form-group name="nextStepsInformation" :caption="t('nextStepsInformation')"
                                        required v-if="document.isOpenEnded">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.nextStepsInformation"
                                            :locales="document.header.languages" />
                                    </km-form-group>

                                </div>
                            </div>
                        </km-form-group>

                        <km-form-group name="performanceInformation" :caption="t('performanceInformation')">
                            <km-input-rich-lstring @onFileUpload="onFileUpload" :identifier="document.header.identifier"
                                v-model="document.performanceInformation" :locales="document.header.languages" />
                        </km-form-group>

                        <km-form-group name="endorsementsInformation" :caption="t('endorsementsInformation')">
                            <km-input-rich-lstring @onFileUpload="onFileUpload" :identifier="document.header.identifier"
                                v-model="document.endorsementsInformation" :locales="document.header.languages" />
                        </km-form-group>

                        <!-- Jurisdiction Section -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('coverageSection') }}</div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <km-form-group name="coverageScope" :caption="t('coverageScope')" required>                                                            
                                                <km-form-check-item :inline="true" type="radio" name="coverageScope" for="coverageScope" id="coverageScopeNational" value="national" v-model="document.coverageScope" :label="t('national')"/>
                                                <km-form-check-item :inline="true" type="radio" name="coverageScope" for="coverageScope" id="coverageScopeMultiCountries" value="multiCountries"   v-model="document.coverageScope" :label="t('multiCountries')"/>                                                             
                                                <km-form-check-item :inline="true" type="radio" name="coverageScope" for="coverageScope" id="coverageScopeGlobal" value="global" v-model="document.coverageScope" :label="t('global')"/>                                                                                                        
                                                <div><small id="emailHelp" class="form-text text-muted">{{t('coverageScopeHelp')}}</small></div>
                                         </km-form-group>
                                        </div>  
                                    </div>
                                    <div class="row" v-if="document.coverageScope">
                                        <div class="col-md-12">
                                            <km-form-group name="coverageCountries" :caption="t('coverageCountries')"
                                                required v-if="document.coverageScope === 'national' || document.coverageScope === 'multiCountries'">
                                                <km-select v-model="document.coverageCountries" :options="countries"
                                                    :placeholder="t('coverageCountries')"
                                                    @update:modelValue="onCoverageCountriesChange"
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"
                                                    :max="document.coverageScope === 'national' ? 1 : 300"
                                                    :close-on-select="document.coverageScope === 'national'" :multiple="true">
                                                </km-select>
                                            </km-form-group>
                                        </div>
                                        <!-- <div class="col-md-2">
                                            <div class="d-flex justify-content-center align-items-center"
                                                style="height: 30px;" v-if="disableLinkedToNbsapCountries">
                                                <strong class="rounded-circle border border-dark p-2">{{ t('andOr') }}</strong>
                                            </div>
                                        </div> -->
                                        <div class="col-md-12">
                                            <km-form-group name="coverageRegions" :caption="t('coverageRegions')"
                                                required v-if="document.coverageScope === 'global'">
                                                <km-select v-model="document.coverageRegions"
                                                    :options="regions" multiple :placeholder="t('coverageRegions')"
                                                    :close-on-select="false" 
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"/>
                                                    <region-country-list v-if="document.coverageRegions?.length" :regions="document.coverageRegions"></region-country-list>                                                    
                                            </km-form-group>
                                        </div>

                                        <km-form-group name="coverageOther" :caption="t('coverageOther')">
                                            <!-- <small id="emailHelp" class="form-text text-muted">{{t('coverageOther')}}</small> -->
                                            <km-input-lstring-ml v-model="document.coverageOther"
                                                :locales="document.header.languages" type="text" />
                                        </km-form-group>

                                        <km-form-group name="isLinkedToNbsap" :caption="t('isLinkedToNbsap')" required>
                                            <km-form-check-item :inline="true" type="radio" name="isLinkedToNbsap"  for="isLinkedToNbsap" id="isLinkedToNbsap" @update:modelValue="onLinkedToNbsapChange" :value="true"  v-model="document.isLinkedToNbsap" :label="t('yes')"/>
                                            <km-form-check-item :inline="true" type="radio" name="isLinkedToNbsap"  for="isLinkedToNbsap" id="isLinkedToNbsap" @update:modelValue="onLinkedToNbsapChange" :value="false" v-model="document.isLinkedToNbsap" :label="t('no')"/>                                                             
                                        </km-form-group>
                                        <km-form-group name="linkedToNbsapCountries"
                                            :caption="t('linkedToNbsapCountries')" required
                                            v-if="document.isLinkedToNbsap">
                                            <small class="form-text text-muted">{{ t('nbsapCountriesHelp') }}</small>
                                            <km-select :disabled="disableLinkedToNbsapCountries"
                                                v-model="document.linkedToNbsapCountries" :options="countries" multiple
                                                :close-on-select="false" :placeholder="t('linkedToNbsapCountries')" 
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"/>
                                        </km-form-group>
                                    </div>
                                </div>
                            </div>
                        </km-form-group>

                        <!-- Alignment Section -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('alignmentSection') }}</div>
                                <div class="card-body">
                                    <div class="alert alert-info">
                                        {{ t('alignmentSectionHelp') }}
                                    </div>
                                    <div class="border p-3 mb-3">
                                        <div class="col-md-12" v-if="hasCoverageCountries==1 && !document.coverageRegions?.length">
                                            <km-form-group name="primaryNationalTarget"
                                                :caption="t('primaryNationalTarget')" required>
                                                <km-select v-model="document.primaryNationalTarget"
                                                    :options="nationalTargets" :disabled="!hasCoverageCountries"
                                                    :placeholder="t('primaryNationalTarget')"
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"/>
                                            </km-form-group>
                                        </div>
                                        <div class="d-flex justify-content-center align-items-center"
                                            style="height: 30px;" v-if="hasCoverageCountries==1 && !document.coverageRegions?.length">
                                            <strong class="rounded-circle border border-dark p-2">{{ t('andOr') }}</strong>
                                        </div>
                                        <div class="col-md-12">
                                            <!-- only to display for validation error when nothing is selected -->
                                            <span class="d-none">
                                                <label name="primaryNationalTarget" for="primaryNationalTarget">
                                                    {{t('primaryNationalTarget')}}
                                                </label>
                                            </span>
                                            <km-form-group name="primaryGlobalAlignment"
                                                :caption="t('primaryGlobalAlignment')" required>
                                                <km-select v-model="document.primaryGlobalAlignment"
                                                    :options="globalGoalAndTargets"  :disabled="!hasCoverageCountries"
                                                    :placeholder="t('primaryGlobalAlignment')"  @update:modelValue="onGoalsAndTargetSelected"
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"/>
                                            </km-form-group>
                                        </div>
                                    </div>
                                    <div class="col-md-12" v-if="hasCoverageCountries==1">
                                        <km-form-group name="otherNationalTargets" :caption="t('otherNationalTargets')">
                                            <km-select v-model="document.otherNationalTargets"
                                                :options="nationalTargets" :placeholder="t('otherNationalTargets')"
                                                multiple :close-on-select="false" 
                                                :custom-label="customLabel" :custom-selected-item="customSelectedItem"/>
                                        </km-form-group>
                                    </div>
                                    <div class="col-md-12">
                                        <km-form-group name="otherGlobalAlignments"
                                            :caption="t('otherGlobalAlignments')">
                                            <km-select v-model="document.otherGlobalAlignments"
                                                :options="globalGoalAndTargets"
                                                :placeholder="t('otherGlobalAlignments')" multiple
                                                :close-on-select="false" @update:modelValue="onGoalsAndTargetSelected"
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"/>
                                        </km-form-group>
                                    </div>
                                    <km-form-group name="indicators" :caption="t('indicators')" v-if="indicators.length">
                                        <small class="form-text text-muted">{{ t('indicatorsHelp') }}</small>
                                        <km-select v-model="document.indicators" :options="indicators" multiple :placeholder="t('indicators')"  :close-on-select="false"
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem">
                                            <template #option="{option}">
                                                <div class="d-flex flex-column">
                                                    <span><strong>{{ startCase(option.type) }}</strong> - {{ lstring(option.title, locale) }}</span>
                                                </div>
                                            </template>
                                        </km-select>
                                    </km-form-group>
                                    <km-form-group name="implementingConsiderations"
                                        :caption="t('implementingConsiderations')">
                                        <km-select v-model="document.implementingConsiderations" :options="gbfTargetConsideration" multiple :placeholder="t('implementingConsiderations')"  :close-on-select="false"
                                                    :custom-label="customLabel" :custom-selected-item="customSelectedItem"/>
                                    </km-form-group>
                                    <km-form-group name="alignmentInformation" :caption="t('alignmentInformation')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.alignmentInformation"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>

                        <!-- Funding Section -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('fundingSection') }}</div>
                                <div class="card-body">
                                    <km-form-group name="fundingSource" :caption="t('fundingSource')">
                                         <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.fundingSource"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                    <km-form-group name="isFundingSufficient" :caption="t('isFundingSufficient')" required>                                        
                                        <km-form-check-item :inline="true" type="radio" name="isFundingSufficient"  for="isFundingSufficient" id="isFundingSufficientTrue"       :value="true"        v-model="document.isFundingSufficient" :label="t('yes')"/>
                                        <km-form-check-item :inline="true" type="radio" name="isFundingSufficient"  for="isFundingSufficient" id="isFundingSufficientFalse"      :value="false"       v-model="document.isFundingSufficient" :label="t('no')"/>                                                             
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>

                        <!-- Partners & Frameworks -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('partnersFrameworksSection') }}</div>
                                <div class="card-body">
                                    <km-form-group name="internationalFrameworks"
                                        :caption="t('internationalFrameworks')">
                                         <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.internationalFrameworks"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                    <km-form-group name="partners" :caption="t('partners')" required>
                                         <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"required
                                            v-model="document.partners"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>

                        <!-- Progress Section -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('progressSection') }}</div>
                                <div class="card-body">
                                    <!-- Target 15 Section -->
                                    <km-form-group name="isReportingOnTarget15" :caption="t('isReportingOnTarget15')" required>                                        
                                        <km-form-check-item :inline="true" type="radio" name="isReportingOnTarget15"  for="isReportingOnTarget15" id="isReportingOnTarget15True"       :value="true"        v-model="document.isReportingOnTarget15" :label="t('yes')"/>
                                        <km-form-check-item :inline="true" type="radio" name="isReportingOnTarget15"  for="isReportingOnTarget15" id="isReportingOnTarget15False"      :value="false"       v-model="document.isReportingOnTarget15" :label="t('no')"/>                                                             
                                    </km-form-group>

                                    <km-form-group name="target15Information" :caption="t('target15Information')" required v-if="document.isReportingOnTarget15">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.target15Information"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                    
                                    <km-form-group name="isProgressTracked" :caption="t('isProgressTracked')" required>                                        
                                        <km-form-check-item :inline="true" type="radio" name="isProgressTracked"  for="isProgressTracked" id="isProgressTrackedTrue"       :value="true"        v-model="document.isProgressTracked" :label="t('yes')"/>
                                        <km-form-check-item :inline="true" type="radio" name="isProgressTracked"  for="isProgressTracked" id="isProgressTrackedFalse"      :value="false"       v-model="document.isProgressTracked" :label="t('no')"/>                                                             
                                    </km-form-group>
                                    <km-form-group name="progressInformation" :caption="t('progressInformation')" required v-if="document.isProgressTracked">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.progressInformation"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                    <km-form-group name="progressTrackingUrl" :caption="t('progressTrackingUrl')" v-if="document.isProgressTracked">
                                        <input type="url" class="form-control" v-model="document.progressTrackingUrl" />
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>

                        <!-- Implementation Strategies -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('implementationStrategiesSection') }}</div>
                                <div class="card-body">
                                    <km-form-group name="implementationStrategies"
                                        :caption="t('implementationStrategies')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.implementationStrategies"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>

                        <!-- Additional Information -->
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">{{ t('additionalInformationSection') }}</div>
                                <div class="card-body">
                                    <km-form-group name="additionalInformation"
                                        :caption="t('additionalInformation')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.additionalInformation"
                                            :locales="document.header.languages" />
                                    </km-form-group>
                                    <km-form-group name="additionalDocuments" :caption="t('additionalDocuments')">
                                        <km-add-link-file v-model="document.additionalDocuments" :allow-link="true"
                                            :allow-file="true" :identifier="document.header.identifier" />
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                    </form>
                </template>
                <template v-slot:review>
                    <view-commitment :identifier="document.header.identifier"
                        :document="cleanDocument"></view-commitment>
                </template>
                <template v-slot:publish></template>
                <template v-slot:submissionSuccessMessage>
                    {{ t('submitCommitmentSuccessMessage') }}
                </template>
            </km-form-workflow>
            <km-spinner center :visible="isBusy" v-if="isBusy"></km-spinner>
        </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/edit-commitment.json"></i18n>
<script setup lang="ts">
    import { useThesaurusStore } from '@/stores/thesaurus';
    import { useRoute } from 'vue-router'
    import { useStorage } from '@vueuse/core'
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { cloneDeep,startCase, uniqBy } from 'lodash'    
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
    import { ETerm } from '~/types/schemas/base/ETerm';
    import type { ELstring } from "~/types/schemas/base/ELstring";
    import type { EContactBase } from '~/types/schemas/EContactBase';
    import { KmDocumentsService } from '~/services/kmDocuments';
    import type { EDocumentInfo } from '~/types/schemas/base/EDocumentInfo';
    import type { EStakeholderCredential, EStakeHolderContact } from '~/types/schemas/EStakeholderCredential';
    import type { EStakeholderCommitment } from '~/types/schemas/EStakeholderCommitment';
    import OverlayLoading from 'vue3-loading-overlay';
    import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';

    const props = defineProps({
        identifier: { type: String },
        rawDocument: { type: Object },
        workflowActiveTab: { type: Number, default: 1 },
    })

    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit = defineEmits(['onClose', 'onPostSaveDraft'])

    const refProps = toRefs(props);
    const { $appRoutes: appRoutes } = useNuxtApp();
    const { user } = useAuth();
    const route = useRoute();
    const { t, locale } = useI18n();
    const thesaurusStore = useThesaurusStore();
    const container = useAttrs().container;
    const showGlobalTargetsModal = ref(false);
    const document = ref();
    const isBusy = ref(false);
    const validationReport = ref({});
    const documentInfo = ref<EDocumentInfo | undefined>(undefined);
    const nationalTargets = ref([]);
    const indicators      = ref<Object[]>([]);
    const myIntents       = ref();

    const contactDetails:ComputedRef<EStakeHolderContact>  = computed(()=>extractContactDetails(document.value));
    const countries = computed(() => thesaurusStore.getDomainTerms(THESAURUS.COUNTRIES).sort((a:ETerm, b:ETerm) => a.name?.localeCompare(b.name as string)))
    const regions = computed(() => thesaurusStore.getDomainTerms(THESAURUS.REGIONS).sort((a:ETerm, b:ETerm) => a.name?.localeCompare(b.name as string)))

    const globalTargets = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS) || []).sort(sortTermByName));
    const globalGoals = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS) || []).sort(sortTermByName));
    const gbfTargetConsideration = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS) || []).sort(sortTermByName));
    const globalGoalAndTargets = computed(() => [...globalGoals.value, ...globalTargets.value]);

    const hasPrimaryNationalTarget = computed(() => document.value?.primaryNationalTarget);
    const hasPrimaryGlobalTarget = computed(() => document.value?.primaryGlobalAlignment);

    const hasTimelineDates = computed(() => {
        return !!(document.value?.timelineStartDate || document.value?.timelineEndDate);
    });

    const isOpenEnded = computed(() => {
        return !!document.value?.isOpenEnded;
    });

    const hasCoverageCountries = computed(() => document.value?.coverageCountries?.length);
    const disableLinkedToNbsapCountries = computed(() => {
        return !document.value?.isLinkedToNbsap ||
            document.value?.coverageCountries?.length == 1;
    });

    const cleanDocument = computed(() => {
        const clean = useKmStorage().cleanDocument({ ...document.value });

        if (isOpenEnded.value === true){
            clean.timelineStartDate = undefined;
            clean.timelineEndDate = undefined;
        }
        else 
            clean.nextStepsInformation = undefined;  

        if (hasTimelineDates.value === true) {
            clean.isOpenEnded = undefined;
            clean.nextStepsInformation = undefined;
        }

        if (clean.isParty === true)
            clean.government = undefined;
        clean.additionalDocuments = undefined;

        if(clean.coverageScope === 'national')
            clean.coverageRegions = undefined;
        else if(clean.coverageScope === 'multiCountries')
            clean.coverageRegions = undefined;
        else if(clean.coverageScope === 'global')
            clean.coverageCountries = undefined;    

        if(hasCoverageCountries.value > 1 || clean.coverageRegions?.length){
            clean.otherNationalTargets = undefined;
            clean.primaryNationalTarget = undefined;
        }
        
        if(!clean.isLinkedToNbsap)
            clean.linkedToNbsapCountries = undefined;
        if(!clean.isReportingOnTarget15)
            clean.target15Information = undefined;

        if(!clean.isProgressTracked){
            clean.progressInformation = undefined;
            clean.progressTrackingUrl = undefined;
        }

        return clean
    })

    const onPostClose = async (document: any) => {
        await useNavigateAppTo(appRoutes.STAKEHOLDER_MY_COMMITMENTS);
    }

    const onPostSaveDraft = async (document: any) => {
        emit('onPostSaveDraft', document);
        documentInfo.value = document
    }

    const onPostReviewDocument = async (document: any, newValidationReport: any) => {
        validationReport.value = cloneDeep(newValidationReport);
    }

    const onGetDocumentInfo = async () => {
        return documentInfo.value || {};
    }


    function onFileUpload({ file, locale }: { file: File, locale?: string }) {
        if (!document.value || !document.value.header || !document.value.header.identifier)
            return;
        useOnFileUpload({ document, file, locale });
    }

    function emptyDocument() {

        return EditFormUtility.buildEmptyDocument(SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT, {government:undefined});
    }

    function onContactDetailsUpdate(contactDetails:EContactBase){
        document.value = {
            ...document.value,
            ...extractContactDetails(contactDetails as EStakeholderCommitment)
        }
    }

    function onCoverageCountriesChange() {
        if (document.value.isLinkedToNbsap) {
            if (document.value.coverageCountries?.length == 1)
                document.value.linkedToNbsapCountries = document.value.coverageCountries;
            if (document.value.coverageCountries?.length == 0)
                document.value.linkedToNbsapCountries = [];
        }

        if (document.value.coverageCountries?.length == 1) {
            loadNationalTargets(document.value.coverageCountries[0].identifier);
        }
        else {
            nationalTargets.value = [];
        }
    }

    function onLinkedToNbsapChange() {
        if (!document.value.isLinkedToNbsap)
            document.value.linkedToNbsapCountries = undefined;
        else {
            onCoverageCountriesChange();
        }
    }

    async function loadNationalTargets(government: string) {
        const queries:Array<String> = [];

        queries.push('schema_s:' + SCHEMAS.NATIONAL_TARGET_7);
        queries.push('government_s:'+ government);

        const targetQuery = {
            query: andOr(queries, 'AND'),            
            rowsPerPage: 300,
            sort: 'title_EN_s asc',
            fields : 'identifier:identifier_s,title:title_EN_s'
        }

        const result = await queryIndex(parseSolrQuery(targetQuery, locale.value))
        
        nationalTargets.value = result.docs;
    }

    const onGoalsAndTargetSelected = async ()=>{
    

        //show Indicators for both Global Goals and Targets
        const selectedGoalsAndTargets = [document.value.primaryGlobalAlignment, ...(document.value.otherGlobalAlignments||[]) ].filter(e=>e);
        const headlineRes       = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)}));
        const componentRes      = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfComponentIndicator(e.identifier)}));
        const complementaryRes  = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfComplementaryIndicator(e.identifier)}));
        const binaryRes         = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfBinaryIndicator(e.identifier)}));

        const headlineIndicators      = sortBy(uniqBy(headlineRes?.     flat()||[], 'identifier'), 'title').map((e:ETerm)=>{return {...e, type:'headline'}});
        const componentIndicators     = sortBy(uniqBy(componentRes?.    flat()||[], 'identifier'), 'title').map((e:ETerm)=>{return {...e, type:'component'}});
        const complementaryIndicators = sortBy(uniqBy(complementaryRes?.flat()||[], 'identifier'), 'title').map((e:ETerm)=>{return {...e, type:'complementary'}});
        const binaryIndicators        = sortBy(uniqBy(binaryRes?.       flat()||[], 'identifier'), 'title').map((e:ETerm)=>{return {...e, type:'binary'}});
        
        indicators.value = [
            ...headlineIndicators, 
            ...binaryIndicators,           
            ...componentIndicators,    
            ...complementaryIndicators,
        ]
    }

    function extractContactDetails(commitment: EStakeholderCommitment):EStakeHolderContact {
                
        const contactDetails = {
            firstName             : commitment.firstName,
            lastName              : commitment.lastName,
            designation           : commitment.designation,
            department            : commitment.department,
            organization          : commitment.organization,
            organizationAcronym   : commitment.organizationAcronym,
            organizationType      : commitment.organizationType,
            address               : commitment.address,
            city                  : commitment.city,
            state                 : commitment.state,
            postalCode            : commitment.postalCode,
            country               : commitment.country,
            phones                : commitment.phones,
            emails                : commitment.emails,
            websites              : commitment.websites,
            jurisdiction          : commitment.jurisdiction,
            jurisdictionCountries : commitment.jurisdictionCountries,
            jurisdictionRegions   : commitment.jurisdictionRegions,
        };

        const clean = useKmStorage().cleanDocument(contactDetails);        
        return clean
    }

    async function init() {
        isBusy.value = true;
        try {
            await Promise.all([
                thesaurusStore.loadDomainTerms(THESAURUS.JURISDICTIONS),
                thesaurusStore.loadDomainTerms(THESAURUS.REGIONS),
                thesaurusStore.loadDomainTerms(THESAURUS.COUNTRIES),
                GbfGoalsAndTargets.loadGbfGoalsAndTargets(),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_HEADLINE_INDICATORS),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPONENT_INDICATORS),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPLEMENTARY_INDICATORS),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS),

            ]);

            if (refProps?.rawDocument?.value) {
                document.value = { ...refProps.rawDocument.value };
            }
            else if (refProps?.identifier?.value || route?.params?.identifier) {
                documentInfo.value = await EditFormUtility.load((refProps?.identifier?.value || route?.params?.identifier).toString(), SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT);
                document.value = documentInfo.value?.body;
            }
            else{
                document.value = emptyDocument();
                myIntents.value = await KmDocumentsService.loadSchemaDocuments (SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL, undefined,  {rowsPerPage:1});
                if(myIntents.value?.length){
                    document.value = {
                        ...document.value,
                        ...extractContactDetails(myIntents.value[0].body as EStakeholderCommitment)
                    }
                }
            }
            if (document.value?.coverageCountries?.length == 1) {
                loadNationalTargets(document.value.coverageCountries[0].identifier);
            }
        }
        catch (e: any) {
            useLogger().error(e, 'Error loading document for edit');
        }

        isBusy.value = false;
    }

    onMounted(() => {
        init();
    })


    provide('kmWorkflowFunctions', {
        onPostSaveDraft,
        onPostReviewDocument,
        onPostClose,
        onGetDocumentInfo
    });

    provide("validationReview", {
        hasError: (name: string) =>(validationReport.value as any)?.errors?.find((e: any) => e.property == name || e.properties?.includes(name))
    });
</script>