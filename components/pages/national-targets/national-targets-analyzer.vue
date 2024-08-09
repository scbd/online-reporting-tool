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
                        <div class="row">
                            <div class="col-sm-7">
                                <un-map :colors="['#3c4b64']"></un-map>
                            </div>
                            <div class="col-sm-5">

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
                                            <template #value>{{ Object.keys(facets.government_EN_s).length || 0
                                                }}</template>
                                        </CWidgetStatsB>
                                    </CCol>
                                    <CCol :sm="3">
                                        <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                            <template #text>Total National Targets (Part I)</template>
                                            <template #value>{{ facets.schema_s.nationalTarget7 || 0 }}</template>
                                        </CWidgetStatsB>
                                    </CCol>
                                    <CCol :sm="3">
                                        <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                            <template #text>Total National Target Mappings (Part II)</template>
                                            <template #value>{{ facets.schema_s.nationalTarget7Mapping || 0
                                                }}</template>
                                        </CWidgetStatsB>
                                    </CCol>
                                </CRow>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>

                <CCard class="mb-3">
                    <CCardHeader>
                        Progress in target setting
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol :sm="12">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="fs-4 fw-semibold">{{analyzedCounts.progressInTargets.oneTargetByParty}}</div>
                                        <div class="text-uppercase fw-semibold small text-medium-emphasis"> 
                                            Number of Parties that have set at least one national target 
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <table class="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Number of Parties by CBD regional groups</th>
                                                            <th>Country count</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="region in analyzedCounts.progressInTargets.oneTargetByCbdRegions" :key="region">
                                                            <td>
                                                                <div v-if="!region.showCountries">{{ lstring(region.title) }}</div>
                                                                <div  v-if="region.showCountries" :rowspan="analyzedCounts.progressInTargets.oneTargetByCbdRegions.length">
                                                                    <table class="table table-bordered">  
                                                                        <thead>
                                                                            <tr>
                                                                                <th>{{ lstring(region.title) }}</th>
                                                                                <th>Target count</th>
                                                                            </tr>
                                                                        </thead>                                                                      
                                                                        <tbody>
                                                                            <tr v-for="country in region.countries" :key="country">
                                                                                <td>
                                                                                    {{country}}
                                                                                </td>
                                                                                <td>
                                                                                    {{ facets.government_EN_s[country] }}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                            <td><strong>{{ region.countries.length }}</strong></td>
                                                            <td>                                                                
                                                                <button class="btn btn-sm btn-secondary float-end" @click="region.showCountries=!region.showCountries">
                                                                    Show countries
                                                                </button>
                                                            </td>
                                                           
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>                                
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
                                        <img :src="`https://www.cbd.int/gbf/images/targets/target-${index.replace('GBF-TARGET-', '')}.png`"
                                            height="36">
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
                            <CCol :sm="2" v-for="(country, index) in facetPivot['government_EN_s,schema_s']"
                                :key="country">

                                <CWidgetStatsD class="mb-4" :values="country.countrySchemaCount"
                                    v-if="index < 5 || showAllCountries">
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
        <CAlert color="info" class="d-flex align-items-center mt-5" v-if="!loading && !Object.keys(facets)?.length">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x" />
            <div class="p-2">
                {{t('noRecords')}}
            </div>
        </CAlert>
    </div>
</template>
<script setup lang="ts">
import { useThesaurusStore }    from '@/stores/thesaurus';
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';
import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
import { compact } from 'lodash';
import { useCountriesStore }    from '@/stores/countries';

    const { t, locale } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const countriesStore  = useCountriesStore ();
    const thesaurusStore  = useThesaurusStore ();
    const realmConf = realmConfStore.realmConf; 
    const facets = ref([]);
    const facetPivot = ref([]);
    const recordCount = ref(0);
    const loading = ref(false);
    const filters     = ref({});
    const showAllCountries = ref(false);
    const analyzedCounts = ref({});

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
            pivotFacetFields: ['government_EN_s,schema_s', 'schema_s,government_REL_ss'],// 'schema_s,government_EN_s,globalTargetAlignment_ss'
        }
        const result = await queryIndex(parseSolrQuery(searchQuery, locale));

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

        console.log(facetPivot, facets)
        const newCounts = {};
        newCounts.progressInTargets = buildProgressInTargetCounts(facets.value, facetPivot.value)
        analyzedCounts.value = newCounts;
        
    }

    function buildArrayQuery(field:string, items:Array<String>){
        if(items?.length){
            return `${field} : (${items.map(escape).join(' ')})`;
        }
    }

    function showAllCountriesFacets(){
        showAllCountries.value = !showAllCountries.value
    }

    function buildProgressInTargetCounts(facets, facetsPivot){
        
        const progressInTargets = {};
        const cbdGroups = [...thesaurusStore.getDomainTerms(THESAURUS.CBD_REGIONAL_GROUPS)];

        const schemaRegionCounts =  facetsPivot['schema_s,government_REL_ss'].find(e=>e.value == SCHEMAS.NATIONAL_TARGET_7);

        progressInTargets.oneTargetByParty = Object.keys(facets?.government_EN_s||{}).length;
        progressInTargets.oneTargetByCbdRegions = cbdGroups.map(e=>{

            const nationalTargets = schemaRegionCounts.pivot.find(r=>r.value == e.identifier)?.count;
            const countries       =   Object.keys(facets?.government_EN_s||{})
                                        .filter(c=>{
                                            const country = findCountryByName(c)
                                            return e.narrowerTerms.includes(country?.code?.toLowerCase())
                                        });

            return {...e, nationalTargets, countries };
        })
        console.log(progressInTargets)
        return progressInTargets;
    }

    function findCountryByName(name:String){
        return countriesStore.countries.find(c=>c.name.en == name)
    }

    onMounted(async()=>{;
        // loadRecords();
        provide(UNMapActionsKey, {
            onSetLayerColor : (color:String)=>{
                return facetPivot.value['government_EN_s,schema_s'].map(e=>{
                    return findCountryByName(e.value)?.code3
                }).filter(e=>e)
            }
        })
    })


    await Promise.all([
        thesaurusStore.loadDomainTerms(THESAURUS.CBD_REGIONAL_GROUPS, {relations:true}),
        countriesStore.loadCountries()
    ]);

</script>

<style scoped>

</style>