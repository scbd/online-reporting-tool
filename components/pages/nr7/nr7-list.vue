<template>
    <div>
        <record-type-search :recordTypes="recordTypes"
        :show-record-type="false" :show-targets="false" :show-goals="false">
            <template #metadata="{document}">
                <slot name="metadata" :document="document">
                    <small class="me-2 fs-6">{{document.schema_EN_s}}</small>|
                    <small class="me-2 fs-6" v-if="document.government_EN_s">{{document.government_EN_s}} |</small>
                    <document-dates :published-on="document.recCreationDate" :updated-on="document.recDate"></document-dates>
                </slot>
            </template>
        </record-type-search>
    </div>
</template>
<script setup lang="ts">
//@ts-nocheck
import searchResult from '@/components/controls/search/search-result.vue';
import { SCHEMAS } from '@/utils';

    const recordTypes = [SCHEMAS.NATIONAL_REPORT_7];//, SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA, SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA];


</script>

<style scoped>

</style>