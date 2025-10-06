<template>
    <record-type-search :record-types="[SCHEMAS.REFERENCE_STAKEHOLDER_COMMITMENT]" 
    :show-record-type="false" :show-targets="false" :show-goals="false">        
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