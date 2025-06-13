<template>
    <km-form-group v-if="indicatorData.sourceOfData" :caption="t('sourceOfData')">
        <km-value>{{ t(indicatorData.sourceOfData) }}</km-value>
    </km-form-group>
    <km-form-group v-if="indicatorData.sourceOfDataInfo" :caption="t('sourceOfDataInfo')">
        <km-lstring-value :value="indicatorData.sourceOfDataInfo" :locale="indicatorData.languages"></km-lstring-value>
    </km-form-group>
    <km-form-group v-if="!indicatorData.data">
        <missing-data-alert></missing-data-alert>    
    </km-form-group>
    <km-form-group :caption="t('data')"  v-if="indicatorData.data">
        <download-data :headers="excelHeaders" :data="excelData" class="float-end"
            :fileName="`indicator-data-${lstring(indicator.title, locale)}`"></download-data>
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
import { computed, toRefs, defineProps } from 'vue';
import type {IndicatorData } from '~/types/controls/indicator-mapping';
import type { ETerm } from '~/types/schemas/base/ETerm';

    const props = defineProps({
        indicatorData: { type: Object, required: true },
        documentLocale: { type:String }
    });

    const thesaurusStore    = useThesaurusStore();
    const {locale, t}       = useI18n();
    const { indicatorData } = toRefs(props);
    const selectedLocale = computed(()=>props.documentLocale||locale.value);

    const indicator:ComputedRef<ETerm> = computed(() => thesaurusStore.getTerm(props.indicatorData.indicator.identifier));

    await thesaurusStore.loadTerm(props.indicatorData.indicator.identifier);

    
    const excelHeaders = computed(() => [
        { type: String, value: t('indicatorCode'), fontWeight: 'bold' },
        { type: String, value: t('indicator'), fontWeight: 'bold' },
        { type: String, value: t('doesDisaggregation'), fontWeight: 'bold' },
        { type: String, value: t('disaggregation'), fontWeight: 'bold' },
        { type: String, value: t('year'), fontWeight: 'bold' },
        { type: String, value: t('unit'), fontWeight: 'bold' },
        { type: String, value: t('value'), fontWeight: 'bold' },
        { type: String, value: t('footnote'), fontWeight: 'bold' }
    ]);

    const excelData = computed(() => {
        return indicatorData.value.data?.map((unit:IndicatorData) => [
            { type: String, value: unit.indicatorCode },
            { type: String, value: lstring(indicator.value.title, locale) },
            { type: String, value: unit.hasDisaggregation ? t('yes') : t('no') },
            { type: String, value: unit.disaggregation||'' },
            { type: Number, value: unit.year||0 },
            { type: String, value: unit.unit||'' },
            { type: Number, value: unit.value||0 },
            { type: String, value: unit.footnote||'' }
        ]) || [];
    });
</script>

<style scoped></style>

