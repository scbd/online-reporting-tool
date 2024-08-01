<template>
    <div>
        <search-result v-if="documents?.length" :documents="documents"></search-result>
        <CAlert color="info" class="d-flex align-items-center" v-if="!documents?.length">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
            <div class="p-2">
                 {{t('noRecords')}}
            </div>
        </CAlert>
    </div>
</template>
<script setup lang="ts">
import searchResult from '@/components/controls/search/search-result.vue';
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';

    const { t } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const realmConf = realmConfStore.realmConf; 
    const documents = ref([]);

    const searchQuery = {
        rows:300,
        q : `_state_s: public AND schema_s : (${SCHEMAS.NATIONAL_REPORT_7} ${SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA} ${SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA}) AND realm_ss:${realmConf.realm}`,
        sort: "updatedDate_dt desc"
    }
    const result = await useAPIFetch('/api/v2013/index/select', {method:'POST', body : searchQuery})

    documents.value = result.response.docs;

</script>

<style scoped>

</style>