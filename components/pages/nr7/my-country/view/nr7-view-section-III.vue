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
                    selector="#mapping-accordion .accordion-header button.accordion-button"
                    v-if="sectionIIIComputed"></toggle-accordion>
            </div>
            <br>
            <br>
            <CAccordion always-open id="mapping-accordion">
               
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
                                <km-form-group name="mainActionsInfo" v-if="assessment.mainActionsInfo"
                                    caption="Please briefly describe the main actions taken to implement this national target">
                                    <km-lstring-value type="html" :value="assessment.mainActionsInfo"
                                        :locale="selectedLocale"></km-lstring-value>
                                </km-form-group>
                                <km-form-group name="levelOfProgress" v-if="assessment.levelOfProgress"
                                    caption="Please indicate the current level of progress towards this national target">                                    
                                    <km-value-term :value="assessment.levelOfProgress" :locale="selectedLocale"></km-value-term>                                    
                                </km-form-group>
                                <km-form-group name="progressSummaryInfo" v-if="assessment.progressSummaryInfo"
                                    caption="Please provide a summary of progress towards this national target, including the main outcomes achieved, key challenges encountered, and different approaches that may be taken for further implementation">
                                    <km-lstring-value type="html" :value="assessment.progressSummaryInfo"
                                        :locale="selectedLocale"></km-lstring-value>
                                </km-form-group>

                                <km-form-group name="actionEffectivenessInfo" v-if="assessment.actionEffectivenessInfo"
                                    caption="Please provide examples or cases to illustrate the effectiveness of the actions taken to implement this national assessment. If needed, provide relevant web links or attach related materials or publications">
                                    <km-lstring-value type="html" :value="assessment.actionEffectivenessInfo"
                                        :locale="selectedLocale"></km-lstring-value>
                                </km-form-group>

                                <km-form-group name="sdgRelationInfo" v-if="assessment.sdgRelationInfo"
                                    caption="Please briefly describe how the implementation of this national target relates to progress in achieving related Sustainable Development Goals and associated targets and implementation of other related agreements ">
                                    <km-lstring-value type="html" :value="assessment.sdgRelationInfo"
                                        :locale="selectedLocale"></km-lstring-value>
                                </km-form-group>
                            </div>
                        </div>
                        <km-form-group v-if="nationalTargets[assessment.target.identifier]?.indicators">
                            
                            <legend>
                                Indicator Data ({{ nationalTargetsComputed[assessment.target.identifier]?.indicators?.length}})
                            </legend>
                            <hr>
                            <div v-for="indicator in nationalTargetsComputed[assessment.target.identifier]?.indicators"
                                    :key="indicator">
                                <div class="card mb-3" v-if="indicator?.nationalData" >

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
<script setup>


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
