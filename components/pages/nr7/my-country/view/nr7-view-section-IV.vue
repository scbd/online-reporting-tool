<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('sectionIV')}} {{t('sectionIVDescription')}}</slot>
      </CCardHeader>
      <CCardBody>
            <toggle-accordion class="float-end mr-1 mb-1 btn-xs"  ref="accordionToggle"
                selector="#mapping-accordion .accordion-header button.accordion-button"
                v-if="sectionIVComputed"></toggle-accordion>
            <br>
            <br>

            <CAccordion always-open id="mapping-accordion">      
                <div v-if="document.header.languages && document.header.languages.length > 1" 
                    class="d-grid d-md-flex justify-content-md-end mb-2">
                    <km-locales v-model="selectedLocale" :locales="document.header.languages"></km-locales>
                </div>
                <CAccordionItem :item-key="index+1" :visible="true" 
                    v-for="(assessment, index) in sectionIVComputed" :key="assessment" 
                    class="mb-2" :class="{'assessment-target-active' : mouseOverGoal?.identifier == assessment.gbfGoal?.identifier}"
                    @mouseover="onMouseOver(assessment)" @mouseleave="onMouseleave(assessment)">

                    <CAccordionHeader :id="'assessment-target'+assessment.gbfGoal?.identifier" 
                        class="assessment-goal-accordion"
                        :class="{'p-0 header header-sticky' : canHeaderStick(assessment.gbfGoal?.identifier)}">
                        {{lstring(globalGoals[assessment.gbfGoal.identifier].title)}}                 
                    </CAccordionHeader>
                    <CAccordionBody>
                        <div >
                            {{ sectionIVComputed.summaryOfProgress }}
                            <km-form-group :name="'summaryOfProgress_'+ assessment.gbfGoal?.identifier"
                                :caption="t('summaryOfNationalProgress')">
                                <km-lstring-value type="html" :value="assessment.summaryOfProgress" 
                                    :locales="document.header.languages"></km-lstring-value>
                            </km-form-group>
                            
                            <legend>
                                {{ t('indicatorData') }}
                                <!-- ({{ nationalTargetsComputed[assessment.gbfGoal.identifier]?.indicators?.length }}) -->
                            </legend>
                            <hr>
                            <div v-for="(indictorData, key) in assessment?.indicatorData" :key="key">
                                <div class="mb-3"  v-if="indictorData.length">
                                    <div  v-for="data in indictorData" :key="data" class="card mb-3">
                                        <div class="card-header">
                                            <strong>{{ t(key) }}:</strong>
                                            {{ lstring(indicators[data.indicator.identifier]?.title) }} 
                                            <small class="fw-bold">({{ data.indicator?.identifier }})</small>
                                            
                                        </div>
                                        <div class="card-body" v-if="data.indicator">                                       
                                            <div v-if="data.indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')<0">
                                                <missing-data-alert 
                                                    v-if="!Object.keys(nationalIndicatorData[data.indicator.identifier]?.nationalData||{})?.length">
                                                </missing-data-alert>                                          
                                                <div v-if="nationalIndicatorData[data.indicator.identifier]?.nationalData">
                                                    <nr7-view-indicator-data :indicator-data="nationalIndicatorData[data.indicator.identifier]?.nationalData"></nr7-view-indicator-data>
                                                </div>
                                            </div>      
                                            <div v-if="data.indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')>=0" >  
                                                 
                                                <div v-if="nationalIndicatorData[data.indicator.identifier]?.nationalData">
                                                    <nr7-view-binary-indicator-data 
                                                        :indicator-data="nationalIndicatorData[data.indicator.identifier]?.nationalData" 
                                                        :questions="nationalIndicatorData[data.indicator.identifier]?.question?.questions">
                                                    </nr7-view-binary-indicator-data>
                                                </div>    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion>    
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-IV.json"></i18n>
<!-- <i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-IV.json"></i18n> -->

<script setup lang="ts">
  
  const props = defineProps({
        document    : { type:Object, required:true},
        identifier  : { type:String, required:true},
        nationalIndicatorData : {type:Object, required:true},
        globalGoals : {type:Object, required:true},
        indicators : {type:Object, required:true}
    });

    const {t, locale} = useI18n();
    const accordionToggle      = ref(null);
    const mouseOverGoal      = ref(null);

    const sectionIVComputed = computed(()=>{
        return props.document?.sectionIV || [];
    })

    const nationalTargetsComputed = computed(()=>{
        return props.nationalTargets || {}
    })

    function onMouseleave(){
        mouseOverGoal.value = null;
    }
    function onMouseOver({gbfGoal}){
        mouseOverGoal.value = gbfGoal;
    }

    function canHeaderStick(identifier){
        const accordionClasses = window.document.querySelector('#assessment-target'+identifier + ' button')?.className?.split(' ');
        const isCollapsed = accordionClasses?.includes('collapsed');

        return !isCollapsed && mouseOverGoal.value?.identifier == identifier
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
    .assessment-goal-accordion{
        top:110px;
    }
    .assessment-target-active{
        border: 3px solid#26638e;
    }
    .accordion-header.assessment-goal-accordion.header{
        border-bottom: 3px solid#26638e;
    }
</style>