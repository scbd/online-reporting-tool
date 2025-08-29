<template>
    <CCard>
        <CCardHeader>
            <slot name="header">{{ t('nsaIntentTitle') }} </slot>
        </CCardHeader>
        <CCardBody>
            <km-form-workflow v-if="!isBusy && cleanDocument?.header" :focused-tab="props.workflowActiveTab"
                :document="cleanDocument" :container="container">
                <template v-slot:submission>
                    <form name="editForm">
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('general') }}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="isNonStateActor" :caption="t('isNonStateActor')" required>
                                        <km-form-check-item :inline="true" type="radio" name="isNonStateActor" id="isNonStateActorTrue"
                                            :value="true" v-model="document.isNonStateActor" :label="t('nonStateActor')" />
                                        <km-form-check-item :inline="true" type="radio" name="isNonStateActor" id="isNonStateActorFalse"
                                            :value="false" v-model="document.isNonStateActor" :label="t('party')" />
                                    </km-form-group>

                                    <km-form-group v-if="document.isNonStateActor === false" name="government" :caption="t('government')" required>
                                        <km-government v-model="document.government"></km-government>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('contactDetailsSection') }}
                                </div>
                                <div class="card-body">
                                     <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="firstName" :caption="t('firstName')" required>
                                                <input type="text" class="form-control" v-model="document.firstName" />
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="lastName" :caption="t('lastName')" required>
                                                <input type="text" class="form-control" v-model="document.lastName" />
                                            </km-form-group>                                            
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="designation" :caption="t('designation')">
                                                <km-input-lstring v-model="document.designation" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="department" :caption="t('department')">
                                                <km-input-lstring v-model="document.department" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>
                                    </div>


                                    <km-form-group name="organization" :caption="t('organization')">
                                        <km-input-lstring v-model="document.organization" :locales="document.header.languages" />
                                    </km-form-group>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="organizationAcronym" :caption="t('organizationAcronym')">
                                                <km-input-lstring v-model="document.organizationAcronym" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="organizationType" :caption="t('organizationType')">
                                                <km-select v-model="document.organizationType" :placeholder="t('organizationType')" :options="organizationTypes" class="validationClass" />
                                            </km-form-group>
                                        </div>
                                    </div>

                                    <km-form-group name="address" :caption="t('address')">
                                        <km-input-lstring v-model="document.address" :locales="document.header.languages" />
                                    </km-form-group>

                                    <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="city" :caption="t('city')">
                                                <km-input-lstring v-model="document.city" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="state" :caption="t('state')">
                                                <km-input-lstring v-model="document.state" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="postalCode" :caption="t('postalCode')">
                                                <km-input-lstring v-model="document.postalCode" :locales="document.header.languages" />
                                            </km-form-group>
                                    </div>
                                        <div class="col-md-6">
                                            <km-form-group name="country" :caption="t('country')" required>
                                                <km-select v-model="document.country" :placeholder="t('country')" :options="countries" class="validationClass" />
                                            </km-form-group>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="phones" :caption="t('phones')">
                                                <km-input-lstring-ml v-model="document.phones" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="emails" :caption="t('emails')" required>
                                                <km-input-lstring-ml v-model="document.emails" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>
                                    </div>

                                    <km-form-group name="websites" :caption="t('websites')">
                                        <km-add-link-file name="websites" v-model="document.websites" :allow-link="true" :allow-files="false" :identifier="document.header.identifier" />
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    <!-- New Section: Jurisdiction Details -->
                                    {{ t('jurisdictionDetailsSection') }}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="jurisdiction" :caption="t('jurisdiction')" required>
                                        <km-select v-model="document.jurisdiction" :placeholder="t('jurisdiction')" :options="jurisdictions" class="validationClass" :custom-selected-item="customSelectedItem" />
                                    </km-form-group>

                                    <div class="row">
                                        <div class="col-md-6" v-if="showJurisdictionCountries">
                                            <km-form-group name="jurisdictionCountries" :caption="t('jurisdictionCountries')" >
                                                <km-select v-model="document.jurisdictionCountries" :placeholder="t('jurisdictionCountries')" :options="countries" multiple class="validationClass" />
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6" v-if="showJurisdictionOthers">
                                            <km-form-group name="subNational" :caption="t('localSubNational')">
                                                <km-input-lstring v-model="document.jurisdiction.customValue" :locales="document.header.languages" />
                                            </km-form-group>
                                        </div>

                                        <div class="col-md-6" v-if="showJurisdictionRegions">
                                            <km-form-group name="jurisdictionRegions" :caption="t('jurisdictionRegions')" >
                                                <km-select v-model="document.jurisdictionRegions" :placeholder="t('jurisdictionRegions')" :options="regions" multiple class="validationClass" />
                                            </km-form-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </km-form-group>

                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('authorityDocumentsSection') }}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="authorityDocuments" :caption="t('authorityDocuments')">
                                        <small id="emailHelp" class="form-text text-muted">{{t('authorityDocumentsHelp')}}</small>
                                        <km-add-link-file name="authorityDocuments" v-model="document.authorityDocuments" :allow-link="true" :allow-file="true" :identifier="document.header.identifier" />
                                    </km-form-group>

                                    <km-form-group name="authorizedEmails" :caption="t('authorizedEmails')" required>
                                        <km-input-lstring-ml v-model="document.authorizedEmails" :locales="document.header.languages" />
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('otherRelevantInformation') }}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="relevantInformation" :caption="t('otherRelevantInformationInfo')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"
                                            :identifier="document.header.identifier"
                                            v-model="document.relevantInformation"
                                            :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        
                    </form>
                </template>
                <template v-slot:review>
                    <view-nsaIntent :identifier="document.header.identifier" :document="cleanDocument"></view-nsaIntent>
                </template>
                <template v-slot:publish></template>
                <template v-slot:additionalSuccessMessage>
                    {{ t('submitNationalTargetsMessage') }}
                </template>
            </km-form-workflow>
            <km-spinner center :visible="isBusy" v-if="isBusy"></km-spinner>
            
        </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/components/pages/non-state-actors/intent/edit-intent.json"></i18n>

