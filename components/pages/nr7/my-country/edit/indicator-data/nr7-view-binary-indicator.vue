<template>
    <CCard>
        <CCardBody v-if="indicatorData">
            <km-form-group v-if="indicatorData.sourceOfData">
                <label class="form-check-label">Source of Data</label>
                <km-value>{{ indicatorData.sourceOfData?.value }}</km-value>
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

