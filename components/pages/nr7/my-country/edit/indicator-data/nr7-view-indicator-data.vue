<template>
    <km-form-group v-if="indicatorData.sourceOfData" :caption="t('sourceOfData')">
        <km-value>{{ t(indicatorData.sourceOfData) }}</km-value>
    </km-form-group>
    <km-form-group v-if="indicatorData.sourceOfDataInfo" :caption="t('sourceOfDataInfo')">
        <km-lstring-value :value="indicatorData.sourceOfDataInfo" :locale="indicatorData.languages"></km-lstring-value>
    </km-form-group>
    <km-form-group :caption="t('data')"  v-if="indicatorData.data">
        <div class="w-100" style="overflow: auto;">
            <table class="table responsive table-bordered">
                <tbody>
                <tr>
                    <th>{{t('indicatorCode')}}</th>
                    <th class="col-1">
                        {{t('doesDisaggregation')}}
                    </th>
                    <th>{{t('disaggregation')}}</th>
                    <th>{{t('year')}}</th>
                    <th>{{t('unit')}}</th>
                    <th>{{t('value')}}</th>
                    <th>{{t('footnote')}}</th>
                </tr>
                <tr v-for="unit in indicatorData.data" :key="unit">
                    <td>{{unit.indicatorCode}}</td>
                    <td>{{unit.hasDisaggregation ? t('yes') : t('no')}}</td>
                    <td>{{unit.disaggregation}}</td>
                    <td>{{unit.year}}</td>
                    <td>{{unit.unit}}</td>
                    <td>{{unit.value}}</td>
                    <td>{{unit.footnote}}</td>
                </tr>
            </tbody>
            </table>
        </div>
    </km-form-group>

    <km-form-group v-if="indicatorData.globalDataSources" :caption="t('globalSourceOfData')">
        <km-value v-for="source in indicatorData.globalDataSources" :key="source" class="mt-1">
            <a :href="source.url" target="_blank">{{ source.name }}</a>
        </km-value>
    </km-form-group>
    <km-form-group v-if="indicatorData.globalIndicatorProviders" :caption="t('globalIndicatorProviders')">
        <km-value v-for="source in indicatorData.globalIndicatorProviders" :key="source" class="mt-1">
            <a :href="source.url" target="_blank">{{ source.name }}</a>
        </km-value>
    </km-form-group>
    <km-form-group v-if="indicatorData.globalDescription" :caption="t('description')">
        <km-value>{{ indicatorData.globalDescription }}</km-value>
    </km-form-group>
    <km-form-group v-if="indicatorData.comments" class="mt-1" :caption="t('comments')">
        <km-lstring-value type="html" :value="indicatorData.comments"
            :locale="indicatorData.languages"></km-lstring-value>
    </km-form-group>
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-add-indicator-data.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-view-indicator-data.json"></i18n>
<script setup lang="ts">
//@ts-nocheck


const props = defineProps({
    indicatorData: { type: Object, required: true }
});

const {locale, t} = useI18n();
const { indicatorData } = toRefs(props);

</script>

<style scoped></style>

