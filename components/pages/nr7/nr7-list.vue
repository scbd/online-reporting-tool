<template>
    <div>
        <record-type-search :recordTypes="recordTypes"
        :show-record-type="false" :show-targets="false" :show-goals="false">
        </record-type-search>
    </div>
</template>
<script setup lang="ts">
//@ts-nocheck
import searchResult from '@/components/controls/search/search-result.vue';
import { SCHEMAS } from '@/utils';

    const { t } = useI18n();
    
    const recordTypes = [SCHEMAS.NATIONAL_REPORT_7];//, SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA, SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA];


</script>

<style scoped>

</style>