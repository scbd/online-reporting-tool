<template>
  
    <!-- Contact Details Section -->
    <km-form-group>
        <div class="card">
            <div class="card-header bg-secondary">{{ t('contactDetailsSection') }}</div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group :caption="t('firstName')" v-if="document.firstName">
                            <km-value :value="document.firstName" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group :caption="t('lastName')" v-if="document.lastName">
                            <km-value :value="document.lastName" :locale="locale" />
                        </km-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group :caption="t('designation')" v-if="document.designation">
                            <km-lstring-value :value="document.designation" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group :caption="t('department')" v-if="document.department">
                            <km-lstring-value :value="document.department" :locale="locale" />
                        </km-form-group>
                    </div>
                </div>
                <km-form-group :caption="t('organization')" v-if="document.organization">
                    <km-lstring-value :value="document.organization" :locale="locale" />
                </km-form-group>
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group :caption="t('organizationAcronym')" v-if="document.organizationAcronym">
                            <km-lstring-value :value="document.organizationAcronym" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group :caption="t('organizationType')" v-if="document.organizationType">
                            <km-value-term :value="document.organizationType" :locale="locale" />
                        </km-form-group>
                    </div>
                </div>
                <km-form-group :caption="t('address')" v-if="document.address">
                    <km-lstring-value :value="document.address" :locale="locale" />
                </km-form-group>
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group :caption="t('city')" v-if="document.city">
                            <km-lstring-value :value="document.city" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group :caption="t('state')" v-if="document.state">
                            <km-lstring-value :value="document.state" :locale="locale" />
                        </km-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group :caption="t('postalCode')" v-if="document.postalCode">
                            <km-lstring-value :value="document.postalCode" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group :caption="t('country')" v-if="document.country">
                            <km-value-term :value="document.country" :locale="locale" />
                        </km-form-group>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <km-form-group :caption="t('phones')" v-if="document.phones">
                            <km-value-list :value="document.phones" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6">
                        <km-form-group :caption="t('emails')" v-if="document.emails">
                            <km-value-list :value="document.emails" :locale="locale" />
                        </km-form-group>
                    </div>
                </div>
                <km-form-group :caption="t('websites')" v-if="document.websites">
                    <km-view-links :can-edit="false" :links="document.websites" />
                </km-form-group>
            </div>
        </div>
    </km-form-group>

    <!-- Jurisdiction Details Section -->
    <km-form-group>
        <div class="card">
            <div class="card-header bg-secondary">{{ t('jurisdictionDetailsSection') }}</div>
            <div class="card-body">
                <km-form-group :caption="t('jurisdiction')" v-if="document.jurisdiction">
                    <km-value-term :value="document.jurisdiction" :locale="locale" />
                </km-form-group>
                <div class="row">
                    <div class="col-md-6" v-if="document.jurisdictionCountries">
                        <km-form-group :caption="t('jurisdictionCountries')">
                            <km-value-terms :value="document.jurisdictionCountries" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6" v-if="document.jurisdiction?.customValue">
                        <km-form-group :caption="t('localSubNational')">
                            <km-lstring-value :value="document.jurisdiction.customValue" :locale="locale" />
                        </km-form-group>
                    </div>
                    <div class="col-md-6" v-if="document.jurisdictionRegions">
                        <km-form-group :caption="t('jurisdictionRegions')">
                            <km-value-terms :value="document.jurisdictionRegions" :locale="locale" />
                        </km-form-group>
                    </div>
                </div>
            </div>
        </div>
    </km-form-group>

</template>

<i18n src="@/i18n/dist/components/pages/stakeholders/edit-contact-details.json"></i18n>

<script setup lang="ts">

const { t } = useI18n();

const props = defineProps({
    document: { type: Object, required: true },
    locale: { type: String, required: true }
})

const { document, locale } = toRefs(props);

</script>