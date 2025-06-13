<template>
    <a :href="indicatorDataTemplates" target="_blank" v-if="!indicatorData">
        {{ t('downloadIndicator') }}  
        <font-awesome-icon icon="fa-download"></font-awesome-icon>                                                            
    </a>
    <a href="#" @click="downloadSampleExcel"  v-if="indicatorData">
        {{ t('downloadIndicator') }}  
        <font-awesome-icon icon="fa-download"></font-awesome-icon>                                                            
    </a>
</template>

<i18n src="@/i18n/dist/components/common/download/indicator-sample-data.json"></i18n>

<script setup lang="ts">
import { IndicatorsMappingData } from '~/app-data/indicators';
import type { ETerm } from '~/types/schemas/base/ETerm';
import writeXlsxFile from 'write-excel-file';
import type { IndicatorMapping } from '~/types/controls/indicator-mapping';

    const props = defineProps({
        indicator: { type: String, required: true }
    });

    const indicatorDataTemplates = '/excel-templates/GBF-INDICATORS-DATA.xlsx'
    const thesaurusStore = useThesaurusStore();
    const { t, locale } = useI18n();

    const indicatorTerm: ComputedRef<ETerm> = computed(() => {        
        return thesaurusStore.getTerm(props.indicator);
    });
    const indicatorData: ComputedRef<IndicatorMapping|undefined> = computed(() => {        
        return IndicatorsMappingData.find(e=>e.identifier == props.indicator);
    });

    await thesaurusStore.loadTerm(props.indicator);

    const downloadSampleExcel = async () => {
        if (!indicatorData.value) {
            alert(`No sample data found for indicator: ${props.indicator}`);
            return;
        }

        const { headers, rows } = buildExcelData(indicatorData.value);
        await writeXlsxFile([headers, ...rows], { fileName: `scbd-ort-${props.indicator}-data.xlsx`})
 
    }

    function buildExcelData(indicatorData:IndicatorMapping) {
        
        const headers = [
            {
                type: String,
                value: 'Indicator code',
                fontWeight: 'bold'
            },
            {
                type: String,
                value: 'Indicator',
                fontWeight: 'bold'
            },
            {
                type: String,
                value: 'Does this data row represent a disaggregation',
                fontWeight: 'bold'
            },
            {
                type: String,
                value: 'Disaggregation',
                fontWeight: 'bold'
            },
            {
                type: String,
                value: 'Year',
                fontWeight: 'bold'
            },
            {
                type: String,
                value: 'Unit',
                fontWeight: 'bold'
            },
            {
                type: String,
                value: 'Value',
                fontWeight: 'bold'
            },
            {
                type: String,
                value: 'Footnote',
                fontWeight: 'bold'
            }
        ]
        const rows = [];
        
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 25; i++) {
            
            rows.push([
                {
                    type: String,
                    value: indicatorData.code
                },
                {
                    type: String,
                    value: indicatorTerm.value.title[locale.value]
                },
                {
                    type: String,
                    value: ''
                },
                {
                    type: String,
                    value: ''
                },
                {
                    type: Number,
                    value: currentYear - i
                },
                {
                    type: String,
                    value: ''
                },
                {
                    type: Number
                },
                {
                    type: String,
                    value: ''
                }
            ])
        }

        return { headers, rows };
    }

    
</script>

<style scoped>

</style>