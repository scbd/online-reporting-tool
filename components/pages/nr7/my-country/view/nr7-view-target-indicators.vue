<template>
    <div v-for="(indicator, key) in targetIndicators" :key="indicator">  

        <div class="card mb-3" v-for="indicatorData in indicator" :key="indicatorData">

            <div class="card-header">
                <slot name="header" :key="key" :indicator-identifier="indicatorData?.indicator?.identifier" 
                    :national-indicator="computedNationalIndicators[indicatorData.indicator?.identifier]">
                    <km-term v-if="key!='national'" :value="indicatorData.indicator?.identifier" :locale="locale"></km-term>
                    <span v-if="key=='national'">{{ lstring(computedNationalIndicators[indicatorData.indicator?.identifier]?.value, locale) }}</span>
                </slot>                
                <small class="fw-bold badge bg-info float-end ms-1">{{indicatorData.indicator.identifier }}</small>
                <strong class="badge bg-info float-end">{{ t(key) }}</strong>
            </div>

            <div class="card-body">
                <slot name="actionButtons" :key="key" :indicator-data="computedIndicatorsData?.[indicatorData.data?.identifier]"
                    :indicator="indicatorData?.indicator" :national-indicator="computedNationalIndicators[indicatorData.indicator?.identifier]">
                </slot>
                <div v-if="key!= 'binary' && indicatorData.data">
                    <div v-if="computedIndicatorsData[indicatorData.data.identifier]">
                        <nr7-view-indicator-data :indicator-type="key=='national'?'otherNationalIndicators': key"
                            :indicator="indicator"
                            :indicator-data="computedIndicatorsData[indicatorData.data.identifier]?.body"></nr7-view-indicator-data>
                    </div>
                    <missing-data-alert v-else></missing-data-alert>
                </div>
                <div v-else-if="key == 'binary' && indicatorData.data">
                    
                    <div v-if="computedIndicatorsData[indicatorData.data.identifier]">
                        <nr7-view-binary-indicator-data
                            :indicator="indicatorData.indicator"
                            :indicator-data="getSectionResponse(indicatorData)"
                            :questions="computedBinaryIndicatorQuestions[indicatorData.indicator.identifier]?.questions"
                            :hide-missing-response="false">
                        </nr7-view-binary-indicator-data>
                    </div>
                    <missing-data-alert v-else></missing-data-alert>
                </div>
                <missing-data-alert v-else></missing-data-alert>
            </div>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-target-indicators.json"></i18n>
<script setup lang="ts">
    import { computed, toRefs, defineProps } from 'vue';
    import type { EDocumentInfo } from "~/types/schemas/base/EDocumentInfo";
    import {binaryIndicatorQuestions } from '~/app-data/binary-indicator-questions'

    const props = defineProps({
        targetIndicators: { type: Object, required: true },
        indicatorsData  : { type: Array<Object>, required: false },
        nationalIndicators: { type: Array<Object>, required: false }
    });

    const thesaurusStore    = useThesaurusStore();
    const {locale, t}       = useI18n();
    const { targetIndicators, indicatorsData } = toRefs(props);

    const computedIndicatorsData = computed(() => {
        return arrayToObject<EDocumentInfo>(indicatorsData?.value||[] as Array<any>)||{};
    });
    const computedBinaryIndicatorQuestions = computed(() => {
        const questions = binaryIndicatorQuestions.map(e=>({...e, identifier:e.binaryIndicator}));
        return arrayToObject<any>(questions as Array<any>)||{};
    });

    const computedNationalIndicators = computed(() => {
        return arrayToObject<any>(props.nationalIndicators||[] as Array<any>)||{};
        
    });

    function getSectionResponse(indicatorData:any):any {
        
        const binaryResponses = computedIndicatorsData.value[indicatorData?.data?.identifier]?.body as any;
        if(!binaryResponses) return null;

        const binaryQuestionSection = computedBinaryIndicatorQuestions.value[indicatorData?.indicator?.identifier]
        return binaryResponses[binaryQuestionSection.key];
    }
        
</script>

<style scoped></style>

