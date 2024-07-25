<template>
    <div>
        <km-spinner v-if="loading" center></km-spinner>
        <div class="search">
            <overlay-loading :active="loading" :can-cancel="false" background-color="rgb(9 9 9)"
                :is-full-page="false">

                <div>
                    <NuxtLink :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW" class="btn btn-secondary float-end">
                        <font-awesome-icon icon="fa-plus"></font-awesome-icon> {{ t('submitNew') }}
                    </NuxtLink>
                    <pagination v-if="recordCount > 0" :recordCount="recordCount"  :recordsPerPage="recordsPerPage"
                    :currentPage="currentPage" @on-page-change="onPageChange" @on-records-per-page-changed="onRecordsPerPageChanged"  ></pagination>
                </div>

                <search-result v-if="documents?.length" :documents="documents"></search-result>

            </overlay-loading>
        </div>

        <CAlert color="info" class="d-flex align-items-center" 
            v-if="!loading && !documents?.length">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
            <div class="p-2">
                 {{t('noRecords')}}
            </div>
        </CAlert>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/list.json"></i18n>
<script setup lang="ts">
import searchResult from '@/components/controls/search/search-result.vue';
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';

    const { t } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const realmConf = realmConfStore.realmConf; 
    const documents = ref([]);
    const loading = ref(false);
    const recordsPerPage = ref(UTILS.ROWS_PER_PAGE_25);
    const currentPage = ref(1);
    const recordCount = ref(0);

    function onPageChange(page:Number){
        currentPage.value = page;
        loadRecords();
    }

    function onRecordsPerPageChanged(rows:number){
        recordsPerPage.value = rows;
        loadRecords();
    }

    async function loadRecords(){
        loading.value = true;
        const searchQuery = {
            rows: recordsPerPage.value,
            q    : `_state_s: public AND schema_s : (${SCHEMAS.NATIONAL_TARGET_7} ${SCHEMAS.NATIONAL_TARGET_7_MAPPING}) AND realm_ss:${realmConf.realm}`,
            sort : "updatedDate_dt desc",
            start: (currentPage.value -1 ) * recordsPerPage.value
        }
        const result = await useAPIFetch('/api/v2013/index/select', {method:'POST', body : searchQuery})
        loading.value = false;
        documents.value = result.response.docs;
        recordCount.value = result.response.numFound;

    }

    onMounted(()=>{
        loadRecords();
    })

</script>

<style scoped>

</style>