<template>
   <record-type-search :recordTypes="recordTypes">
        <template #action-buttons>
            <km-link :to="analyzerUrl" 
                class="btn btn-secondary btn-sm ms-1">
                <font-awesome-icon icon="fa-chart-pie"></font-awesome-icon> {{ t('analyzer') }}
            </km-link>

            <km-link :to="$appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW" 
                class="btn btn-secondary btn-sm float-end">
                <font-awesome-icon icon="fa-plus"></font-awesome-icon> {{ t('submitNew') }}
            </km-link>
        </template>
   </record-type-search>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/national-targets-list.json"></i18n>

<script lang="ts" setup>
    //@ts-nocheck

    import {stringifyQuery} from 'ufo'
    import { useRoute } from 'vue-router';

    const recordTypes = [SCHEMAS.NATIONAL_TARGET_7, SCHEMAS.NATIONAL_TARGET_7_MAPPING];
    const {t} = useI18n();
    const route = useRoute();
    const { $appRoutes } = useNuxtApp();

    const analyzerUrl = computed(()=>{
        return `${$appRoutes.NATIONAL_TARGETS_ANALYZER}?${stringifyQuery(route.query||{})}`;
    });

</script>

<style scoped>

</style>