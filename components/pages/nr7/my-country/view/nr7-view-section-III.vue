<template>
    <CCard>
        <CCardHeader>
            {{ t('sectionIII') }} {{ t('sectionIIIDescription') }}
        </CCardHeader>
        <CCardBody>

            <!-- <div v-if="nationalReport7Store.isBusy || isBusy">
                <km-spinner></km-spinner>
            </div> -->   
            <div class="float-end">
                <span v-if="document.header.languages && document.header.languages.length > 1" 
                    class="justify-content-md-end mb-2 me-1">
                    <km-locales v-model="selectedLocale" :locales="document.header.languages"></km-locales>
                </span>          
                <toggle-accordion ref="accordionToggle"
                    selector="#view-mapping-accordion .accordion-header button.accordion-button"
                    v-if="sectionIIIComputed"></toggle-accordion>
            </div>
            <br>
            <br>
            <CAccordion always-open id="view-mapping-accordion">
               
                <!-- nationalTargets           -->
                <CAccordionItem :item-key="index + 1" :visible="true"
                    v-for="(assessment, index) in sectionIIIComputed" :key="assessment"
                    @mouseover="onMouseOver(assessment)" @mouseleave="onMouseleave(assessment)">
                    <CAccordionHeader :id="'assessment-target' + assessment.identifier"
                        class="assessment-target-accordion"
                        :class="{ 'header header-sticky': mouseOverTarget?.identifier == assessment?.identifier }">
                        {{ lstring(nationalTargets[assessment.target.identifier]?.title) }}
                    </CAccordionHeader>
                    <CAccordionBody v-if="nationalTargets[assessment.target.identifier]">
                        <div class="card1">
                            <div class="card-body1">
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
                            </div>
                        </div>
                        <km-form-group v-if="nationalTargets[assessment.target.identifier]?.indicators">
                            
                            <legend>
                                {{ t('indicatorData') }} ({{ nationalTargetsComputed[assessment.target.identifier]?.indicators?.length}})
                            </legend>
                            <hr>
                            <div v-for="indicator in nationalTargetsComputed[assessment.target.identifier]?.indicators"
                                    :key="indicator">                            
                                <div class="card mb-3"  v-if="['headlineIndicators', 'binaryIndicators'].includes(indicator.type) || indicator.nationalData">

                                    <div class="card-header">
                                        <!-- {{ indicator }} -->
                                        <strong>{{ t(indicator.type) }}:</strong>
                                        {{ lstring(indicator?.title || indicator?.value) }}
                                        <small class="fw-bold" v-if="indicator.type != 'nationalIndicators'">({{
                                            indicator?.identifier }})</small>
                                    </div>
                                    <div class="card-body">
                                        <div v-if="indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN') < 0">
                                            <div v-if="indicator.nationalData">
                                                <nr7-view-indicator-data
                                                    :indicator-data="indicator.nationalData"></nr7-view-indicator-data>
                                            </div>
                                        </div>
                                        <div v-if="indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN') >= 0">
                                            
                                            <div v-if="indicator.nationalData">
                                                <nr7-view-binary-indicator-data
                                                    :indicator-data="indicator.nationalData"
                                                    :questions="indicator?.question?.questions"
                                                    :hide-missing-response="true">
                                                </nr7-view-binary-indicator-data>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        <!-- </div> -->
                        </km-form-group>

                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion>

        </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-III.json"></i18n>
<!-- <i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-III.json"></i18n> -->
<script setup lang="ts">
//@ts-nocheck


    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true},
        nationalTargets : {type:Object, default:[]}
    });

    const {t, locale} = useI18n();
    const accordionToggle      = ref(null);
    const mouseOverTarget      = ref(null);

    const selectedLocale = ref(locale.value);
    const sectionIIIComputed = computed(()=>{
        return props.document?.sectionIII || [];
    })

    const nationalTargetsComputed = computed(()=>{
        return props.nationalTargets || {}
    })

    function onMouseleave(target){
        mouseOverTarget.value = null;
    }
    function onMouseOver({identifier}){
        mouseOverTarget.value = {identifier};
    }

    onMounted(()=>{
        // console.log('mounted')
        /*
globalTargetAlignment_ss,otherNationalIndicators_ss,otherNationalIndicators_CEN_s,
headlineIndicators_CAR_ss
        */
        setTimeout(()=>accordionToggle.value.toggle(true), 500)
    })
</script>
<style scoped>
    .assessment-target-accordion {
        top: 110px;
    }

</style>
