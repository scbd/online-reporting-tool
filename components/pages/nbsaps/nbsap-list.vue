<template>
    <record-type-search :record-types="[SCHEMAS.NATIONAL_NBSAP]" :show-record-type="false" :show-targets="false" :show-goals="false">
        <template #action-buttons>
            <km-link :to="analyzerUrl" 
                class="btn btn-secondary btn-sm ms-1">
                <font-awesome-icon icon="fa-chart-pie"></font-awesome-icon> {{ t('analyzer') }}
            </km-link>
        </template>
    </record-type-search>    
</template>
<i18n src="@/i18n/dist/components/pages/nbsaps/nbsap-list.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
    import { useRoute } from 'vue-router';
    import {stringifyQuery} from 'ufo'

    const {t} = useI18n();
    const route = useRoute();
    const { $appRoutes } = useNuxtApp();

    const analyzerUrl = computed(()=>{
        return `${$appRoutes.NATIONAL_REPORTS_NBSAP_ANALYZER}?${stringifyQuery(route.query||{})}`;
    });
</script>