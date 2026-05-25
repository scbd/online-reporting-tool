<template>
    <record-type-search :record-types="[SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT]" 
    :show-record-type="false" :show-targets="false" :show-goals="false" 
    country-search-field="countryReviews_ss" region-search-field="countryReviews_REL_ss">        
        <template #metadata="{document}">
            <slot name="metadata" :document="document">
                <small class="me-2 fs-6">{{formatDate(document.recCreationDate)}}</small>|
                <small class="me-2 fs-6">{{document.schema_EN_s}}</small>|
                <small class="me-2 fs-6" v-if="document.organization_t">{{document.organization_t}}</small>
                <small class="me-2 fs-6"  v-if="document.countryReviews_EN_txt">|
                    {{document.countryReviews_EN_txt.join(', ')}}
                </small>
                <small class="me-2 fs-6" v-if="document.primaryGlobalAlignment_s">|
                    {{document.primaryGlobalAlignment_s}}
                </small>
            </slot>
        </template>
    </record-type-search>    
</template>
<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/list-commitment.json"></i18n>

<script setup lang="ts">

    import { useRoute } from 'vue-router';
    import {stringifyQuery} from 'ufo'
    import { useThesaurusStore }    from '@/stores/thesaurus';

    const {t} = useI18n();
    const route = useRoute();
    const { $appRoutes } = useNuxtApp();
    const thesaurusStore = useThesaurusStore ();
    const customFilters  = ref({});
    
</script>