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
                                        <div class="fs-4 fw-semibold">
                                            {{analyzedCounts.progressInTargets.oneTargetByParty}}</div>
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
                                                        <tr v-for="region in analyzedCounts.progressInTargets.oneTargetByCbdRegions"
                                                            :key="region">
                                                            <td>
                                                                <div v-if="!region.showCountries">{{
                                                                    lstring(region.title) }}</div>
                                                                <div v-if="region.showCountries"
                                                                    :rowspan="analyzedCounts.progressInTargets.oneTargetByCbdRegions.length">
                                                                    <table class="table table-bordered">
                                                                        <thead>
                                                                            <tr>
                                                                                <th>{{ lstring(region.title) }}</th>
                                                                                <th>Target count</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr v-for="country in region.countries"
                                                                                :key="country">
                                                                                <td>
                                                                                    {{country}}
                                                                                </td>
                                                                                <td>
                                                                                    {{ facets.government_EN_s[country]
                                                                                    }}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                            <td><strong>{{ region.countries.length }}</strong></td>
                                                            <td>
                                                                <button class="btn btn-sm btn-secondary float-end"
                                                                    @click="region.showCountries=!region.showCountries">
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
                        <CRow>
                            <CCol :sm="4">
                                <div class="card mb-4">
                                    <div class="card-header fw-semibold small text-medium-emphasis ">
                                        <span class="float-start1">Average number of national targets set by a Party</span>
                                        <span class="fs-4 fw-semibold position-relative d-flex justify-content-center align-items-center">
                                            {{ analyzedCounts.progressInTargets.avgByNationalTargets }} 
                                        </span>
                                    </div>
                                    <div class="card-body row text-center">
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByNationalTargetsMin}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">Min</div>
                                        </div>
                                        <div class="vr"></div>
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByNationalTargetsMax}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">Max</div>
                                        </div>
                                    </div>
                                </div>
                                
                            </CCol>

                            <CCol :sm="4">
                                <div class="card mb-4">
                                    <div class="card-header fw-semibold small text-medium-emphasis ">
                                        <span class="float-start1">Average number of GBF targets covered by a Party </span>
                                        <span class="fs-4 fw-semibold position-relative d-flex justify-content-center align-items-center">
                                            {{ analyzedCounts.progressInTargets.avgByGbfTargets }} 
                                        </span>
                                    </div>
                                    <div class="card-body row text-center">
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByGbfTargetsMin}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">Min</div>
                                        </div>
                                        <div class="vr"></div>
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByGbfTargetsMax}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">Max</div>
                                        </div>
                                    </div>
                                </div>
                                
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol :sm="6">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="fs-4 fw-semibold">
                                            {{analyzedCounts.progressInTargets.partiesWithAllGbfTargets.length}}</div>
                                        <div class="text-uppercase fw-semibold small text-medium-emphasis">
                                            Number of Parties that have set national targets for every GBF target 
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                        <div style="height: 300px;overflow: scroll;">
                                        <table class="table table-bordered" >
                                            <thead>
                                                <tr>
                                                    <th>Country</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr v-for="country in analyzedCounts.progressInTargets.partiesWithAllGbfTargets" :key="country">
                                                        <td>
                                                            {{ country }}
                                                        </td>
                                                    </tr>
                                            </tbody>
                                        </table></div>
                                    </div>
                                </div>
                            </CCol>
                            <CCol :sm="6">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="fs-4 fw-semibold">
                                            {{analyzedCounts.progressInTargets.partiesWith17AndMoreGbfTargets.length}}</div>
                                        <div class="text-uppercase fw-semibold small text-medium-emphasis">
                                            Number of Parties that have set national targets for more than 75% of the GBF targets  
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                        <div style="height: 300px;overflow: scroll;">
                                        <table class="table table-bordered" >
                                            <thead>
                                                <tr>
                                                    <th>Country</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr v-for="country in analyzedCounts.progressInTargets.partiesWith17AndMoreGbfTargets" :key="country">
                                                        <td>
                                                            {{ country }}
                                                        </td>
                                                    </tr>
                                            </tbody>
                                        </table></div>
                                    </div>
                                </div>
                            </CCol>
                            <CCol :sm="12">
                                <div class="card mb-3">
                                    <div class="card-header">
                                        For each GBF target, percent of countries that have a national target which has been mapped to it
                                    </div>
                                    <div class="card-body">
                                        <table class="table table-bordered" >
                                            <thead>
                                                <tr>
                                                    <th>Target</th>
                                                    <th>Percent</th>
                                                    <th>National target count</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr v-for="party in analyzedCounts.progressInTargets.gbfTargetsByParty" :key="party">
                                                        <td>
                                                            <img :src="`https://www.cbd.int/gbf/images/targets/target-${party.target.replace('GBF-TARGET-', '')}.png`" height="25">
                                                            {{ party.target }}
                                                        </td>
                                                        <td>
                                                            {{ party.percent }} %
                                                        </td>
                                                        <td>
                                                            {{ party.targetCount }}
                                                        </td>
                                                    </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CCol>
                            <!-- {{ analyzedCounts.progressInTargets.gbfTargetsByParty.reduce((i, e)=>i+e.percent,0) }} -->
                        </CRow>
                    </CCardBody>
                </CCard>

                <CCard>
                    <CCardHeader>
                        Country Count
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol :sm="12">

                                
                                <table class="table table-bordered" >
                                    <thead>
                                        <tr>
                                            <th>Country</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            <tr v-for="(country) in facetPivot['government_EN_s,schema_s']" :key="country">
                                                <td>
                                                    {{ country.value }}
                                                </td>
                                                <td>
                                                    {{country.countrySchemaCount[0].value}}
                                                </td>
                                            </tr>
                                    </tbody>
                                </table>
                            </CCol>
                        </CRow>
                    </CCardBody>
                   
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

    const recordTypes = [SCHEMAS.NATIONAL_TARGET_7];//, SCHEMAS.NATIONAL_TARGET_7_MAPPING];

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
            facetFields : [ 'schema_s', 'government_EN_s', 'government_REL_ss','all_terms_ss', 'globalTargetAlignment_ss',
                            'globalGoalOrTarget_s','globalGoalAlignment_ss'],
            pivotFacetFields: [ 'government_EN_s,schema_s', 'schema_s,government_REL_ss', 'government_EN_s,globalTargetAlignment_ss',
                                'globalTargetAlignment_ss,government_EN_s', 'globalGoalAlignment_ss,government_EN_s',
                                'government_EN_s,complementaryIndicators_EN_ss', 'government_EN_s,componentIndicators_EN_ss',
                                'degreeOfAlignment_EN_ss,government_EN_s',
                                'government_EN_s,hasNonStateActors_b', 'government_EN_s,hasOtherNationalIndicators_b'
            ],// 'schema_s,government_EN_s,globalTargetAlignment_ss'
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
        const targetsByParty     =  facetsPivot['government_EN_s,globalTargetAlignment_ss'];
        const gbfTargetsByParty  =  facetsPivot['globalTargetAlignment_ss,government_EN_s'];
        const gbfGoalsByParty    =  facetsPivot['globalGoalAlignment_ss,government_EN_s'];
        const numberOfCountries  =  Object.keys(facets.government_EN_s).length;

        //1.	Number of Parties that have set at least one national target [visualise by region (per “CBD” region]
        progressInTargets.oneTargetByParty = Object.keys(facets?.government_EN_s||{}).length;
        progressInTargets.oneTargetByCbdRegions = cbdGroups.map(e=>{

            const nationalTargets = schemaRegionCounts.pivot.find(r=>r.value == e.identifier)?.count;
            const countries       =   Object.keys(facets?.government_EN_s||{})
                                        .filter(c=>{
                                            const country = findCountryByName(c)
                                            return e.narrowerTerms.includes(country?.code?.toLowerCase())
                                        });

            return {...e, nationalTargets, countries };
        });

        //2.	Average number of national targets set by a Party (total targets / total number of parties = unweighted mean) and the range [min and max]
        progressInTargets.avgByNationalTargets = Math.floor((facets.schema_s[SCHEMAS.NATIONAL_TARGET_7] ||0) / progressInTargets.oneTargetByParty);
        progressInTargets.avgByNationalTargetsMin = Math.min(...Object.values(facets?.government_EN_s||{}));
        progressInTargets.avgByNationalTargetsMax = Math.max(...Object.values(facets?.government_EN_s||{}));

        //3.	Average number of GBF targets covered by a Party and the range [min and max number of GBF targets covered]
        const gbfCountryCounts   = (targetsByParty.map(e=>e.pivot.length))
        const gbfAllCountryCount = gbfCountryCounts.reduce((prevCount, country)=>country + prevCount, 0)
        progressInTargets.avgByGbfTargets   = Math.floor(gbfAllCountryCount / progressInTargets.oneTargetByParty);
        progressInTargets.avgByGbfTargetsMin = Math.min(...gbfCountryCounts);
        progressInTargets.avgByGbfTargetsMax = Math.max(...gbfCountryCounts);

        //4.	Number of Parties that have set national targets for every GBF target  
        progressInTargets.partiesWithAllGbfTargets   = targetsByParty.filter(e=>e.pivot.length==23).map(e=>e.value)
        //5.	Number of Parties that have set national targets for more than 75% of the GBF targets
        progressInTargets.partiesWith17AndMoreGbfTargets   = targetsByParty.filter(e=>e.pivot.length>16).map(e=>e.value)

        //6.	For each GBF target, percent of countries that have a national target which has been mapped to it. [divide by countries that have submitted and not all countries]
        const gbfTargetPercentByParty = gbfTargetsByParty.map(e=>({
            target:e.value, 
            percent : roundDecimal((e.pivot.length*100)/numberOfCountries),
            targetCount: e.count
        }));

        const gbfGoalPercentByParty = gbfGoalsByParty.map(e=>({
            target:e.value, 
            percent : roundDecimal((e.pivot.length*100)/numberOfCountries),
            targetCount: e.count
        }));

        progressInTargets.gbfTargetsByParty = [...gbfGoalPercentByParty, ...gbfTargetPercentByParty]




        console.log(progressInTargets)
        return progressInTargets;
    }

    function findCountryByName(name:String){
        return countriesStore.countries.find(c=>c.name.en == name)
    }

    const roundDecimal = (num) => Math.round(num * 100 + Number.EPSILON ) / 100;
    

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

<style>
    #filterByRecordType{
        display: none;
    }
</style>