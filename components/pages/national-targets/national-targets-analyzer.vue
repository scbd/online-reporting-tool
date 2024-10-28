<template>
    <div id="analyzer">
        <div class="search">
            <search-filters @on-filter-change="onFilterChange" :schema-types="recordTypes" v-show="!query.embed"></search-filters>

            <km-spinner v-if="loading" center></km-spinner>

            <div v-if="!loading && Object.keys(facets)?.length">              

                <CCard class="mb-3" v-if="canShowGeneralCount">
                    <CCardHeader>
                        {{ t('generalCount') }}
                    </CCardHeader>
                    <CCardBody>
                        <div class="row">
                            <div class="col-sm-12 col-lg-10">
                                <un-map :country-colors="countryColors" :zoom="Number(query.zoom||0.8)"></un-map>
                            </div>
                            <div class="col-sm-12 col-lg-2 mt-xs-1">

                                <CRow>
                                    <!-- <CCol :sm="4">
                                        <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                            <template #text>Total records</template>
                                            <template #value>
                                                <km-link to="/list">
                                                    {{ recordCount }}
                                                </km-link>
                                            </template>
                                        </CWidgetStatsB>
                                    </CCol> -->
                                    <CCol :sm="12">
                                        <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                            <template #text>
                                                {{ t('partiesWithAtLeast') }}
                                            </template>
                                            <template #value>{{ Object.keys(facets.government_s).length || 0
                                                }}</template>
                                        </CWidgetStatsB>
                                    </CCol>
                                    <CCol :sm="12">
                                        <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                            <template #text>
                                               {{ t('part1') }} 
                                            </template>
                                            <template #value>{{ facets.schema_s.nationalTarget7 || 0 }}</template>
                                        </CWidgetStatsB>
                                    </CCol>
                                    <!-- <CCol :sm="3">
                                        <CWidgetStatsB class="mb-3" :progress="{ color: 'success', value: 100}">
                                            <template #text>Total National Target Mappings (Part II)</template>
                                            <template #value>{{ facets.schema_s.nationalTarget7Mapping || 0
                                                }}</template>
                                        </CWidgetStatsB>
                                    </CCol> -->
                                </CRow>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>

                <CCard class="mb-3" v-if="canShowTargetProgressByRegions">
                    <CCardHeader>
                        {{ t('progressInTargetSetting') }}
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol :sm="12">
                                <div class="card mb-3">
                                    <div class="card-body">
                                        <div class="fs-4 fw-semibold">
                                            {{analyzedCounts.progressInTargets.oneTargetByParty}}</div>
                                        <div class="text-uppercase fw-semibold small text-medium-emphasis">
                                            {{ t('numberOfParties') }}
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                        <div class="row">
                                            <div class="col-sm-12">
                                                <table class="table table-bordered table-striped1 table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th> {{ t('numberOfPartiesByCBD') }}</th>
                                                            <th>{{ t('partyCount') }}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="region in analyzedCounts.progressInTargets.oneTargetByCbdRegions" :key="region">
                                                            <td>
                                                                <div v-if="!region.showCountries">{{lstring(region.title) }}</div>
                                                                <div v-if="region.showCountries"
                                                                    :rowspan="analyzedCounts.progressInTargets.oneTargetByCbdRegions.length">
                                                                    <table class="table table-bordered table-striped1 table-hover">
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
                                                                                    {{lstring(findCountry(country)?.name, locale)}}
                                                                                </td>
                                                                                <td>
                                                                                    {{ facets.government_s[country]}}
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
                                                                    {{ t('showParties') }}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>{{ t('total') }}</td>
                                                            <td>{{ analyzedCounts.progressInTargets.oneTargetByCbdRegions?.reduce((prev, item)=>prev+item.countries.length, 0) }}</td>
                                                            <td></td>
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

                <CCard class="mb-3" v-if="canShowTargetProgressByParties">
                    <CCardHeader>
                        {{ t('progressInTargetSettingByParties') }}
                    </CCardHeader>
                    <CCardBody>
                       <CRow>
                            <CCol :sm="6">
                                <div class="card mb-4">
                                    <div class="card-header fw-semibold small text-medium-emphasis ">
                                        <span class="float-start1">{{ t('averageNumber') }}</span>
                                        <span class="fs-4 fw-semibold position-relative d-flex justify-content-center align-items-center">
                                            {{ analyzedCounts.progressInTargets.avgByNationalTargets }} 
                                        </span>
                                    </div>
                                    <div class="card-body row text-center">
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByNationalTargetsMin}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">{{ t('min') }}</div>
                                        </div>
                                        <div class="vr"></div>
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByNationalTargetsMax}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">{{ t('max') }}</div>
                                        </div>
                                    </div>
                                </div>
                                
                            </CCol>

                            <CCol :sm="6">
                                <div class="card mb-4">
                                    <div class="card-header fw-semibold small text-medium-emphasis ">
                                        <span class="float-start1">{{ t('averageNumberOfGBF') }} </span>
                                        <span class="fs-4 fw-semibold position-relative d-flex justify-content-center align-items-center">
                                            {{ analyzedCounts.progressInTargets.avgByGbfTargets }} 
                                        </span>
                                    </div>
                                    <div class="card-body row text-center">
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByGbfTargetsMin}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">{{ t('min') }}</div>
                                        </div>
                                        <div class="vr"></div>
                                        <div class="col">
                                            <div class="col fs-5 fw-semibold">{{analyzedCounts.progressInTargets.avgByGbfTargetsMax}}</div>
                                            <div class="col text-uppercase text-medium-emphasis small">{{ t('max') }}</div>
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
                                            {{ t('numberOfPartiesNT') }}
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                        <div style="max-height:300px;overflow: scroll;" v-if="analyzedCounts.progressInTargets.partiesWithAllGbfTargets.length">
                                        <table class="table table-bordered table-striped1 table-hover" >
                                            <thead>
                                                <tr>
                                                    <th>{{ t('party') }}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr v-for="country in analyzedCounts.progressInTargets.partiesWithAllGbfTargets" :key="country">
                                                        <td>
                                                            {{lstring(findCountry(country)?.name, locale)}}
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
                                            {{ t('numberOfPartiesMoreTan') }}  
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                        <div style="max-height:300px;overflow: scroll;" v-if="analyzedCounts.progressInTargets.partiesWith17AndMoreGbfTargets.length">
                                        <table class="table table-bordered table-striped1 table-hover" >
                                            <thead>
                                                <tr>
                                                    <th>{{ t('party') }}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr v-for="country in analyzedCounts.progressInTargets.partiesWith17AndMoreGbfTargets" :key="country">
                                                        <td>
                                                            {{lstring(findCountry(country)?.name, locale)}}
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
                                        {{ t('forEachGBFTarget') }}
                                    </div>
                                    <div class="card-body">
                                        <table class="table table-bordered table-striped1 table-hover" >
                                            <thead>
                                                <tr>
                                                    <th>{{ t('target') }}</th>
                                                    <th>{{ t('percent') }}</th>
                                                    <th>{{ t('nationalTargetCount') }}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr v-for="party in analyzedCounts.progressInTargets.gbfTargetsByParty" :key="party">
                                                        <td>
                                                            <img v-if="~party.target.indexOf('GBF-TARGET-')" :src="`https://www.cbd.int/gbf/images/targets/target-${party.target.replace('GBF-TARGET-', '')}.png`" height="25">
                                                            <img v-if="~party.target.indexOf('GBF-GOAL-')" :src="`/cbd-gbf-logo.jpeg`" height="25" class="ps-3">
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

                <CCard class="mb-3" v-if="canShowMonitoringProgress">
                    <CCardHeader>
                        {{ t('progressInMonitoring') }}
                    </CCardHeader>
                    <CCardBody>
                        <table class="table table-bordered table-striped1 table-hover">
                            <thead>
                                <tr>
                                    <th>{{ t('numberOfPartiesIdentified') }}</th>
                                    <th>{{ t('partyCount') }}</th>
                                    <th>{{ t('targetCount') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{{ t('componentIndicators') }}</td>
                                    <td>{{ analyzedCounts.progressInMonitoring.componentIndicators.partyCount }}</td>
                                    <td>{{ analyzedCounts.progressInMonitoring.componentIndicators.targetCount }}</td>
                                </tr>
                                <tr>
                                    <td>{{ t('complementaryIndicators') }}</td>
                                    <td>{{ analyzedCounts.progressInMonitoring.complementaryIndicators.partyCount }}</td>
                                    <td>{{ analyzedCounts.progressInMonitoring.complementaryIndicators.targetCount }}</td>
                                </tr>
                                <tr>
                                    <td>{{ t('nationalIndicators') }}</td>
                                    <td>{{ analyzedCounts.progressInMonitoring.nationalIndicators.partyCount }}</td>
                                    <td>{{ analyzedCounts.progressInMonitoring.nationalIndicators.targetCount }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CCardBody>
                </CCard>
                

                <CCard class="mb-3" v-if="canShowRelevanceProgress">
                    <CCardHeader>
                        {{ t('progressInAmbition') }}
                    </CCardHeader>
                    <CCardBody>
                        <div class="alert alert-info">
                            {{ t('degreeOfAlignment') }}
                            {{ t('numberOfNationalTargets') }}
                        </div>
                        <!-- For each GBF target, how many parties have set at least one national target that has -->
                        <table class="table table-bordered table-striped1 table-hover">
                            <thead>
                                <tr>
                                    <th>{{ t('GBFTarget') }}</th>
                                    <th>{{ t('high') }}</th>
                                    <th>{{ t('medium') }}</th>
                                    <th>{{ t('Low') }}</th>
                                    <th>{{ t('notReported') }}</th>
                                    <th>{{ t('total') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr v-for="target in analyzedCounts.relevanceMonitoring" :key="target">
                                    <td>
                                        <img :src="`https://www.cbd.int/gbf/images/targets/target-${target.name.replace('GBF-TARGET-', '')}.png`" height="25">
                                        {{ target.name }}</td>
                                    <td>{{ target?.high?.length }}</td>
                                    <td>{{ target?.medium?.length }}</td>
                                    <td>{{ target?.low?.length }}</td>
                                    <td>{{ target?.none?.length }}</td>
                                    <td>{{ target?.high?.length + target?.medium?.length + target?.low?.length+ target?.none?.length }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </CCardBody>
                </CCard>

                <!-- Progress in Section C -->
                <CCard class="mb-3" v-if="canShowSectionCProgress">
                    <CCardHeader>
                        {{ t('progressInSectionC') }}
                    </CCardHeader>
                    <CCardBody>
                        <div class="row mb-2">
                            <div class="col-6">
                                <div class="card">
                                    <div class="card-body">
                                        <!-- 14. Average number of elements of Section C that Parties say have been considered in developing their NBSAP -->
                                        <div class="fs-4 fw-semibold">{{ analyzedCounts.sectionC.avgByParty || 0 }}</div>
                                        <div class="text-uppercase fw-semibold small text-medium-emphasis">
                                            {{ t('averageNumberOfElements')}}
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="card">
                                    <div class="card-body">
                                        <!-- 14. Average number of elements of Section C that Parties say have been considered in developing their NBSAP -->
                                        <div class="fs-4 fw-semibold">{{ analyzedCounts.sectionC.countries.length || 0 }}</div>
                                        <div class="text-uppercase fw-semibold small text-medium-emphasis">
                                            {{ t('numberOfPartiesHaveElements') }}
                                        </div>
                                        <div class="progress my-2" style="height: 4px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="max-height:300px;overflow: scroll;" class="mb-2 border border-secondary" v-if="analyzedCounts.sectionC.avgByParty">
                            <table class="table table-bordered table-striped1 table-hover" >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>{{ t('party') }}</th>
                                        <th>No. of elements included in Section C</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        <tr v-for="(country, index) in analyzedCounts.sectionC.countries" :key="country">
                                            <td>{{index+1}}</td>
                                            <td>
                                                {{lstring(findCountry(country.value)?.name, locale)}}
                                            </td>
                                            <td>{{ country?.pivot?.length }}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>Total</td>
                                            <td>{{ analyzedCounts.sectionC.countries?.reduce((prev, item)=>prev+item.pivot.length, 0) }}</td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                        <CCol :sm="12">
                                <div class="card mb-3">
                                    <div class="card-header">
                                        For each GBF target, elements of Section C that Parties say have been considered in developing their NBSAP
                                    </div>
                                    <div class="card-body">
                                        <table class="table table-bordered table-striped1 table-hover" >
                                            <thead>
                                                <tr>
                                                    <th>Target</th>
                                                    <th>Percent</th>
                                                    <th>National targets that include Section C</th>
                                                    <th>Total national targets</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    <tr v-for="party in analyzedCounts.sectionC.sectionCByGbfTargetPercent" :key="party">
                                                        <td>
                                                            <img v-if="~party.target.indexOf('GBF-TARGET-')" :src="`https://www.cbd.int/gbf/images/targets/target-${party.target.replace('GBF-TARGET-', '')}.png`" height="25">
                                                            <img v-if="~party.target.indexOf('GBF-GOAL-')" :src="`/cbd-gbf-logo.jpeg`" height="25" class="ps-3">
                                                            {{ party.target }}
                                                        </td>
                                                        <td>
                                                            {{ party.percent }} %
                                                        </td>
                                                        <td>
                                                            {{ party.targetCount }}
                                                        </td>
                                                        <td>{{ party.totalTargets }}</td>
                                                    </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </CCol>
                    </CCardBody>
                </CCard>

                <!-- Non-state actors -->
                <CCard class="mb-3" v-if="canShowNonStateProgress">
                    <CCardHeader>
                        Non-state actor
                    </CCardHeader>
                    <CCardBody>
                        <!-- 16. Number of parties with non-state actor commitments by target -->
                        <div class="fs-4 fw-semibold">{{ analyzedCounts.nonStateActors.partyCount || 0 }}</div>
                        <div class="text-uppercase fw-semibold small text-medium-emphasis">
                            Number of countries that have included non-state actor commitments in their target submission
                        </div>
                        <div class="progress my-2" style="height: 4px;"></div>

                        <!-- 16. Number of parties with non-state actor commitments by target -->                       
                        <table class="table table-bordered table-striped1 table-hover" v-if="analyzedCounts.nonStateActors.partyCount">
                            <thead>
                                <tr>
                                    <th colspan="3">
                                        <div class="text-uppercase fw-semibold small text-medium-emphasis">
                                            Number of parties with non-state actor commitments by target
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th>GBF target</th>
                                    <th colspan="2">Parties</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr v-for="target in analyzedCounts.nonStateActors.nonStateActorsByTargets" :key="target">
                                    <td>
                                        <img :src="`https://www.cbd.int/gbf/images/targets/target-${target.value.replace('GBF-TARGET-', '')}.png`" height="25">
                                        {{ target.value }}</td>
                                    <td>{{ target?.pivot?.length }}</td>
                                    <td>
                                        
                                        {{ target.pivot.map(e=>lstring(findCountry(e.value)?.name, locale)).join(', ') }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </CCardBody>
                </CCard>

                <!-- General party count by GBF Targets -->
                <CCard v-if="canShowPartyCounts">
                    <CCardHeader>
                        Party count
                        <export class="float-end" :search-query="exportSearchQuery" :schema="SCHEMAS.NATIONAL_TARGET_7">
                            <template #exportTitle> Export national targets</template>
                        </export>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol :sm="12">

                                <table class="table table-bordered table-striped1 table-hover" >
                                    <thead>
                                        <tr>
                                            <th rowspan="2">Party</th>
                                            <th rowspan="2">Number of national targets reported</th>
                                            <th :colspan="partyCountGoalColumnRange?.length"   v-if="partyCountGoalColumnRange?.length && partyCountTargetColumnRange?.length + partyCountGoalColumnRange?.length > 1">KMGBF Goal(s)</th>
                                            <th :colspan="partyCountTargetColumnRange?.length" v-if="partyCountTargetColumnRange?.length && partyCountTargetColumnRange?.length + partyCountGoalColumnRange?.length > 1">KMGBF Target(s)</th>
                                        </tr>
                                        <tr v-if="partyCountTargetColumnRange?.length + partyCountGoalColumnRange?.length > 1">                                            
                                            <th v-for="range in partyCountGoalColumnRange" :key="range">
                                                {{ range.title }}
                                            </th>
                                            <th v-for="range in partyCountTargetColumnRange" :key="range">
                                                {{ range.title }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>                                        
                                            <tr v-for="(country) in facetPivot['government_s,globalTargetAlignment_ss']" :key="country">
                                                <td>
                                                    <km-link :to="`${$appRoutes.NATIONAL_TARGETS}?countries=${country.value}`">
                                                        {{lstring(findCountry(country.value)?.name, locale)}}
                                                    </km-link>
                                                </td>
                                                <td>
                                                    {{country.count}}
                                                </td>
                                                <template  v-if="partyCountTargetColumnRange?.length + partyCountGoalColumnRange?.length > 1">
                                                    <td v-for="range in partyCountGoalColumnRange" :key="range">
                                                    {{ facetPivot['government_s,globalGoalAlignment_ss']?.find(e=>e.value == country.value)?.pivot?.find(e=>e.value == range.name)?.count || 0 }}
                                                    </td>
                                                    <td v-for="range in partyCountTargetColumnRange" :key="range">
                                                    {{ country.pivot?.find(e=>e.value == range.name)?.count || 0 }}
                                                    </td>
                                                </template>
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
<i18n src="@/i18n/dist/components/pages/national-targets/national-targets-analyzer.json"></i18n>
<script setup lang="ts">
import { useThesaurusStore }    from '@/stores/thesaurus';
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';
import { andOr, queryIndex, escape, parseSolrQuery } from '@/services/solr'
import { compact } from 'lodash';
import { useCountriesStore }    from '@/stores/countries';
import { THESAURUS_TERMS } from '~/utils/constants';
import {useRoute} from 'vue-router';


    const { t, locale } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const countriesStore  = useCountriesStore ();
    const thesaurusStore  = useThesaurusStore ();
    const { query }       = useRoute();
    const realmConf = realmConfStore.realmConf; 
    const facets = ref([]);
    const facetPivot = ref([]);
    const recordCount = ref(0);
    const loading = ref(false);
    const filters     = ref({});
    const showAllCountries = ref(false);
    const analyzedCounts = ref({});
    const exportSearchQuery = ref();
    const countryColors     = ref();
    const recordTypes = [SCHEMAS.NATIONAL_TARGET_7];//, SCHEMAS.NATIONAL_TARGET_7_MAPPING];
        
    const canShowGeneralCount            = computed(()=>canShowSection('general-count'));
    const canShowTargetProgressByRegions = computed(()=>canShowSection('target-progress-regions'));
    const canShowTargetProgressByParties = computed(()=>canShowSection('target-progress-parties'));
    const canShowMonitoringProgress      = computed(()=>canShowSection('monitoring-progress'));
    const canShowRelevanceProgress       = computed(()=>canShowSection('relevance-progress'));
    const canShowSectionCProgress        = computed(()=>canShowSection('section-c-progress'));
    const canShowNonStateProgress        = computed(()=>canShowSection('non-state-progress'));
    const canShowPartyCounts             = computed(()=>canShowSection('party-count'));

    const partyCountGoalColumnRange       = computed(()=>{
        const goals     = ['A', 'B', 'C', 'D' ].map(e=>({name:`GBF-GOAL-${e}`, title : e}));
        return goals.filter(canDisplayTarget)
    });
    const partyCountTargetColumnRange     = computed(()=>{
        const targets   = [...Array(23).keys()].map(e=>({name:`GBF-TARGET-${e+1 > 9 ? e+1 : '0'+(e+1)}`, title : e+1}));
        return targets.filter(canDisplayTarget)
    })

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
        
        const gbfTargetsSectionCQuery = {
            query: andOr(compact([...queries, 'implementingConsiderations_EN_ss:*']), 'AND'),
            "facet":true,
            facetFields: ["globalTargetAlignment_ss"],
            rowsPerPage: 0,
        }


        const sectionCGbfFacets = await  queryIndex(parseSolrQuery(gbfTargetsSectionCQuery, locale));
        
        const searchQuery = {
            rowsPerPage: 0,
            query: andOr(compact(queries), 'AND'),
            sort : "updatedDate_dt desc",
            start: 0,
            additionalFields :['globalTargetAlignment_ss','globalGoalOrTarget_s','globalGoalAlignment_ss'],
            facet : true,
            //'all_terms_ss', 'globalTargetAlignment_ss', 'globalGoalOrTarget_s','globalGoalAlignment_ss',
            facetFields : [ 'schema_s', 'government_s', 'government_REL_ss', 'implementingConsiderations_EN_ss'],
            pivotFacetFields: [ 'government_s,schema_s', 'schema_s,government_REL_ss', 
                                'government_s,globalTargetAlignment_ss',
                                'government_s,globalGoalAlignment_ss',
                                'globalTargetAlignment_ss,government_s', 'globalGoalAlignment_ss,government_s',
                                'government_s,complementaryIndicators_EN_ss', 'government_s,componentIndicators_EN_ss',
                                'degreeOfAlignment_EN_ss,government_s',
                                'government_s,hasNonStateActorCommitmentInfo_b', 
                                'government_s,hasOtherNationalIndicators_b',
                                'government_s,degreeOfAlignmentByTarget_ss',
                                'government_s,implementingConsiderations_EN_ss',
                                'globalTargetAlignment_ss,implementingConsiderations_EN_ss',
                                'hasNonStateActorCommitmentInfo_b,globalTargetAlignment_ss,government_s'
            ],// 'schema_s,government_s,globalTargetAlignment_ss'
        }
        const result = await queryIndex(parseSolrQuery(searchQuery, locale));

        loading.value = false;
        recordCount.value = result.numFound;
        facets.value = result.facets;
        facetPivot.value = result.facetPivot;

        facetPivot.value['government_s,schema_s'].forEach(e=>{            
            
            e.countrySchemaCount = e.pivot.map(p=>{
                return {
                    title : p.value == SCHEMAS.NATIONAL_TARGET_7 ? 'Targets' : 'Mapping',
                    value : p.count
                }
            });
        })

        countryColors.value = result.facetPivot['government_s,schema_s']
                .map(e=>{
                    return {
                        code3 : findCountry(e.value)?.code3,
                        color : CBD_GREEN
                    }
                })
                .filter(e=>e);
        
        exportSearchQuery.value = {
            query: andOr(compact(queries), 'AND'),
            rowsPerPage: result.facets?.schema_s?.nationalTarget7,
            sort : "updatedDate_dt desc",
            additionalFields :['globalTargetAlignment_ss','globalGoalOrTarget_s','globalGoalAlignment_ss']
        }

        const newCounts = {};
        newCounts.progressInTargets     = buildProgressInTargetCounts(facets.value, facetPivot.value);
        newCounts.progressInMonitoring  = buildProgressInMonitoringCounts(facets.value, facetPivot.value);
        newCounts.relevanceMonitoring   = buildRelevanceMonitoringCounts(facets.value, facetPivot.value);
        newCounts.sectionC              = buildSectionCCounts(facets.value, facetPivot.value, sectionCGbfFacets.facets['globalTargetAlignment_ss']);
        newCounts.nonStateActors        = buildNonStateActorsCounts(facets.value, facetPivot.value);
        
        result.facetPivot['government_s,globalTargetAlignment_ss'] = result.facetPivot['government_s,globalTargetAlignment_ss']
                .map(e=>{
                    e.name = lstring(findCountry(e.value)?.name, locale);  
                    return e
                })
                .sort((a,b)=>{
                    return a.name.localeCompare(b.name);
                })
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

        const schemaRegionCounts =  facetsPivot['schema_s,government_REL_ss']?.find(e=>e.value == SCHEMAS.NATIONAL_TARGET_7);
        const targetsByParty     =  facetsPivot['government_s,globalTargetAlignment_ss'];
        const gbfTargetsByParty  =  facetsPivot['globalTargetAlignment_ss,government_s'];
        const gbfGoalsByParty    =  facetsPivot['globalGoalAlignment_ss,government_s'];
        const numberOfCountries  =  Object.keys(facets.government_s||{}).length;

        //1.	Number of Parties that have set at least one national target [visualise by region (per “CBD” region]
        progressInTargets.oneTargetByParty = Object.keys(facets?.government_s||{}).length;
        progressInTargets.oneTargetByCbdRegions = cbdGroups.map(e=>{

            const nationalTargets = schemaRegionCounts?.pivot?.find(r=>r.value == e.identifier)?.count;
            const countries       =   Object.keys(facets?.government_s||{})
                                        .filter(c=>{
                                            const country = findCountry(c)
                                            return e.narrowerTerms.includes(country?.code?.toLowerCase())
                                        });

            return {...e, nationalTargets, countries };
        });

        //For debugging when country code do not have title
        // var count = progressInTargets.oneTargetByCbdRegions.map(e=>e.countries).flat()        
        // const mCountries       =   Object.keys(facets?.government_s||{})
        //                             .filter(c=>!count.includes(c));
        // console.log(mcountries)

        //2.	Average number of national targets set by a Party (total targets / total number of parties = unweighted mean) and the range [min and max]
        if(facets?.schema_s){
            progressInTargets.avgByNationalTargets = Math.ceil((facets?.schema_s[SCHEMAS.NATIONAL_TARGET_7] ||0) / progressInTargets.oneTargetByParty);
            progressInTargets.avgByNationalTargetsMin = Math.min(...Object.values(facets?.government_s||{}));
            progressInTargets.avgByNationalTargetsMax = Math.max(...Object.values(facets?.government_s||{}));
        }

        //3.	Average number of GBF targets covered by a Party and the range [min and max number of GBF targets covered]
        const gbfCountryCounts   = (targetsByParty.map(e=>e.pivot?.length))
        const gbfAllCountryCount = gbfCountryCounts.reduce((prevCount, country)=>country + prevCount, 0)
        progressInTargets.avgByGbfTargets   = Math.ceil(gbfAllCountryCount / progressInTargets.oneTargetByParty);
        progressInTargets.avgByGbfTargetsMin = Math.min(...gbfCountryCounts);
        progressInTargets.avgByGbfTargetsMax = Math.max(...gbfCountryCounts);

        //4.	Number of Parties that have set national targets for every GBF target  
        progressInTargets.partiesWithAllGbfTargets   = targetsByParty.filter(e=>e.pivot?.length==23).map(e=>e.value)
        //5.	Number of Parties that have set national targets for more than 75% of the GBF targets
        progressInTargets.partiesWith17AndMoreGbfTargets   = targetsByParty.filter(e=>e.pivot?.length>16).map(e=>e.value)

        //6.	For each GBF target, percent of parties that have a national target which has been mapped to it. [divide by parties that have submitted and not all parties]
        const gbfTargetPercentByParty = gbfTargetsByParty.map(e=>({
            target:e.value, 
            percent : roundDecimal((e.pivot?.length*100)/numberOfCountries),
            targetCount: e.count
        }));

        const gbfGoalPercentByParty = gbfGoalsByParty.map(e=>({
            target:e.value, 
            percent : roundDecimal((e.pivot.length*100)/numberOfCountries),
            targetCount: e.count
        }));

        progressInTargets.gbfTargetsByParty = [...gbfGoalPercentByParty, ...gbfTargetPercentByParty].filter(canDisplayTarget)
        
        return progressInTargets;
    }

    function buildProgressInMonitoringCounts(facets, facetsPivot){
        
        const hasComponentIndicatorsFacet      =  facetsPivot['government_s,componentIndicators_EN_ss'];
        const hasComplementaryIndicatorsFacet  =  facetsPivot['government_s,complementaryIndicators_EN_ss'];
        const hasOtherNationalIndicatorsFacet  =  facetsPivot['government_s,hasOtherNationalIndicators_b'];
        
        const progressInMonitoring = {};

        const hasComponentIndicators = hasComponentIndicatorsFacet.filter(e=>e.pivot?.length);
        progressInMonitoring.componentIndicators = {
            partyCount : hasComponentIndicators.length,
            targetCount: hasComponentIndicators.reduce((prev, item)=>prev + item.count, 0)
        }

        const hasComplementaryIndicators = hasComplementaryIndicatorsFacet.filter(e=>e.pivot?.length);
        progressInMonitoring.complementaryIndicators = {
            partyCount : hasComplementaryIndicators.length,
            targetCount: hasComplementaryIndicators.reduce((prev, item)=>prev + item.count, 0)
        }

        const hasOtherNationalIndicators = hasOtherNationalIndicatorsFacet.filter(e=>e.pivot.find(p=>p.value == true));
        progressInMonitoring.nationalIndicators = {
            partyCount : hasOtherNationalIndicators.length,
            targetCount: hasOtherNationalIndicators.reduce((prev, item)=>prev + item.count, 0)
        }

        return progressInMonitoring;
    }

    function buildRelevanceMonitoringCounts(facets, facetsPivot){
        const relevanceProgress = {};
        const relevanceByParty  =  facetsPivot['government_s,degreeOfAlignmentByTarget_ss'];
        const formatRegex = /(GBF-TARGET-[0-9]{2})\-([a-z0-9\-]+)/i;

        relevanceByParty.map(e=>{
            e.pivot.map(p=>{
                const country = e.value
                const match = p.value.match(formatRegex);
                if(match?.length==3){
                    const gbfTarget = match[1];
                    const degreeOfAlignment = match[2]
                    // console.log(match);
                    if(!relevanceProgress[gbfTarget])
                        relevanceProgress[gbfTarget] = { countries  : {}}

                    if(!relevanceProgress[gbfTarget].countries[country])
                        relevanceProgress[gbfTarget].countries[country] = degreeOfAlignment // degree of alignment High/medium/low
                    else{
                        //pick highest in order of High, medium, low, none
                        const currentDegreeOfAlignment = relevanceProgress[gbfTarget].countries[country];

                        if([degreeOfAlignment, currentDegreeOfAlignment].includes(THESAURUS_TERMS.HIGH))
                            relevanceProgress[gbfTarget].countries[country] = THESAURUS_TERMS.HIGH;

                        else if([degreeOfAlignment, currentDegreeOfAlignment].includes(THESAURUS_TERMS.MEDIUM))
                            relevanceProgress[gbfTarget].countries[country] = THESAURUS_TERMS.MEDIUM;

                        else if([degreeOfAlignment, currentDegreeOfAlignment].includes(THESAURUS_TERMS.LOW))
                            relevanceProgress[gbfTarget].countries[country] = THESAURUS_TERMS.LOW;

                        else if([degreeOfAlignment, currentDegreeOfAlignment].includes(THESAURUS_TERMS.NONE))
                            relevanceProgress[gbfTarget].countries[country] = THESAURUS_TERMS.NONE;
                    }
                }
            })
        })

        return Object.keys(relevanceProgress)
            .map(key=>{
                const target        = relevanceProgress[key];       
                const countries     = Object.keys(target.countries)
                    target.high   = countries.filter(country=>target.countries[country] == THESAURUS_TERMS.HIGH);
                    target.medium = countries.filter(country=>target.countries[country] == THESAURUS_TERMS.MEDIUM);
                    target.low    = countries.filter(country=>target.countries[country] == THESAURUS_TERMS.LOW);
                    target.none   = countries.filter(country=>target.countries[country] == THESAURUS_TERMS.NONE);
                    target.name   = key
                return target;
            })
            .filter(canDisplayTarget)
            .sort((a,b)=>a.name.localeCompare(b.name))

    }

    function buildSectionCCounts(facets, facetsPivot, sectionCGbfFacets){
        const sectionC = {};
        const sectionCConsiderations  =  facetsPivot['government_s,implementingConsiderations_EN_ss'].filter(e=>e.pivot);        
        const sectionCByTargets       =  facetsPivot['globalTargetAlignment_ss,implementingConsiderations_EN_ss']
                                                .filter(e=>e.pivot?.length);

        //14. Average number of elements of Section C that Parties say have been considered in developing their NBSAP
        const sectionCCount         = (sectionCConsiderations.map(e=>e.pivot?.length||0)).reduce((prevCount, country)=>country + prevCount, 0)
        
        if(sectionCCount > 0)
            sectionC.avgByParty  = Math.ceil(sectionCCount / sectionCConsiderations.length);
        sectionC.countries  = sectionCConsiderations;

        //no_of_targets_that_have_section_c_for_gbf_target/total_national_targets_for_gbf_target*100
        const numberOfCountries  =  Object.keys(facets.government_s||{}).length;
        sectionC.sectionCByGbfTargetPercent = sectionCByTargets.map(e=>{
            return ({
                target:e.value, 
                percent : roundDecimal((sectionCGbfFacets[e.value]*100)/e.count),
                targetCount: sectionCGbfFacets[e.value],
                totalTargets:e.count,
                rows:e.pivot
            })
        })
        .filter(canDisplayTarget);
        return sectionC;

    }
    function buildNonStateActorsCounts(facets, facetsPivot){
        const nonStateActors                = {};
        const hasNonStateActorFacets        =  facetsPivot['government_s,hasNonStateActorCommitmentInfo_b'];
        const nonStateActorByTargetsFacets  =  facetsPivot['hasNonStateActorCommitmentInfo_b,globalTargetAlignment_ss,government_s'];
        
        //15. Number of countries that have included non-state actor commitments in their target submission
        const hasNonStateActorCount = hasNonStateActorFacets.filter(e=>e.pivot?.length);
        nonStateActors.partyCount = hasNonStateActorCount.length;
        nonStateActors.targetCount= hasNonStateActorCount.reduce((prev, item)=>prev + item.count, 0);

        //16. Number of countries with non-state actor commitments by target
        nonStateActors.nonStateActorsByTargets  = nonStateActorByTargetsFacets.find(e=>e.value == true)?.pivot.filter(canDisplayTarget);

        return nonStateActors;
    }

    function findCountry(name:String){
        return countriesStore.countries.find(c=>c.name.en == name || c.code == name?.toUpperCase())
    }

    const roundDecimal = (num) => Math.round(num * 100 + Number.EPSILON ) / 100;
    


    await Promise.all([
        thesaurusStore.loadDomainTerms(THESAURUS.CBD_REGIONAL_GROUPS, {relations:true}),
        countriesStore.loadCountries()
    ]);

</script>

<style>
    /* #analyzer .search #filterByRecordType{
        display: none;
    } */
</style>