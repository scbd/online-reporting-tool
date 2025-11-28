<template>
    <km-form-group>
        <div class="card">
            <div class="card-header bg-secondary">
                {{ t('contactDetailsSection') }}
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group name="firstName" :caption="t('firstName')" required>
                            <input type="text" class="form-control" v-model="document.firstName" @input="onUpdate" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group name="lastName" :caption="t('lastName')" required>
                            <input type="text" class="form-control" v-model="document.lastName" @input="onUpdate" />
                        </km-form-group>                                            
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <km-form-group name="designation" :caption="t('designation')"  required>
                            <km-input-lstring v-model="document.designation" :locales="locales"  @update:modelValue="onUpdate"/>
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group name="department" :caption="t('department')"  required>
                            <km-input-lstring v-model="document.department" :locales="locales" @update:modelValue="onUpdate" />
                        </km-form-group>
                    </div>
                </div>


                <km-form-group name="organization" :caption="t('organization')"  required>
                    <km-input-lstring v-model="document.organization" :locales="locales" @update:modelValue="onUpdate"/>
                </km-form-group>

                <div class="row">
                    <div class="col-md-6">
                        <km-form-group name="organizationAcronym" :caption="t('organizationAcronym')">
                            <km-input-lstring v-model="document.organizationAcronym" :locales="locales" @update:modelValue="onUpdate" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group name="organizationType" :caption="t('organizationType')"  required>
                            <km-select v-model="document.organizationType" :placeholder="t('organizationType')" 
                            :options="organizationTypes" class="validationClass" :custom-selected-item="customSelectedItem"
                            @update:modelValue="onUpdate"/>
                        </km-form-group>                                   
                        <km-form-group name="organizationType.customValue" :caption="t('otherOrganizationType')" required v-if="document.organizationType?.identifier == THESAURUS.OTHER">
                            <km-input-lstring v-model="document.organizationType.customValue" :locales="locales"  @update:modelValue="onUpdate"/>
                        </km-form-group>

                    </div>
                </div>

                <km-form-group name="address" :caption="t('address')" required>
                    <km-input-lstring v-model="document.address" :locales="locales" :rows="3" @update:modelValue="onUpdate" />
                </km-form-group>

                <div class="row">
                    <div class="col-md-6">
                        <km-form-group name="city" :caption="t('city')" required>
                            <km-input-lstring v-model="document.city" :locales="locales" @update:modelValue="onUpdate" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group name="state" :caption="t('state')" required>
                            <km-input-lstring v-model="document.state" :locales="locales" @update:modelValue="onUpdate" />
                        </km-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group name="postalCode" :caption="t('postalCode')" required>
                            <km-input-lstring v-model="document.postalCode" :locales="locales" @update:modelValue="onUpdate" />
                        </km-form-group>
                </div>
                    <div class="col-md-6">
                        <km-form-group name="country" :caption="t('country')" required>
                            <km-select v-model="document.country" :placeholder="t('country')" 
                            :options="countries" class="validationClass" :custom-selected-item="customSelectedItem"
                            @update:modelValue="onUpdate"/>
                        </km-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group name="phones" :caption="t('phones')">
                            <km-input-list v-model="document.phones" type="tel" @update:modelValue="onUpdate" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group name="emails" :caption="t('emails')" required>
                            <km-input-list v-model="document.emails" type="email" @update:modelValue="onUpdate" />
                        </km-form-group>
                    </div>
                </div>

                <km-form-group name="websites" :caption="t('websites')">
                    <km-add-link-file name="websites" v-model="document.websites" 
                    :allow-link="true" :allow-files="false" :identifier="identifier"
                    @update:modelValue="onUpdate" />
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
                <div class="alert alert-info">
                    {{ t('jurisdictionDetailsInfo') }}
                </div>
                <km-form-group name="jurisdiction" :caption="t('jurisdiction')" required>
                    <km-select v-model="document.jurisdiction" :placeholder="t('jurisdiction')" :options="jurisdictions" class="validationClass" :custom-selected-item="customSelectedItem" 
                    @update:modelValue="onUpdate"/>
                </km-form-group>

                <div class="row">
                    <div v-if="showJurisdictionCountries ||showJurisdictionRegions"
                        :class="{'col-md-5': showJurisdictionRegions, 'col-md-6': !showJurisdictionRegions}">
                        <km-form-group name="jurisdictionCountries" :caption="t('jurisdictionCountries')" required>
                            <km-select v-model="document.jurisdictionCountries" :placeholder="t('jurisdictionCountries')"
                             :options="countries" multiple class="validationClass" :custom-selected-item="customSelectedItem"
                              @update:modelValue="onUpdate" :max="maxJurisdictionCountries" :close-on-select="false"/>
                        </km-form-group>
                    </div>
                    <div class="col-md-6" v-if="showJurisdictionOthers">
                        <km-form-group name="jurisdiction.customValue" :caption="t('localSubNational')" required>
                            <km-input-lstring v-model="document.jurisdiction.customValue" :locales="locales"  @update:modelValue="onUpdate"/>
                        </km-form-group>
                    </div>
                    <div class="col-md-2 align-middle d-flex align-items-center justify-content-center" v-if="showJurisdictionRegions">
                        <div class="d-flex justify-content-center align-items-center"
                            style="height: 30px;">
                            <strong class="rounded-circle border border-dark p-2">{{ t('andOr') }}</strong>
                        </div>
                    </div>
                    <div class="col-md-5" v-if="showJurisdictionRegions">
                        <km-form-group name="jurisdictionRegions" :caption="t('jurisdictionRegions')" required>
                            <km-select v-model="document.jurisdictionRegions" :placeholder="t('jurisdictionRegions')" 
                            :options="regions" multiple class="validationClass"  :custom-selected-item="customSelectedItem"
                             @update:modelValue="onUpdate" :close-on-select="false"/>
                        </km-form-group>
                    </div>
                </div>
            </div>
        </div>
    </km-form-group>
