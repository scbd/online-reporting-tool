<template>
    <km-form-group v-if="indicatorData.sourceOfData" :caption="t('sourceOfData')">
        <km-value>{{ t(indicatorData.sourceOfData) }}</km-value>
    </km-form-group>
    
    <km-form-group v-if="indicatorData.sourceOfDataInfo" :caption="t(indicatorData.sourceOfData =='noData' ? 'sourceOfDataInfoNoData' : 'sourceOfDataInfoNotRelevant')">
        <km-lstring-value :value="indicatorData.sourceOfDataInfo" :locale="indicatorData.languages"></km-lstring-value>
    </km-form-group>
    <km-form-group v-if="!indicatorData.data && ['notRelevant', 'noData'].includes(indicatorData?.sourceOfDataInfo)">
        <missing-data-alert></missing-data-alert>    
    </km-form-group>
    <km-form-group :caption="t('data')"  v-if="indicatorData.data">
        <download-data :headers="excelHeaders" :data="excelData" class="float-end"
            :fileName="`indicator-data-${lstring(indicator?.title||'', locale)}`"></download-data>
        <indicator-data-table :indicator-data="indicatorData.data" :indicator-code="indicatorData.data[0].indicatorCode"></indicator-data-table>
        
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
        documentLocale: { type:String },
        indicatorType: { type: String }
    });

    const thesaurusStore    = useThesaurusStore();
    const {locale, t}       = useI18n();
    const { indicatorData } = toRefs(props);
    const selectedLocale = computed(()=>props.documentLocale||locale.value);

    const indicator:ComputedRef<ETerm> = computed(() => thesaurusStore.getTerm(props.indicatorData?.indicator?.identifier)||{});
    
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
            { type: String, value: lstring(indicator.value?.title||'', locale) },
            { type: String, value: unit.hasDisaggregation ? t('yes') : t('no') },
            { type: String, value: unit.disaggregation||'' },
            { type: Number, value: unit.year||0 },
            { type: String, value: unit.unit||'' },
            { type: Number, value: unit.value||0 },
            { type: String, value: unit.footnote||'' }
        ]) || [];
    });

    onMounted(async () => {
        if (indicatorData.value.indicator && props.indicatorType != 'otherNationalIndicators') {            
            await thesaurusStore.loadTerm(indicatorData.value.indicator.identifier);
        }
    }); 
</script>

<style scoped></style>

