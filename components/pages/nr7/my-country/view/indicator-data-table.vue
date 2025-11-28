<template>
    <div class="w-100" style="overflow: auto;">
        <table class="table responsive table-bordered">
            <tbody>
            <tr>
                <th v-if="showIndicatorCode">{{t('indicatorCode')}}</th>
                <th class="col-1">
                    {{ showIndicatorCode ? t('doesDisaggregation') : t('shortDoesDisaggregation')}}
                </th>
                <th>{{t('disaggregation')}}</th>
                <th>{{t('year')}}</th>
                <th>{{t('unit')}}</th>
                <th>{{t('value')}}</th>
                <th>{{t('footnote')}}</th>
            </tr>
            <tr v-for="unit in indicatorData" :key="unit">
                
                <td  v-if="showIndicatorCode" :class="{'bg-danger' : !unit.indicatorCode || unit.indicatorCode != indicatorCode}">
                    {{unit.indicatorCode}}
                </td>
                <td>{{unit.hasDisaggregation ? t('yes') : t('no')}}</td>
                <td>{{unit.disaggregation}}</td>
                <td :class="{'bg-danger' : !isNumber(unit.year) || unit.year == 0}">{{unit.year}}</td>
                <td :class="{'bg-danger' : !unit.unit}">{{unit.unit}}</td>
                <td :class="{'bg-danger' : !isNumber(unit.value) || isNaN(unit.value)}">{{unit.value}}</td>
                <td>{{unit.footnote}}</td>
            </tr>
        </tbody>
        </table>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/indicator-data-table.json"></i18n>

<script setup lang="ts">
import { computed, toRefs, defineProps } from 'vue';
import type { ETerm } from '~/types/schemas/base/ETerm';
import { isNumber, isNaN } from 'lodash';
import { IndicatorsMappingData } from '~/app-data/indicators';

    const props = defineProps({
        indicatorData: { type: Object, required: true },
        indicatorCode: { type: String, required: true },
        showIndicatorCode: { type: Boolean, default:true }
    });

    const thesaurusStore    = useThesaurusStore();
    const {locale, t}       = useI18n();
    const { indicatorData } = toRefs(props);

    const indicator:ComputedRef<ETerm> = computed(() => thesaurusStore.getTerm(props.indicatorData?.indicator?.identifier));
    
    
    onMounted(async () => {
        if (indicatorData.value.indicator) {
            await thesaurusStore.loadTerm(indicatorData.value.indicator.identifier);
        }
    }); 
</script>

<style scoped></style>