</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/edit-contact-details.json"></i18n>

<script setup lang="ts">
//@ts-nocheck

    import { useThesaurusStore } from '@/stores/thesaurus';
    import type { EStakeHolderContact } from '~/types/schemas/EStakeholderCredential';

    const document = defineModel<EStakeHolderContact>({required: true});    
    const emit = defineEmits(['update:modelValue']);

    const props = defineProps({
        locales   : { type: Array<string>, required:true },
        identifier: { type: String, required: false }
    })

    const refProps                  = toRefs(props);
    const { t, locale }             = useI18n();
    const thesaurusStore            = useThesaurusStore();
    const showGlobalTargetsModal    = ref(false);
    const isBusy                    = ref(false);
    const validationReport          = ref({});

    const jurisdictions  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.GEOGRAPHICAL_SCOPE));
    const countries = computed(() => thesaurusStore.getDomainTerms(THESAURUS.COUNTRIES));
    const regions  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.REGIONS));
    const organizationTypes  = computed(() => thesaurusStore.getDomainTerms(THESAURUS.STAKEHOLDER_ORGANIZATION_TYPE));

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

    const maxJurisdictionCountries = computed(() => {
        if(!document.value?.jurisdiction)
            return 0;

        if([THESAURUS_TERMS.JURISDICTION_LOCAL,
            THESAURUS_TERMS.JURISDICTION_SUB_NATIONAL,
            THESAURUS_TERMS.JURISDICTION_NATIONAL
           ].includes(document.value?.jurisdiction.identifier)
        )
            return 1;

        return 300;
    }); 

    async function init() {
        isBusy.value = true;
        try {
            await Promise.all([
                thesaurusStore.loadDomainTerms(THESAURUS.GEOGRAPHICAL_SCOPE),
                thesaurusStore.loadDomainTerms(THESAURUS.REGIONS),
                thesaurusStore.loadDomainTerms(THESAURUS.COUNTRIES),
                thesaurusStore.loadDomainTerms(THESAURUS.STAKEHOLDER_ORGANIZATION_TYPE, {other: true})
                
            ]);
        }
        catch (e) {
            useLogger().error(e, 'Error loading document for edit');
        }

        isBusy.value = false;
    }

    function onUpdate(){
        const clean = useKmStorage().cleanDocument({ ...document.value });
        
        if(!showJurisdictionOthers.value && clean.jurisdiction?.customValue)
            clean.jurisdiction.customValue = undefined;
        if(!showJurisdictionRegions.value)
            clean.jurisdictionRegions = undefined;
        
        emit('update:modelValue', clean)
    }

    await init();
</script>