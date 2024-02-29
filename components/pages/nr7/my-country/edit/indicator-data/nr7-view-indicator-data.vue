<template>
    <CCard>
        <CCardBody v-if="indicatorData">
            <km-form-group v-if="indicatorData.sourceOfData">
                <label class="form-check-label">Source of Data</label>
                <km-value>{{ indicatorData.sourceOfData?.value }}</km-value>
            </km-form-group>
            
            <km-form-group1 v-if="indicatorData.data" style="display1:none; overflow: auto;width:20%;">
                <label class="form-check-label">Data</label>
                <CTable responsive bordered>
                    <CTableBody>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Year</CTableHeaderCell>
                            <CTableHeaderCell v-for="unit in indicatorData.data" :key="unit">{{ unit.year }}
                            </CTableHeaderCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell scope="row">Value</CTableHeaderCell>
                            <CTableHeaderCell v-for="unit in indicatorData.data" :key="unit">{{ unit.value }}
                            </CTableHeaderCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </km-form-group1>

            <km-form-group v-if="indicatorData.dataSources">
                <label class="form-check-label">Global source of data</label>
                <km-value v-for="source in indicatorData.dataSources" :key="source" class="mt-1">
                    <a :href="source.link" target="_blank">{{ source.title }}</a>
                </km-value>
            </km-form-group>
            <km-form-group v-if="indicatorData.indicatorProviders">
                <label class="form-check-label">Indicator providers</label>
                <km-value v-for="source in indicatorData.indicatorProviders" :key="source" class="mt-1">
                    <a :href="source.link" target="_blank">{{ source.title }}</a>
                </km-value>
            </km-form-group>
            <!-- <km-form-group v-if="indicatorData.description">
                <label class="form-check-label">Description</label>
                <km-value>{{ indicatorData.description }}</km-value>
            </km-form-group> -->
            <km-form-group v-if="indicatorData.comments" class="mt-1">
                <label class="form-check-label">Comments</label>
                <km-lstring-value type="html" :value="indicatorData.comments"
                    :locale="indicatorData.languages"></km-lstring-value>
            </km-form-group>
        </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
import { KmLstringValue, KmValue, KmFormGroup } from "~/components/controls";
const props = defineProps({
    indicatorData: { type: Object, required: true }
});

const { indicatorData } = toRefs(props);
</script>

<style scoped></style>

