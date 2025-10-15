<template>
    <CCard>
        <CCardHeader>
            {{ t('sectionIII') }} {{ t('sectionIIIDescription') }}
        </CCardHeader>
        <CCardBody>
            <div v-if="locales?.length > 1" class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="lSelectedLocale" :locales="locales"></km-locales>
            </div>

            <div class="card mb-3" v-for="(assessment) in sectionIIIComputed" :key="assessment">
                <div class="card-header">
                    {{ lstring(nationalTargetsComputed[assessment.target.identifier]?.title, selectedLocale) }}
                    <strong v-if="assessment.targetType" class="ms-1">({{ capitalCase(assessment.targetType) }})</strong>
                </div>
                <div class="card-body">
                    <km-form-group name="mainActionsSummary" v-if="assessment.mainActionsSummary"
                        :caption="t('brieflyDescribeTheMainActions')">
                        <km-lstring-value type="html" :value="assessment.mainActionsSummary"
                            :locale="selectedLocale"></km-lstring-value>
                    </km-form-group>
                    <km-form-group name="levelOfProgress" v-if="assessment.levelOfProgress"
                        :caption="t('indicateTheCurrentLevelOfProgress')">                                    
                        <km-value-term :value="assessment.levelOfProgress" :locale="selectedLocale"></km-value-term>                                    
                    </km-form-group>
                    <km-form-group name="progressSummary" v-if="assessment.progressSummary"
                        :caption="t('provideASummaryOfProgress')">
                        <km-lstring-value type="html" :value="assessment.progressSummary"
                            :locale="selectedLocale"></km-lstring-value>
                    </km-form-group>

                    <km-form-group name="keyChallengesSummary" v-if="assessment.keyChallengesSummary"
                        :caption="t('provideExamplesOrCases')">
                        <km-lstring-value type="html" :value="assessment.keyChallengesSummary"
                            :locale="selectedLocale"></km-lstring-value>
                    </km-form-group>

                    <km-form-group name="actionEffectivenessSummary" v-if="assessment.actionEffectivenessSummary"
                        :caption="t('provideExamplesOrCases')">
                        <km-lstring-value type="html" :value="assessment.actionEffectivenessSummary"
                            :locale="selectedLocale"></km-lstring-value>
                    </km-form-group>

                    <km-form-group name="sdgRelationSummary" v-if="assessment.sdgRelationSummary"
                        :caption="t('brieflyDescribeImplementation')">
                        <km-lstring-value type="html" :value="assessment.sdgRelationSummary"
                            :locale="selectedLocale"></km-lstring-value>
                    </km-form-group>

                    <km-form-group v-if="assessment.indicatorData">
                        <legend>
                            {{ t('indicatorData') }}
                        </legend>
                        <hr>
                        <nr7-view-target-indicators :target-indicators="assessment.indicatorData"
                            :indicators-data="indicatorsData" :national-indicators="nationalIndicators"></nr7-view-target-indicators>                                    
                    </km-form-group>
                </div>
            </div>      
        </CCardBody>
    </CCard>
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-III.json"></i18n>

<script setup lang="ts">
    import type { EDocumentInfo } from "~/types/schemas/base/EDocumentInfo";
    import { defineProps } from 'vue';
    import { capitalCase } from 'change-case';

    const props = defineProps({
        document    : { type:Object, default : undefined },
        identifier  : { type:String, required:true },
        nationalTargets : {type:Object, default:[] },
        indicatorsData  : {type:Array<EDocumentInfo>, default:[] },
        locales         : { type:Array<string>, default:[]  },
        documentLocale  : { type:String }
    });
    
    const {t, locale} = useI18n();
    const { documentLocale } = toRefs(props);
    const lSelectedLocale = ref(locale.value)
    const selectedLocale  = computed(()=>documentLocale?.value||lSelectedLocale.value);
    const sectionIIIComputed = computed(()=>{
        return props.document?.sectionIII || [];
    })

    const nationalIndicators      = computed(()=>{
        return Object.values(nationalTargetsComputed.value).map(e=>e.body).map(e=>e?.otherNationalIndicators||[]).flat().map(e=>e);
    });
    const nationalTargetsComputed = computed(()=>{
        return props.nationalTargets || {}
    })
    const indicatorsData = computed(()=>{
        return props.indicatorsData || [];
    })
    
    onMounted(()=>{
        // console.log('mounted')
        /*
globalTargetAlignment_ss,otherNationalIndicators_ss,otherNationalIndicators_CEN_s,
headlineIndicators_CAR_ss
        */
       
    })
</script>
<style scoped>
    .assessment-target-accordion {
        top: 110px;
    }

</style>
