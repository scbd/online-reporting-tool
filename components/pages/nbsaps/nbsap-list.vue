<template>
    <record-type-search :record-types="[SCHEMAS.NATIONAL_NBSAP]" :show-record-type="false" :show-targets="false" :show-goals="false">
        <template #action-buttons>
            <!-- <km-link :to="analyzerUrl" 
                class="btn btn-secondary btn-sm ms-1">
                <font-awesome-icon icon="fa-chart-pie"></font-awesome-icon> {{ t('analyzer') }}
            </km-link> -->
        </template>
        <template #custom-filters="{ onCustomFilterChange }">
            <div class="col-md-4">
                <km-form-group :caption="t('status')">
                    <km-select v-model="customFilters.reportStatus" :options="reportStatus" 
                        option-value="identifier" option-label="name.en" multiple @update:model-value="onFilterChange(onCustomFilterChange)"></km-select>
                </km-form-group>
            </div>
        </template>
    </record-type-search>    
</template>
<i18n src="@/i18n/dist/components/pages/nbsaps/nbsap-list.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
    import { useRoute } from 'vue-router';
    import {stringifyQuery} from 'ufo'
    import { useThesaurusStore }    from '@/stores/thesaurus';

    const {t} = useI18n();
    const route = useRoute();
    const { $appRoutes } = useNuxtApp();
    const thesaurusStore = useThesaurusStore ();
    const customFilters  = ref({});

    const analyzerUrl = computed(()=>{
        return `${$appRoutes.NATIONAL_REPORTS_NBSAP_ANALYZER}?${stringifyQuery(route.query||{})}`;
    });
    const reportStatus = computed(() => thesaurusStore.getDomainTerms(THESAURUS.REPORT_STATUS));
    

    function onFilterChange(onCustomFilterChange){
        console.log('onFilterChange', customFilters.value);
        const customFiltersOptions = [
            { name:'documentStatus', field: 'statusOfTheDocument_s', value: customFilters.value?.reportStatus }
        ]
        onCustomFilterChange?.(customFiltersOptions);
    }

    await Promise.all([
        thesaurusStore.loadDomainTerms(THESAURUS.REPORT_STATUS)
    ]);
</script>