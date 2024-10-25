<template>
    <div>
        <div class="search">
            <search-filters @on-filter-change="onFilterChange" :schema-types="recordTypes" ref="searchFilterRef"
                :show-record-type="showRecordType"  :show-targets="showTargets" :show-goals="showGoals"
                :show-countries="showCountries" :show-regions="showRegions">
                <template #action-buttons>                    
                    <slot name="action-buttons"></slot>
                    <a rel="noopener" href="#" class="ms-1 btn btn-success btn-sm text-decoration-none" @click="onOpenExportDialog">
                        <font-awesome-icon icon="fa fa-download"></font-awesome-icon>
                        {{ t('exportButton') }}
                    </a>                   
                </template>
            </search-filters>
            <div style="height:0;width:0;overflow: hidden;">
                <export ref="exportDialogRef" :search-query="searchQuery" :schema="exportSelectedSchema?.identifier"></export>
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
            @close="closeExport" :visible="isExportDialogRevealed" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{ t('exportFilterHeader') }}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <strong>{{ t('exportFilterRequired') }}</strong>
                <km-form-group :caption="t('filterByRecordType')">
                    <km-select label="title"
                        track-by="identifier" v-model="exportSelectedSchema" value-key="identifier" :options="schemaTypeLists"
                        :close-on-select="true" :custom-label="customShortLabel($event, locale)"
                        :custom-selected-item="customSelectedItem">
                    </km-select>
                </km-form-group>
            </CModalBody>
            <CModalFooter>
                <CButton color="success" @click="continueExport">{{t('yes')}}</CButton>
                <CButton color="secondary" @click="closeExport">{{t('no')}}</CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/search/record-type-search.json"></i18n>
<script setup lang="ts">

    import { useRealmConfStore } from '@/stores/realmConf';
    import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
    import { compact } from 'lodash';

    const props = defineProps({
        recordTypes : {type:Array<String>, required:true},
        showRecordType   : { type:Boolean, default : true},
        showTargets      : { type:Boolean, default : true},
        showGoals        : { type:Boolean, default : true},
        showCountries    : { type:Boolean, default : true},
        showRegions      : { type:Boolean, default : true}
    })

    const { t, locale } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const realmConf = realmConfStore.realmConf; 
    const documents = ref([]);
    const loading = ref(false);
    const recordsPerPage = ref(UTILS.ROWS_PER_PAGE_25);
    const currentPage = ref(1);
    const recordCount = ref(0);
    const filters     = ref({});
    const searchQuery = ref({});
    const exportDialogRef = ref();
    const searchFilterRef = ref();
    const isExportDialogRevealed = ref(false);
    const exportSelectedSchema = ref({identifier:props.recordTypes[0]});

    const schemaTypeLists = computed(()=>{
        return props.recordTypes?.map((schema)=>{
            if(realmConf.schemas[schema]){
                return {
                    identifier : schema,
                    title : realmConf.schemas[schema].title
                }
            }

            return {
                identifier : schema,
                title : { en : schema }
            }
        })
    })

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

        if(props.recordTypes?.length == 1 || filters.value?.recordTypes?.length == 1){
            
            exportSelectedSchema.value = {identifier : filters.value?.recordTypes?.length ? filters.value?.recordTypes[0] : props.recordTypes[0] }
            
            exportDialogRef.value.openExportModal();
            return;
        }
        isExportDialogRevealed.value = true;
    }

    async function continueExport(){
        //TODO : add dropdown for selection
        searchFilterRef.value.setFilter('recordTypes', [exportSelectedSchema.value?.identifier]);
        await sleep(200)
        exportDialogRef.value.openExportModal();
        isExportDialogRevealed.value = false;
        // exportSelectedSchema.value = null;
    }

    function closeExport(){
        isExportDialogRevealed.value = false;
        exportSelectedSchema.value = null;
    }

    async function loadRecords(){
        loading.value = true;
        const queries:Array<String> = [];

        queries.push(buildArrayQuery('schema_s', filters.value.recordTypes?.length ? filters.value.recordTypes : props.recordTypes));

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