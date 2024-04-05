<template>
    <!-- <CCard> -->
        <!-- <CCardBody v-if="indicatorData"> -->
            <km-form-group v-if="indicatorData.sourceOfData" :caption="t('sourceOfData')">
                <km-value>{{ t(indicatorData.sourceOfData?.value) }}</km-value>
            </km-form-group>
            <km-form-group caption="Data"  v-if="indicatorData.data">
                <div class="w-100" style="overflow: auto;">
                    <CTable responsive bordered>
                        <CTableBody>
                            <CTableRow>
                                <CTableHeaderCell scope="col">{{t('year')}}</CTableHeaderCell>
                                <CTableDataCell v-for="unit in indicatorData.data" :key="unit">{{ unit.year }}
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                                <CTableHeaderCell scope="row">{{t('value')}}</CTableHeaderCell>
                                <CTableDataCell v-for="unit in indicatorData.data" :key="unit">{{ unit.value }}
                                </CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </div>
            </km-form-group>

            <km-form-group v-if="indicatorData.dataSources" :caption="t('globalSourceOfData')">
                <km-value v-for="source in indicatorData.dataSources" :key="source" class="mt-1">
                    <a :href="source.link" target="_blank">{{ source.title }}</a>
                </km-value>
            </km-form-group>
            <km-form-group v-if="indicatorData.indicatorProviders" :caption="t('indicatorProviders')">
                <km-value v-for="source in indicatorData.indicatorProviders" :key="source" class="mt-1">
                    <a :href="source.link" target="_blank">{{ source.title }}</a>
                </km-value>
            </km-form-group>
            <!-- <km-form-group v-if="indicatorData.description">
                <label class="form-check-label">Description</label>
                <km-value>{{ indicatorData.description }}</km-value>
            </km-form-group> -->
            <km-form-group v-if="indicatorData.comments" class="mt-1" :caption="t('comments')">
                <km-lstring-value type="html" :value="indicatorData.comments"
                    :locale="indicatorData.languages"></km-lstring-value>
            </km-form-group>
        <!-- </CCardBody> -->
    <!-- </CCard> -->
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-view-indicator-data.json"></i18n>
<script setup lang="ts">


const props = defineProps({
    indicatorData: { type: Object, required: true }
});

const {t} = useI18n();

</script>

<style scoped></style>

