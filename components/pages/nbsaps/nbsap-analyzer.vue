<template>
    <div id="analyzer">
        <div class="search">
            <search-filters @on-filter-change="onFilterChange" :schema-types="recordTypes" 
                :show-record-type="false" :show-targets="false" :show-goals="false" v-show="!query.embed">
                <template #custom-filters>
                    <div class="col-md-4">
                        <km-form-group :caption="t('status')">
                            <km-select v-model="customFilters.reportStatus" :options="reportStatus" 
                                option-value="identifier" option-label="name.en" multiple @update:model-value="onCustomFilterChange"></km-select>
                        </km-form-group>
                    </div>
                </template>
            </search-filters>

            <km-spinner v-if="loading" center></km-spinner>

            <div v-if="!loading && Object.keys(facets)?.length">              

                <CCard class="mb-3" v-if="canShowGeneralCount">
                    <CCardHeader>
                        {{  t('generalCount') }}   
                    </CCardHeader>
                    <CCardBody>
                        <div class="row">
                            <div class="col-sm-6 mt-xs-1">
                                <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                    <template #text>{{ t('partiesWithNBSAP') }}
                                    </template>
                                    <template #value>{{ Object.keys(facets.government_s).length || 0
                                        }}</template>
                                </CWidgetStatsB>
                            </div>
                            <div class="col-sm-6 mt-xs-1">
                                <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                    <template #text>{{ t('totalNBSAP') }}</template>
                                    <template #value>{{ facets.schema_s.nbsap || 0 }}</template>
                                </CWidgetStatsB>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>

                <CCard class="mb-3" v-if="canShowMap && countryColors?.length">
                    <CCardHeader>
                        {{ t('map') }}
                    </CCardHeader>
                    <CCardBody>
                        <div class="row">
                            <div class="col-sm-12">
                                <un-map :country-colors="countryColors" :zoom="Number(query.zoom||0.8)"></un-map>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>

                <CCard class="mb-3" v-if="canShowByParties">
                    <CCardHeader>
                        {{ t('progressByCBDRegions') }}
                    </CCardHeader>
                    <CCardBody>
                        <div class="row">
                            <div class="col-sm-12">
                                <table class="table table-bordered table-striped1 table-hover">
                                    <thead>
                                        <tr>
                                            <th>{{ t('numberOfParties') }}</th>
                                            <th>{{ t('partyCount') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="region in cbdRegionalGroups" :key="region">
                                            <td>
                                                {{lstring(region.title)}}
                                            </td>
                                            <td>
                                                {{ facets.government_REL_ss[region.identifier] }}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{{ t('total') }}</td>
                                            <td>
                                                <strong>{{ cbdRegionalGroups?.reduce((prev, item)=>prev+(facets.government_REL_ss[item.identifier]||0), 0) }}</strong>
                                            </td>                                            
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </CCardBody>
                </CCard>

                <CCard v-if="canShowByParties">
                    <CCardHeader>
                       {{ t('progressByParties') }}
                        <!-- <export class="float-end" :search-query="exportSearchQuery" :schema="SCHEMAS.NATIONAL_TARGET_7">
                            <template #exportTitle> Export national targets</template>
                        </export> -->
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol :sm="12">

                                <table class="table table-bordered table-striped1 table-hover" >
                                    <thead>
                                        <tr>
                                            <th>{{ t('party') }}</th>
                                            <th>{{ t('status') }}</th>
                                            <th>{{ t('dateOfCompletion') }}</th>
                                            <th>{{ t('startDate') }}</th>
                                            <th>{{ t('endDate') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>                 
                                            <tr v-for="nbsap in nbsaps" :key="nbsaps">
                                                <td>
                                                    <km-link :to="`${$appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_VIEW.replace(':identifier', nbsap.identifier_s)}`">
                                                        {{nbsap.government}}
                                                    </km-link>
                                                </td>
                                                <td>{{ nbsap.statusOfTheDocument }}</td>
                                                <td>{{formatDate(nbsap.adoptionDate, 'DD MMM YYYY')}}</td>
                                                <td>{{formatDate(nbsap.startDate, 'DD MMM YYYY')}}</td>
                                                <td>{{formatDate(nbsap.endDate, 'DD MMM YYYY')}}</td>
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
<i18n src="@/i18n/dist/components/pages/nbsaps/nbsap-analyzer.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
import { useThesaurusStore }    from '@/stores/thesaurus';
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';
import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
import { compact } from 'lodash';
import { useCountriesStore }    from '@/stores/countries';
import { THESAURUS_TERMS } from '~/utils/constants';
import {useRoute, useRouter} from 'vue-router';


    const { t, locale } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const countriesStore  = useCountriesStore ();
    const thesaurusStore  = useThesaurusStore ();
    const { query, fullPath }       = useRoute();
    const router          = useRouter();
    const realmConf = realmConfStore.realmConf; 
    const facets = ref([]);
    const nbsaps = ref([]);
    const recordCount = ref(0);
    const loading = ref(false);
    const filters     = ref({});
    const customFilters     = ref({});
    const analyzedCounts = ref({});
    const exportSearchQuery = ref();
    const countryColors     = ref();
    const recordTypes = [SCHEMAS.NATIONAL_NBSAP];
        
    const canShowGeneralCount            = computed(()=>canShowSection('general-count'));
    const canShowMap                     = computed(()=>canShowSection('map'));
    const canShowByRegions               = computed(()=>canShowSection('regions'));
    const canShowByParties               = computed(()=>canShowSection('parties'));
    const cbdRegionalGroups              = computed(()=>[...thesaurusStore.getDomainTerms(THESAURUS.CBD_REGIONAL_GROUPS)])
    const reportStatus                   = computed(() => thesaurusStore.getDomainTerms(THESAURUS.REPORT_STATUS));
    const canShowSection = (section:string) : boolean =>{
        return !query.embed || (!!query.embed && (!query.share || query.share.includes(section)));
    }

    const canDisplayTarget          = (target : Object)=>{    
        const filterValues = [...filters.value.globalTargets, ...filters.value.globalGoals].flat();
        //  && query['single-target-only']
        if(filterValues.length){
            //different facets have diff name based on the query.
            const targetName = target?.name||target?.value||target?.target;
            return (filterValues.includes(targetName));
        }

        return true;
    }

    function onFilterChange(newFilters:Object){
        filters.value = newFilters;
        loadRecords();
    }

    function onCustomFilterChange(){
        router.push({
            path : fullPath,
            query : { 
                ...(query||{}),
                reportStatus:customFilters.reportStatus
            }
        });
        loadRecords();
    }
    
    async function loadRecords(){
        loading.value = true;
        const queries:Array<String> = [];

        queries.push(buildArrayQuery('schema_s', filters.value.recordTypes?.length ? filters.value.recordTypes : recordTypes));
        queries.push(buildArrayQuery('government_s', filters.value.countries));              
        queries.push(buildArrayQuery('government_REL_ss', filters.value.regions));       
        
        if(customFilters.value?.reportStatus?.length)    
            queries.push(buildArrayQuery('statusOfTheDocument_s', customFilters.value?.reportStatus));         
        
        const facetQuery = {
            query: andOr(compact([...queries]), 'AND'),
            "facet":true,
            facetFields: ["government_s", 'government_REL_ss', 'schema_s'],
            rowsPerPage: 0,
        }
        const nbsapQuery = {
            query: andOr(compact([...queries]), 'AND'),            
            rowsPerPage: 1000,
            sort: 'government_EN_s asc',
            fields : 'identifier_s,government:government_EN_s, startDate:startDate_dt, endDate:endDate_dt,adoptionDate:adoptionDate_dt,statusOfTheDocument:statusOfTheDocument_EN_s'
        }

        const [facetResult, nbsapResult] = await  Promise.all([
                queryIndex(parseSolrQuery(facetQuery, locale)),
                queryIndex(parseSolrQuery(nbsapQuery, locale))
            ]);
        
        loading.value = false;
        recordCount.value = facetResult.numFound;
        facets.value = facetResult.facets;
        nbsaps.value = nbsapResult.docs

        countryColors.value = Object.entries(facetResult.facets['government_s'])
                .map(([key])=>{
                    return {
                        code3 : findCountry(key)?.code3,
                        color : CBD_GREEN
                    }
                })
                .filter(e=>e);
        
        exportSearchQuery.value = {
            query: andOr(compact(queries), 'AND'),
            rowsPerPage: facetResult.facets?.schema_s?.nationalTarget7,
            sort : "updatedDate_dt desc",
        }
        
    }

    function buildArrayQuery(field:string, items:Array<String>){
        if(items?.length){
            return `${field} : (${items.map(escape).join(' ')})`;
        }
    }

    function findCountry(name:String){
        return countriesStore.countries.find(c=>c.name.en == name || c.code == name?.toUpperCase())
    }

    await Promise.all([
        thesaurusStore.loadDomainTerms(THESAURUS.CBD_REGIONAL_GROUPS, {relations:true}),
        countriesStore.loadCountries(),
        thesaurusStore.loadDomainTerms(THESAURUS.REPORT_STATUS)
    ]);

</script>

<style>
    /* #analyzer .search #filterByRecordType{
        display: none;
    } */
</style>