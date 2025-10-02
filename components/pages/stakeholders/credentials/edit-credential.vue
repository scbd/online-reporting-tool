<template>
    <CCard>
        <CCardHeader>
            <slot name="header">{{ t('nsaCredentialTitle') }} </slot>
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
                                    <km-form-group name="isParty" :caption="t('isParty')" required>
                                        <km-form-check-item :inline="true" type="radio" name="isParty" id="isPartyTrue"
                                            :value="true" v-model="document.isParty" :label="t('yes')" />
                                        <km-form-check-item :inline="true" type="radio" name="isParty" id="isPartyFalse"
                                            :value="false" v-model="document.isParty" :label="t('no')" />
                                    </km-form-group>

                                    <km-form-group v-if="document.isParty === true" name="government" :caption="t('government')" required>
                                        <km-government v-model="document.government"></km-government>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        
                        <edit-contact-details v-model="contactDetails" 
                            :locales="document.header.languages"
                            @update:modelValue="onContactDetailsUpdate"></edit-contact-details>
                        
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{ t('authorityDocumentsSection') }}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="authorityDocuments" :caption="t('authorityDocuments')">
                                        <div class="alert alert-info">
                                            <font-awesome-icon icon="fa-info-circle" class="me-2"/>
                                            {{t('authorityDocumentsDescription')}}
                                            <p>
                                                <small id="emailHelp" class="form-text text-muted">{{t('authorityDocumentsHelp')}}</small>
                                            </p>
                                        </div>
                                        <km-add-link-file name="authorityDocuments" v-model="document.authorityDocuments" :allow-link="true" :allow-file="true" :identifier="document.header.identifier" />
                                    </km-form-group>

                                    <km-form-group name="authorizedEmails" :caption="t('authorizedEmails')" required>
                                        <small id="emailHelp" class="form-text text-muted">{{t('authorizedEmailsHelp')}}</small>
                                        <div class="alert alert-info">
                                            {{ t('signUpInformation') }} <a target="_blank" :href="accountsUrl">{{ accountsUrl }}</a>
                                        </div>
                                        <km-input-list v-model="document.authorizedEmails" :locales="document.header.languages" type="email"/>
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
                                            v-model="document.additionalInformation"
                                            :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        
                    </form>
                </template>
                <template v-slot:review>
                    <view-credential :identifier="document.header.identifier" :document="cleanDocument"></view-credential>
                </template>
                <template v-slot:publish></template>
                <template v-slot:submissionSuccessMessage>
                    {{ t('submitCredentialSuccessMessage') }}
                </template>
            </km-form-workflow>
            <km-spinner center :visible="isBusy" v-if="isBusy"></km-spinner>
            
        </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/components/pages/stakeholders/credentials/edit-credential.json"></i18n>

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
    const accountsUrl               = useRuntimeConfig().public.ACCOUNTS_HOST_URL;

    const contactDetails:ComputedRef<EStakeHolderContact>  = computed(()=>extractContactDetails(document.value));
    

    const cleanDocument = computed(() => {
        const clean = useKmStorage().cleanDocument({ ...document.value });

        if(clean.isParty === true)
            clean.government = undefined;
        clean.additionalDocuments = undefined;
        
        return clean
    })

    const onPostClose = async (document) => {
        await useNavigateAppTo(appRoutes.STAKEHOLDER_MY_CREDENTIALS);
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

        return EditFormUtility.buildEmptyDocument(SCHEMAS.REFERENCE_STAKEHOLDER_CREDENTIAL, {});
    }

    async function init() {
        isBusy.value = true;
        try {
            
            if (refProps.rawDocument.value) {
                document.value = { ...refProps.rawDocument.value };
            }
            else if (refProps.identifier.value || route?.params?.identifier) {
                documentInfo.value = await EditFormUtility.load(refProps.identifier.value || route.params.identifier);
                document.value = documentInfo.value.body;
            }
            else
                document.value = emptyDocument();

        }
        catch (e) {
            useLogger().error(e, 'Error loading document for edit');
        }

        isBusy.value = false;
    }

    function onContactDetailsUpdate(contactDetails:EContactBase){
        document.value = {
            ...document.value,
            ...extractContactDetails(contactDetails)
        }
    }
    
    function extractContactDetails(credential: EStakeholderCredential):EStakeHolderContact {
                
        return {
            firstName             : credential.firstName,
            lastName              : credential.lastName,
            designation           : credential.designation,
            department            : credential.department,
            organization          : credential.organization,
            organizationAcronym   : credential.organizationAcronym,
            organizationType      : credential.organizationType,
            address               : credential.address,
            city                  : credential.city,
            state                 : credential.state,
            postalCode            : credential.postalCode,
            country               : credential.country,
            phones                : credential.phones,
            emails                : credential.emails,
            websites              : credential.websites,
            jurisdiction          : credential.jurisdiction,
            jurisdictionCountries : credential.jurisdictionCountries,
            jurisdictionRegions   : credential.jurisdictionRegions,
        }
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