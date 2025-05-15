<template>
    <div>
        <record-type-search :recordTypes="recordTypes"></record-type-search>
    </div>
</template>
<script setup lang="ts">
//@ts-nocheck
import searchResult from '@/components/controls/search/search-result.vue';
import { useRealmConfStore } from '@/stores/realmConf';
import { SCHEMAS } from '@/utils';

    const { t } = useI18n();
    const realmConfStore  = useRealmConfStore();
    const realmConf = realmConfStore.realmConf; 
    const documents = ref([]);

    const recordTypes = [SCHEMAS.NATIONAL_REPORT_7, SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA, SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA];

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