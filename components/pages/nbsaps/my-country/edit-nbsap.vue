<template>
    <CCard>
        <CCardHeader>
            <slot name="header">{{ t('nbsapTitle') }} </slot>
        </CCardHeader>
        <CCardBody>
            <km-form-workflow v-if="!isBusy && cleanDocument?.header" :focused-tab="props.workflowActiveTab"
                :document="cleanDocument" :container="container">
                <template v-slot:submission>
                    <form name="editForm">
                        <km-form-group>
                            <CAccordion :active-item-key="1" always-open>
                                <CAccordionItem :item-key="1">
                                    <CAccordionHeader>
                                        {{ t('governmentAndLanguages') }}
                                    </CAccordionHeader>
                                    <CAccordionBody>
                                        <km-form-group name="government" :caption="t('government')" required>
                                            <km-government v-model="document.government"></km-government>
                                        </km-form-group>

                                        <km-form-group name="languages" :caption="t('submissionLanguage')" required>
                                            <km-languages v-model="document.header.languages"></km-languages>
                                        </km-form-group>
                                    </CAccordionBody>
                                </CAccordionItem>
                            </CAccordion>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('general') }}
                                </div>
                                <div class="card-body">                                    
                                    <km-form-group name="isGbfAligned" :caption="t('isGbfAligned')" required>                                        
                                        <km-form-check-item :inline="true" type="radio" name="isGbfAligned"  for="isGbfAligned" id="isGbfAlignedTrue"       :value="true"        v-model="document.isGbfAligned" :label="t('yes')"/>
                                        <km-form-check-item :inline="true" type="radio" name="isGbfAligned"  for="isGbfAligned" id="isGbfAlignedFalse"      :value="false"       v-model="document.isGbfAligned" :label="t('no')"/>                                                             
                                    </km-form-group>

                                    <km-form-group name="title" :caption="t('title')" required
                                        :data-content="t('titleInfo')">
                                        <km-input-lstring id="title" :placeholder="t('title')" v-model="document.title"
                                            :locales="document.header.languages"></km-input-lstring>
                                    </km-form-group>

                                    <km-form-group name="summary" :caption="t('summary')">
                                        <km-input-rich-lstring :identifier="document.header.identifier"
                                            v-model="document.summary"
                                            :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('jurisdictionSectionTitle') }}
                                </div>
                                <div class="card-body">
                                    <km-form-group :caption="t('jurisdiction')" name="jurisdiction" required v-if="jurisdictions?.length">
                                        <km-select v-model="document.jurisdiction" :placeholder="t('jurisdiction')"
                                            :options="jurisdictions" class="validationClass"
                                            :custom-selected-item="customSelectedItem">
                                        </km-select>
                                    </km-form-group>
                                    <!-- <km-form-group name="jurisdictionInfo" :caption="t('jurisdictionInfo')">
                                        <km-input-rich-lstring :identifier="document.header.identifier"
                                            v-model="document.jurisdictionInfo"
                                            :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group> -->
                                </div>
                            </div>
                        </km-form-group>

                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('implementationPeriod') }}
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="startDate" :caption="t('startDate')" required>
                                                <date-selector class="form-control w-50" v-model="document.startDate"></date-selector>
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="endDate" :caption="t('endDate')" required>
                                                <date-selector class="form-control w-50" v-model="document.endDate"></date-selector>
                                            </km-form-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </km-form-group>

                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('status') }}
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <km-form-group name="status" :caption="t('statusOfTheDocument')" required>
                                                <km-select class="validationClass"
                                                    :custom-selected-item="customSelectedItem" v-model="document.status"
                                                    :placeholder="t('statusOfTheDocument')" :options="reportStatus">
                                                </km-select>
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6" v-if="hasAdoptionDate">
                                            <km-form-group name="adoptionDate" :caption="t('adoptionDate')"  required :data-content="t('adoptionYear')">                                                
                                                <date-selector class="form-control w-50"  name="adoptionDate" v-model="document.adoptionDate"></date-selector> 
                                            </km-form-group>
                                        </div>
                                    </div>

                                    <div class="row bottom-spacing" v-if="hasApprovedStatus">
                                        <div class="col-md-6">
                                            <km-form-group name="approvedStatus"
                                                :caption="t('statusOfApprovedDocument')" required>
                                                <km-select v-model="document.approvedStatus"
                                                    :placeholder="t('statusOfApprovedDocument')" :options="approvedStatus"
                                                    class="validationClass" :custom-selected-item="customSelectedItem">
                                                </km-select>
                                            </km-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <km-form-group name="approvingBody" :caption="t('approvingBody')" required>
                                                <km-select v-model="document.approvingBody"
                                                    :placeholder="t('approvingBodyInfo')" :options="approvingBody"
                                                    class="validationClass" :custom-selected-item="customSelectedItem">
                                                </km-select>
                                            </km-form-group>
                                        </div>
                                    </div>

                                    <div class="row bottom-spacing" v-if="hasApprovedStatusInfo">
                                        <div class="col-md-12">
                                            <km-form-group name="approvingBodyInfo" required
                                                :caption="t('approvingBodyInformation')">
                                                <km-input-rich-lstring :identifier="document.header.identifier"
                                                    v-model="document.approvingBodyInfo"
                                                    :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('mainRelevantDocuments') }}
                                </div>
                                <div class="card-body">
                                    <!-- <km-form-group name="documentText" :caption="t('relevantInformation')" >
                                        <km-input-rich-lstring :identifier="document.header.identifier"
                                            v-model="document.documentText"
                                            :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group> -->
                                    
                                    <km-form-group name="documentLinks" :caption="t('relevantLinks')" required>
                                        <km-add-link-file name="documentLinks" v-model="document.documentLinks" :allow-link="true" 
                                            :allow-file="true"  :identifier="document.header.identifier">
                                        </km-add-link-file>
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
                    <view-nbsap :identifier="document.header.identifier" :document="cleanDocument"></view-nbsap>
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
<i18n src="@/i18n/dist/components/pages/nbsaps/my-country/edit-nbsap.json"></i18n>

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
    const stateTargetWorkflow       = useStorage('scbd-ort-target-workflow', { batchId: undefined });
    const showGlobalTargetsModal    = ref(false);
    const document                  = ref();
    const isBusy                    = ref(false);
    const validationReport          = ref({});
    const documentInfo              = ref({});
    const isEventDefined            = useHasEvents();

    const jurisdictions  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.JURISDICTIONS).filter(e=>e.identifier == THESAURUS_TERMS.JURISDICTION_FEDERAL));
    const approvedStatus = computed(() => thesaurusStore.getDomainTerms(THESAURUS.APPROVED_STATUS));
    const approvingBody  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.APPROVING_BODY));
    const reportStatus   = computed(() => thesaurusStore.getDomainTerms(THESAURUS.REPORT_STATUS));

    const hasAdoptionDate = computed(() => {
        return document.value?.status?.identifier == THESAURUS_TERMS.STATUS_FINAL ||
            document.value?.status?.identifier == THESAURUS_TERMS.STATUS_APPROVED
    });

    const hasApprovedStatus = computed(() => {
        return !!document.value?.status && document.value?.status.identifier == THESAURUS_TERMS.STATUS_APPROVED;
    });

    const hasApprovedStatusInfo = computed(() => {
        return !!document.value?.approvingBody && (
            document.value?.approvingBody.identifier == THESAURUS_TERMS.APPROVING_BODY_INTER_MINISTERIAL_COMMITTEE ||
            document.value?.approvingBody.identifier == THESAURUS_TERMS.APPROVING_BODY_MINISTER ||
            document.value?.approvingBody.identifier == THESAURUS_TERMS.APPROVING_BODY_NATIONAL_COMMITTEE);
    });

    const cleanDocument = computed(() => {
        const clean = useKmStorage().cleanDocument({ ...document.value });
        clean.additionalDocuments = undefined;
        
        return clean
    })

    const onPostClose = async (document) => {

        if (isEventDefined('onClose'))
            emit('onClose', document);
        else {
            await useNavigateAppTo(appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_LIST);
        }
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

        return EditFormUtility.buildEmptyDocument(SCHEMAS.NATIONAL_NBSAP, {});
    }

    async function init() {
        isBusy.value = true;
        try {
            await Promise.all([
                thesaurusStore.loadDomainTerms(THESAURUS.JURISDICTIONS),
                thesaurusStore.loadDomainTerms(THESAURUS.APPROVED_STATUS),
                thesaurusStore.loadDomainTerms(THESAURUS.APPROVING_BODY),
                thesaurusStore.loadDomainTerms(THESAURUS.REPORT_STATUS),
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