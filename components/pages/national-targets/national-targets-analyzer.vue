<template>
    <div>
        <div class="search">
            <search-filters @on-filter-change="onFilterChange" :schema-types="recordTypes"></search-filters>
            
                <km-spinner v-if="loading" center></km-spinner>

                <div v-if="!loading && Object.keys(facets)?.length">
                    <CCard class="mb-3">
                        <CCardHeader>
                            General count
                        </CCardHeader>
                        <CCardBody>   
                            <CRow>
                                <CCol :sm="3">
                                    <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                        <template #text>Total records</template>
                                        <template #value>
                                            <km-link to="/list">
                                                {{ recordCount }}
                                            </km-link>
                                        </template>
                                    </CWidgetStatsB>
                                </CCol>
                                <CCol :sm="3">
                                    <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                        <template #text>Number of Countries</template>
                                        <template #value>{{ Object.keys(facets.government_EN_s).length }}</template>
                                    </CWidgetStatsB>
                                </CCol>
                                <CCol :sm="3">
                                    <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                        <template #text>Total National Targets (Part I)</template>
                                        <template #value>{{ facets.schema_s.nationalTarget7 }}</template>
                                    </CWidgetStatsB>
                                </CCol>
                                <CCol :sm="3">
                                    <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                        <template #text>Total National Target Mappings (Part II)</template>
                                        <template #value>{{ facets.schema_s.nationalTarget7Mapping }}</template>
                                    </CWidgetStatsB>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>
                    
                    <CCard class="mb-3">
                        <CCardHeader>
                            National target count by GBF goals
                        </CCardHeader>
                        <CCardBody>   
                            <CRow>                    
                                <CCol :sm="2" v-for="(target, index) in facets['globalGoalAlignment_ss']" :key="country">
                                    <CWidgetStatsC class="mb-3" :value="target" :title="index.replace('GBF-', '')">                                        
                                        <template #title>{{index.replace('GBF-', '')}}</template>
                                    </CWidgetStatsC>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>  
                    <CCard class="mb-3">
                        <CCardHeader>
                           National target count by GBF targets
                        </CCardHeader>
                        <CCardBody>   
                            <CRow>             
                                <CCol :sm="2" v-for="(target, index) in facets['globalTargetAlignment_ss']" :key="country">
                    
                                    <CWidgetStatsC class="mb-3" :value="target" :title="index.replace('GBF-', '')">
                                        <template #icon>                                            
                                            <img :src="`https://www.cbd.int/gbf/images/targets/target-${index.replace('GBF-TARGET-', '')}.png`" height="36">
                                        </template>
                                        <template #title>{{index.replace('GBF-', '')}}</template>
                                    </CWidgetStatsC>
                                </CCol> 
                            </CRow>
                        </CCardBody>
                    </CCard>  

                    <CCard>
                        <CCardHeader>
                            Country Count
                        </CCardHeader>
                        <CCardBody>   
                            <CRow>             
                                <CCol :sm="2" v-for="(country, index) in facetPivot['government_EN_s,schema_s']" :key="country">
                    
                                    <CWidgetStatsD class="mb-4" :values="country.countrySchemaCount" v-if="index < 5 || showAllCountries">
                                        <template #icon>
                                            {{ country.value }}
                                        </template>
                                    </CWidgetStatsD>
                                </CCol> 
                            </CRow>
                        </CCardBody>
                        <CCardFooter>
                                       
                            <button class="btn btn-primary" @click="showAllCountriesFacets"
                                v-if="Object.keys(facetPivot['government_EN_s,schema_s'])?.length > 5">
                                Show all countries ({{ Object.keys(facetPivot['government_EN_s,schema_s'])?.length }})
                            </button>  
                        </CCardFooter>
                    </CCard>  
                </div>
        </div>
        <CAlert color="info" class="d-flex align-items-center mt-5" 
            v-if="!loading && !Object.keys(facets)?.length">            
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
            <div class="p-2">
                 {{t('noRecords')}}
            </div>
        </CAlert>
    </div>
</template>
<script setup lang="ts">
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';
import { andOr, queryIndex, escape } from '@/services/solr'
import { compact } from 'lodash';

    const { t, locale } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const realmConf = realmConfStore.realmConf; 
    const facets = ref([]);
    const facetPivot = ref([]);
    const recordCount = ref(0);
    const loading = ref(false);
    const filters     = ref({});
    const showAllCountries = ref(false);

    const recordTypes = [SCHEMAS.NATIONAL_TARGET_7, SCHEMAS.NATIONAL_TARGET_7_MAPPING];

    const countryFacets = computed(()=>facets.value?.schema_s)

    function onFilterChange(newFilters:Object){
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

        queries.push(buildArrayQuery('government_EN_s', filters.value.countries));              
        queries.push(buildArrayQuery('government_REL_ss', filters.value.regions));         
        
        const searchQuery = {
            rowsPerPage: 0,
            query: andOr(compact(queries), 'AND'),
            sort : "updatedDate_dt desc",
            start: 0,
            additionalFields :['globalTargetAlignment_ss','globalGoalOrTarget_s','globalGoalAlignment_ss'],
            facet : true,
            facetFields : ['schema_s', 'government_EN_s', 'government_REL_ss','all_terms_ss', 'globalTargetAlignment_ss','globalGoalOrTarget_s','globalGoalAlignment_ss'],
            pivotFacetFields: ['government_EN_s,schema_s'],// 'schema_s,government_EN_s,globalTargetAlignment_ss'
        }
        const result = await queryIndex(searchQuery, locale);

        loading.value = false;
        recordCount.value = result.numFound;
        facets.value = result.facets;
        facetPivot.value = result.facetPivot;

        facetPivot.value['government_EN_s,schema_s'].forEach(e=>{            
            
            e.countrySchemaCount = e.pivot.map(p=>{
                return {
                    title : p.value == SCHEMAS.NATIONAL_TARGET_7 ? 'Targets' : 'Mapping',
                    value : p.count
                }
            });
        })

        console.log(facets, facetPivot);
    }

    function buildArrayQuery(field:string, items:Array<String>){
        if(items?.length){
            return `${field} : (${items.map(escape).join(' ')})`;
        }
    }

    function showAllCountriesFacets(){
        showAllCountries.value = !showAllCountries.value
    }

    onMounted(()=>{
        // loadRecords();
    })

</script>

<style scoped>

</style>