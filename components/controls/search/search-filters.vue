<template>
    <div>
        <CCollapse visible="true" class="mb-2">
            <CCard body-wrapper>
                <div id="filters" class="row p-2">
                    <div class="col-md-4" v-if="schemaTypeLists?.length" id="filterByRecordType">
                        <km-form-group :caption="t('filterByRecordType')">
                            <km-select v-if="countries" v-model="selectedRecordTypes" label="title"
                                track-by="identifier" value-key="identifier" :options="schemaTypeLists"
                                :close-on-select="false" :custom-label="customShortLabel($event, locale)"
                                :custom-selected-item="customSelectedItem" multiple="true" @update:modelValue="onFilterChange">
                            </km-select>
                        </km-form-group>
                    </div>
                    <div class="col-md-4" id="filterByGlobalTargets">
                        <km-form-group :caption="t('filterByGlobalTargets')">
                            <gbf-targets v-model="selectedGlobalTargets" :multiple="true" @update:modelValue="onFilterChange"></gbf-targets>
                        </km-form-group>
                    </div>
                    <div class="col-md-4" id="filterByGlobalGoals">
                        <km-form-group :caption="t('filterByGlobalGoals')">
                            <gbf-goals v-model="selectedGlobalGoals" :multiple="true" @update:modelValue="onFilterChange"></gbf-goals>
                        </km-form-group>
                    </div>

                    <div class="col-md-4" id="filterByCountries">
                        <km-form-group :caption="t('filterByCountries')">
                            <km-select v-if="countries" v-model="selectedCountries" label="title"
                                track-by="identifier" value-key="identifier" :options="countries"
                                :close-on-select="false" :custom-label="customShortLabel($event, locale)"
                                :custom-selected-item="customSelectedItem" multiple="true" @update:modelValue="onFilterChange">
                            </km-select>
                        </km-form-group>
                    </div>
                    <div class="col-md-4" id="filterByRegions">
                        <km-form-group :caption="t('filterByRegions')">
                            <km-select v-if="regions" v-model="selectedRegions" label="title" track-by="identifier"
                                value-key="identifier" :options="regions" :close-on-select="false"
                                :custom-label="customShortLabel($event, locale)"
                                :custom-selected-item="customSelectedItem" multiple="true" @update:modelValue="onFilterChange">
                            </km-select>
                        </km-form-group>
                    </div>
                    <div class="col-md-12 m-1">
                        <button class="btn btn-danger btn-sm" @click="clearFilters">{{ t('clearFilter') }}</button>
                        <slot name="action-buttons"></slot>
                    </div>
                </div>
            </CCard>
        </CCollapse>
        <!-- <CButton @click="showFilters = !showFilters" color="secondary" class="mb-1 float-start">
            <font-awesome-icon icon="fa-filter"></font-awesome-icon>
            {{ !showFilters ? t('showFilter') : t('hideFilter') }}
        </CButton> -->

    </div>
</template>
<i18n src="@/i18n/dist/components/controls/search/search-filters.json"></i18n>
<script setup lang="ts">

import { useThesaurusStore } from '@/stores/thesaurus';
import { useRealmConfStore } from '@/stores/realmConf';
import { useRoute, useRouter } from 'vue-router';


const emit = defineEmits(['onFilterChange'])
const props = defineProps({
    schemaTypes : {type:Array<String>, default:undefined}
})

const router = useRouter()
const route = useRoute()
const { t, locale }  = useI18n();
const thesaurusStore = useThesaurusStore();
const realmConfStore = useRealmConfStore();
const realmConf      = realmConfStore.realmConf;

const showFilters             = ref(false);
const headlineIndicators      = ref([]);
const componentIndicators     = ref([]);
const complementaryIndicators = ref([]);
const binaryIndicators        = ref([]);
const selectedGlobalTargets   = ref([]);
const selectedGlobalGoals     = ref([]);
const selectedCountries       = ref([]);
const selectedRegions         = ref([]);
const selectedRecordTypes      = ref([]);

const countries       = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.COUNTRIES) || []).sort((a, b) => a.name.localeCompare(b.name)));
const regions         = computed(() => ((thesaurusStore.getDomainTerms(THESAURUS.REGIONS) || []).sort((a, b) => a.name.localeCompare(b.name))));
const schemaTypeLists = computed(()=>{
    return props.schemaTypes?.map((schema)=>{
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
const clearFilters = () => {
    selectedGlobalTargets.value = [];
    selectedGlobalGoals.value = [];
    headlineIndicators.value = [];
    componentIndicators.value = [];
    complementaryIndicators.value = [];
    binaryIndicators.value = [];
    selectedCountries.value = [];
    selectedRegions.value = [];
    selectedRecordTypes.value    = [];

    onFilterChange()
}

function onFilterChange(){
    const filters = {
        componentIndicators    : componentIndicators.value?.map(e=>e.identifier),
        complementaryIndicators: complementaryIndicators.value?.map(e=>e.identifier),
        binaryIndicators       : binaryIndicators.value?.map(e=>e.identifier),
        globalTargets          : selectedGlobalTargets.value?.map(e=>e.identifier),
        globalGoals            : selectedGlobalGoals.value?.map(e=>e.identifier),
        countries              : selectedCountries.value?.map(e=>e.identifier),
        regions                : selectedRegions.value?.map(e=>e.identifier),
        recordTypes            : selectedRecordTypes.value?.map(e=>e.identifier),
    }
    
    router.push({
        path : route.fullPath,
        query : { 
            componentIndicators    : filters.componentIndicators,
            complementaryIndicators: filters.complementaryIndicators,
            binaryIndicators       : filters.binaryIndicators,
            globalTargets          : filters.globalTargets,
            globalGoals            : filters.globalGoals,
            countries              : filters.countries,
            regions                : filters.regions,
            recordTypes            : filters.recordTypes,
        }
    });
    emit('onFilterChange', filters);
}

onMounted(() => {
    thesaurusStore.loadDomainTerms(THESAURUS.COUNTRIES)
    thesaurusStore.loadDomainTerms(THESAURUS.REGIONS);

    mapQueryString('componentIndicators', componentIndicators);
    mapQueryString('complementaryIndicators', complementaryIndicators);
    mapQueryString('binaryIndicators', binaryIndicators);
    mapQueryString('globalTargets', selectedGlobalTargets);
    mapQueryString('globalGoals', selectedGlobalGoals);
    mapQueryString('countries', selectedCountries);
    mapQueryString('regions', selectedRegions);
    mapQueryString('recordTypes', selectedRecordTypes);

    onFilterChange();
})

function mapQueryString(queryName:string, refVariable:object){

    let queryValue = route?.query[queryName];
    if(queryValue){
        if(typeof queryValue == 'string')
            queryValue = [queryValue];

        refVariable.value = queryValue.map(e=>({identifier:e}));

        showFilters.value = true
    }
}
</script>

<style scoped></style>