<script setup lang="ts">
//@ts-nocheck

    import { useThesaurusStore } from '@/stores/thesaurus';
    import { useRoute } from 'vue-router'
    import { useStorage } from '@vueuse/core'
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { cloneDeep } from 'lodash'

    const props = defineProps({
        identifier: { type: String },
        rawDocument: { type: Object },
        workflowActiveTab: { type: Number, default: 1 },
    })

    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit = defineEmits(['onClose', 'onPostSaveDraft'])

    const refProps                  = toRefs(props);
    const { $appRoutes: appRoutes } = useNuxtApp();
    const { user }                  = useAuth();
    const route                     = useRoute();
    const { t, locale }             = useI18n();
    const thesaurusStore            = useThesaurusStore();
    const container                 = useAttrs().container;
    const showGlobalTargetsModal    = ref(false);
    const document                  = ref();
    const isBusy                    = ref(false);
    const validationReport          = ref({});
    const documentInfo              = ref({});

    const jurisdictions  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.JURISDICTIONS));
    const countries = computed(() => thesaurusStore.getDomainTerms(THESAURUS.COUNTRIES));
    const regions  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.REGIONS));
    const organizationTypes  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.ORGANIZATION_TYPES));

    const showJurisdictionCountries = computed(() => {
        return !!document.value?.jurisdiction && (
            document.value?.jurisdiction.identifier == THESAURUS_TERMS.JURISDICTION_LOCAL ||
            document.value?.jurisdiction.identifier == THESAURUS_TERMS.JURISDICTION_SUB_NATIONAL ||
            document.value?.jurisdiction.identifier == THESAURUS_TERMS.JURISDICTION_NATIONAL);
    });

    const showJurisdictionOthers = computed(() => {
        return !!document.value?.jurisdiction && (
            document.value?.jurisdiction.identifier == THESAURUS_TERMS.JURISDICTION_LOCAL ||
            document.value?.jurisdiction.identifier == THESAURUS_TERMS.JURISDICTION_SUB_NATIONAL);
    });

    const showJurisdictionRegions = computed(() => {
        return !!document.value?.jurisdiction && (
            document.value?.jurisdiction.identifier == THESAURUS_TERMS.JURISDICTION_REGIONAL ||
            document.value?.jurisdiction.identifier == THESAURUS_TERMS.JURISDICTION_MULTINATIONAL);
    });

    const cleanDocument = computed(() => {
        const clean = useKmStorage().cleanDocument({ ...document.value });
        clean.additionalDocuments = undefined;
        
        return clean
    })

    const onPostClose = async (document) => {
        await useNavigateAppTo(appRoutes.NATIONAL_REPORTS_nsaIntent_MY_COUNTRY_LIST);
    }

    const onPostSaveDraft = async (document) => {
        emit('onPostSaveDraft', document);
        documentInfo.value = document
    }

    const onPostReviewDocument = async (document, newValidationReport) => {
        validationReport.value = cloneDeep(newValidationReport);
    }

    const onGetDocumentInfo = async ()=>{
        return documentInfo.value;
    }

    function onFileUpload({ file, locale }) {
        // useOnFileUpload({ document, file, locale });
    }

    function emptyDocument() {

        return EditFormUtility.buildEmptyDocument(SCHEMAS.REFERENCE_NON_STATE_ACTOR_COMMITMENT_INTENT, {});
    }

    async function init() {
        isBusy.value = true;
        try {
            await Promise.all([
                thesaurusStore.loadDomainTerms(THESAURUS.JURISDICTIONS),
                thesaurusStore.loadDomainTerms(THESAURUS.REGIONS),
                thesaurusStore.loadDomainTerms(THESAURUS.COUNTRIES),
                thesaurusStore.loadDomainTerms(THESAURUS.ORGANIZATION_TYPES)
                
            ]);

            if (refProps.rawDocument.value) {
                document.value = { ...refProps.rawDocument.value };
            }
            else if (refProps.identifier.value || route?.params?.identifier) {
                documentInfo.value = await EditFormUtility.load(refProps.identifier.value || route.params.identifier);
                document.value = documentInfo.value.body;
            }
            else
                document.value = emptyDocument();

            if (document.value.globalTargetAlignment?.length) {
                selectedGlobalTargets.value = document.value.globalTargetAlignment?.filter(e => e.identifier.startsWith('GBF-T'))?.map(e => { return { identifier: e.identifier } });
            }

            //initialize for local use
            document.value.government = document.value?.government || {};


            if (user?.value?.isAuthenticated) {
                document.value.government.identifier = document.value?.government?.identifier || user.value.government
            }
        }
        catch (e) {
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
        hasError: (name) => validationReport.value?.errors?.find(e => e.property == name)
    });
</script>
<style>
</style>