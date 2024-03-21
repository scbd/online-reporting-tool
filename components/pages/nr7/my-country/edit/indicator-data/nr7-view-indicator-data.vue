<template>
    <CCard>
        <CCardBody v-if="indicatorData">
            <km-form-group v-if="indicatorData.sourceOfData" caption="Source of Data">
                <km-value>{{ indicatorData.sourceOfData?.value }}</km-value>
            </km-form-group>
            <km-form-group caption="Data">
            <div v-if="indicatorData.data" class="w-100" style="overflow: auto;">
                <CTable responsive bordered>
                    <CTableBody>
                        <CTableRow>
                            <CTableHeaderCell scope="col">Year</CTableHeaderCell>
                            <CTableDataCell v-for="unit in indicatorData.data" :key="unit">{{ unit.year }}
                            </CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableHeaderCell scope="row">Value</CTableHeaderCell>
                            <CTableDataCell v-for="unit in indicatorData.data" :key="unit">{{ unit.value }}
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </div>
        </km-form-group>

            <km-form-group v-if="indicatorData.dataSources" caption="Global source of data">
                <km-value v-for="source in indicatorData.dataSources" :key="source" class="mt-1">
                    <a :href="source.link" target="_blank">{{ source.title }}</a>
                </km-value>
            </km-form-group>
            <km-form-group v-if="indicatorData.indicatorProviders" caption="Indicator providers">
                <km-value v-for="source in indicatorData.indicatorProviders" :key="source" class="mt-1">
                    <a :href="source.link" target="_blank">{{ source.title }}</a>
                </km-value>
            </km-form-group>
            <!-- <km-form-group v-if="indicatorData.description">
                <label class="form-check-label">Description</label>
                <km-value>{{ indicatorData.description }}</km-value>
            </km-form-group> -->
            <km-form-group v-if="indicatorData.comments" class="mt-1" caption="Comments">
                <km-lstring-value type="html" :value="indicatorData.comments"
                    :locale="indicatorData.languages"></km-lstring-value>
            </km-form-group>
        </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
import { CTableDataCell } from "@coreui/vue";
import { KmLstringValue, KmValue, KmFormGroup } from "~/components/controls";
const props = defineProps({
    indicatorData: { type: Object, required: true }
});

const { indicatorData } = toRefs(props);
</script>

<style scoped></style>

