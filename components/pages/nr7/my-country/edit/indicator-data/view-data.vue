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
                        <CTableHeaderCell v-for="unit in indicatorData.data" :key="unit">{{unit.year}}</CTableHeaderCell>
                    </CTableRow>
                    <CTableRow>
                        <CTableHeaderCell scope="row">Value</CTableHeaderCell>
                        <CTableHeaderCell v-for="unit in indicatorData.data" :key="unit">{{unit.value}}</CTableHeaderCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
            <!-- <div class="table-responsive" style="display1:none; overflow: auto;width:10%;">
                <table class="table table-bordered" v-if="indicatorData.data">
                    <tbody>
                        <tr>
                            <td><strong>Year</strong></td>
                            <td v-for="unit in indicatorData.data" :key="unit">{{unit.year}}</td>
                        </tr>
                        <tr>
                            <td><strong>Value</strong></td>
                            <td v-for="unit in indicatorData.data" :key="unit">{{unit.value}}</td>
                        </tr>
                    </tbody>
                </table>
            </div> -->
        </km-form-group1>
        <km-form-group v-if="indicatorData.comments">
            <label class="form-check-label">Comments</label>
            <km-lstring-value type="html" :value="indicatorData.comments"
                :locale="indicatorData.languages"></km-lstring-value>
        </km-form-group>
    </CCardBody>
</CCard></template>

<script setup lang="ts">
import { KmLstringValue, KmValue, KmFormGroup } from "~/components/controls";
const props = defineProps({
    indicatorData: { type: Object, required: true }
});

const { indicatorData } = toRefs(props);
</script>

<style scoped></style>

