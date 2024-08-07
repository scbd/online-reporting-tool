<template>
    <div>
        <div class="search">
            <search-filters @on-filter-change="onFilterChange" :schema-types="recordTypes">
                <template #action-buttons>                    
                    <export :search-query="searchQuery" schema="nationalTarget7"></export>
                    <NuxtLink :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW" class="btn btn-secondary float-end">
                        <font-awesome-icon icon="fa-plus"></font-awesome-icon> {{ t('submitNew') }}
                    </NuxtLink>
                </template>
            </search-filters>
            <!-- <overlay-loading :active="loading" :can-cancel="false" background-color="rgb(9 9 9)"
                :is-full-page="false"> -->

                <div>
                    <pagination v-if="recordCount > 0" :recordCount="recordCount"  :recordsPerPage="recordsPerPage"
                    :currentPage="currentPage" @on-page-change="onPageChange" @on-records-per-page-changed="onRecordsPerPageChanged"  ></pagination>
                </div>

                <km-spinner v-if="loading" center></km-spinner>
                <search-result v-if="documents?.length" :documents="documents"></search-result>

            <!-- </overlay-loading> -->
        </div>
        <CAlert color="info" class="d-flex align-items-center mt-5" 
            v-if="!loading && !documents?.length">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
            <div class="p-2">
                 {{t('noRecords')}}
            </div>
        </CAlert>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/national-targets-list.json"></i18n>
<script setup lang="ts">
import SearchFilters from '@/components/controls/search/search-filters.vue'
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';
import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
import { compact } from 'lodash';

    const { t, locale } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const realmConf = realmConfStore.realmConf; 
    const documents = ref([]);
    const loading = ref(false);
    const recordsPerPage = ref(UTILS.ROWS_PER_PAGE_25);
    const currentPage = ref(1);
    const recordCount = ref(0);
    const filters     = ref({});
    const recordTypes = [SCHEMAS.NATIONAL_TARGET_7, SCHEMAS.NATIONAL_TARGET_7_MAPPING];
    const searchQuery = ref({});

    function onPageChange(page:Number){
        currentPage.value = page;
        loadRecords();
    }

    function onRecordsPerPageChanged(rows:number){
        recordsPerPage.value = rows;
        loadRecords();
    }

    function onFilterChange(newFilters:Object){
        currentPage.value = 1;
        filters.value = newFilters;
        loadRecords();
    }

    async function loadRecords(){
        loading.value = true;
        const queries:Array<String> = [];

        queries.push(buildArrayQuery('schema_s', filters.value.recordTypes?.length ? filters.value.recordTypes : recordTypes));

        queries.push(buildArrayQuery('headlineIndicators_ss', filters.value.headlineIndicators));
        queries.push(buildArrayQuery('componentIndicators_ss', filters.value.componentIndicators));    
        queries.push(buildArrayQuery('complementaryIndicators_ss', filters.value.complementaryIndicators));
        queries.push(buildArrayQuery('binaryIndicators_ss', filters.value.binaryIndicators)); 

        queries.push(buildArrayQuery('globalTargetAlignment_ss', filters.value.globalTargets));          
        queries.push(buildArrayQuery('globalGoalAlignment_ss', filters.value.globalGoals)); 

        queries.push(buildArrayQuery('government_s', filters.value.countries));              
        queries.push(buildArrayQuery('government_REL_ss', filters.value.regions));         
        
        searchQuery.value = {
            rowsPerPage: recordsPerPage.value,
            query: andOr(compact(queries), 'AND'),
            sort : "updatedDate_dt desc",
            start: (currentPage.value -1 ) * recordsPerPage.value,
            additionalFields :['globalTargetAlignment_ss','globalGoalOrTarget_s','globalGoalAlignment_ss']
        }
        const result = await queryIndex(parseSolrQuery(searchQuery.value, locale));

        loading.value = false;
        documents.value = result.docs;
        recordCount.value = result.numFound;

    }

    function buildArrayQuery(field:string, items:Array<String>){
        if(items?.length){
            return `${field} : (${items.map(escape).join(' ')})`;
        }
    }


</script>

<style scoped>

</style>