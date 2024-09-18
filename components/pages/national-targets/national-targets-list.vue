<template>
    <div>
        <div class="search">
            <search-filters @on-filter-change="onFilterChange" :schema-types="recordTypes" ref="searchFilterRef">
                <template #action-buttons>                    
                    <a rel="noopener" href="#" class="ms-1 btn btn-success btn-sm text-decoration-none" @click="onOpenExportDialog">
                        <font-awesome-icon icon="fa fa-download"></font-awesome-icon>
                        {{ t('exportButton') }}
                    </a>
                    <km-link :to="analyzerUrl" class="btn btn-secondary btn-sm ms-1">
                        <font-awesome-icon icon="chart-pie"></font-awesome-icon> {{ t('analyzer') }}
                    </km-link>
                    <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW" class="btn btn-secondary btn-sm float-end">
                        <font-awesome-icon icon="fa-plus"></font-awesome-icon> {{ t('submitNew') }}
                    </km-link>
                </template>
            </search-filters>
            <div style="height:0;width:0;overflow: hidden;">
                <export ref="exportDialogRef" :search-query="searchQuery" schema="nationalTarget7"></export>
            </div>
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

        <CModal  class="show d-block" alignment="center" backdrop="static" 
            @close="() => {isExportDialogRevealed=false}" :visible="isExportDialogRevealed" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{ t('exportFilterHeader') }}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <strong>{{ t('exportFilterRequired') }}</strong>
            </CModalBody>
            <CModalFooter>
                <CButton color="success" @click="continueExport">{{t('yes')}}</CButton>
                <CButton color="secondary" @click="isExportDialogRevealed=false">{{t('no')}}</CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/national-targets-list.json"></i18n>
<script setup lang="ts">
import SearchFilters from '@/components/controls/search/search-filters.vue'
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';
import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
import { compact } from 'lodash';
import { useRoute } from 'vue-router';
import {stringifyQuery} from 'ufo'

    const { t, locale } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const route = useRoute()
    const realmConf = realmConfStore.realmConf; 
    const documents = ref([]);
    const loading = ref(false);
    const recordsPerPage = ref(UTILS.ROWS_PER_PAGE_25);
    const currentPage = ref(1);
    const recordCount = ref(0);
    const filters     = ref({});
    const recordTypes = [SCHEMAS.NATIONAL_TARGET_7, SCHEMAS.NATIONAL_TARGET_7_MAPPING];
    const searchQuery = ref({});
    const exportDialogRef = ref();
    const searchFilterRef = ref();
    const isExportDialogRevealed = ref(false);

    const analyzerUrl = computed(()=>{
        return `${appRoutes.NATIONAL_TARGETS_ANALYZER}?${stringifyQuery(route.query||{})}`;
    });
    
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

    function onOpenExportDialog(){

        if(filters.value?.recordTypes?.length){
            if(filters.value?.recordTypes?.length == 1 && filters.value.recordTypes.includes(SCHEMAS.NATIONAL_TARGET_7)){
                exportDialogRef.value.openExportModal();
                return;
            }
        }

        isExportDialogRevealed.value = true;
    }

    async function continueExport(){
        searchFilterRef.value.setFilter('recordTypes', [SCHEMAS.NATIONAL_TARGET_7]);
        await sleep(200)
        exportDialogRef.value.openExportModal();
        isExportDialogRevealed.value = false;
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