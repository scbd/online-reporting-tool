<template>
    <CCard>
      <CCardHeader>
        {{t('sectionIV')}} {{t('sectionIVDescription')}}
      </CCardHeader>
      <CCardBody>
        
        <div  v-if="nationalReport7Store.isBusy || isBusy">
            <km-spinner center></km-spinner>
        </div>
        <form v-if="!isBusy && !nationalReport7Store.isBusy && nationalReport7Store.nationalReport" name="editForm">          
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument" 
                :container="container" :validate-server-draft="true">
                <template #submission>
                    <toggle-accordion class="float-end mr-1 mb-1 btn-xs"  ref="accordionToggle"
                    selector="#mapping-accordion .accordion-header button.accordion-button"></toggle-accordion>
                    <br>
                    <br>
                    <CAccordion always-open id="mapping-accordion">          
                        <!-- nationalTargets           -->
                       
                        <CAccordionItem :item-key="index+1" :visible="true" 
                            v-for="(assessment, index) in sectionIVComputed" :key="assessment" 
                            class="mb-2" :class="{'assessment-target-active' : mouseOverTarget?.identifier == assessment.gbfGoal?.identifier}"
                            @mouseover="onMouseOver(assessment)" @mouseleave="onMouseleave(assessment)">
                            <CAccordionHeader :id="'assessment-target'+assessment.gbfGoal?.identifier" 
                                class="assessment-target-accordion"
                                :class="{'p-0 header header-sticky' : canHeaderStick(assessment.gbfGoal?.identifier)}">
                                {{lstring(globalGoals[assessment.gbfGoal.identifier].title)}}                 
                            </CAccordionHeader>
                            <CAccordionBody>
                                <div >

                                    <km-form-group name="sdgRelationInfo" caption="Summary of national progress contributing to the global goals">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="sectionIVComputed.sdgRelationInfo" 
                                        :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    
                                    <legend>
                                       Indicator Data 
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
                                        
                                                        <nr7-add-indicator-data :indicator="data.indicator" 
                                                            :raw-document="nationalIndicatorData[data.indicator.identifier]?.nationalData" 
                                                            :identifier="nationalIndicatorData[data.indicator.identifier]?.nationalData?.header?.identifier" 
                                                            @on-post-save-draft="onAddIndicatorDataClose">
                                                        </nr7-add-indicator-data>       
                                                        <div v-if="nationalIndicatorData[data.indicator.identifier]?.nationalData">
                                                            <nr7-view-indicator-data :indicator-data="nationalIndicatorData[data.indicator.identifier]?.nationalData"></nr7-view-indicator-data>
                                                        </div>
                                                    </div>      
                                                    <div v-if="data.indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')>=0" >  
                                                        <nr7-add-binary-indicator-data :indicator="data.indicator" 
                                                            container=".nr7-add-binary-indicator-data-modal"
                                                            :identifier="nationalIndicatorData[data.indicator.identifier]?.nationalData?.header?.identifier" 
                                                            @on-post-save-draft="onAddIndicatorDataClose">
                                                        </nr7-add-binary-indicator-data>   
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
                                    <div class="row">
                                        <div class="alert alert-info">Do you want to provide data for Component and Complementary indicators on GBF Goals</div>
                                        <div class="col-6">
                                            <km-form-group :caption="t('componentIndicators')">
                                                <km-select
                                                    v-model="globalGoals[assessment.gbfGoal.identifier].selectedComponent"
                                                    class="validationClass"
                                                    label="title"
                                                    track-by="identifier"
                                                    value-key="identifier"
                                                    :placeholder="t('componentIndicators')"
                                                    :options="globalGoals[assessment.gbfGoal.identifier]?.componentIndicators"
                                                    :multiple="true"
                                                    :disabled="false"
                                                    :close-on-select="false"
                                                    :custom-label="customLabel"
                                                    :custom-selected-item="customSelectedItem"
                                                    @update:modelValue="onIndicatorChange($event, 'component', assessment.gbfGoal.identifier)"
                                                >
                                                </km-select>
                                            </km-form-group>
                                        </div>
                                        <div class="col-6">
                                            <km-form-group :caption="t('complementaryIndicators')">
                                                <km-select
                                                    v-model="globalGoals[assessment.gbfGoal.identifier].selectedComplementary"
                                                    class="validationClass"
                                                    label="title"
                                                    track-by="identifier"
                                                    value-key="identifier"
                                                    :placeholder="t('complementaryIndicators')"
                                                    :close-on-select="false"
                                                    :options="globalGoals[assessment.gbfGoal.identifier]?.complementaryIndicators"
                                                    :multiple="true"
                                                    :disabled="false"
                                                    :custom-label="customLabel"
                                                    :custom-selected-item="customSelectedItem"
                                                    @update:modelValue="onIndicatorChange($event, 'complementary', assessment.gbfGoal.identifier)"
                                                >
                                                </km-select>
                                            </km-form-group>
                                        </div>
                                    </div>
                                </div>
                                
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>         
                    
                </template>
                <template #review>                
                    <nr7-view-section-III :identifier="nationalReport7Store.nationalReport?.header?.identifier" 
                        :document="cleanDocument"
                        :national-targets="nationalTargetsComputed"></nr7-view-section-III>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>


      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-IV.json"></i18n>
<script setup>
  
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import MissingDataAlert from './indicator-data/missing-data-alert.vue';
    import {uniqBy, compact, cloneDeep } from 'lodash';
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util'; 
    import {binaryIndicatorQuestions } from '~/app-data/binary-indicator-questions.js'

    let document = ref({});
    const props = defineProps({
        workflowActiveTab  : {type:Number, default:1 },
    }) 
    // These emits are used by base view when the form is 
    // open in a dialog mode form overview
    const emit  = defineEmits(['onClose', 'onPostSaveDraft'])

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }              = useI18n();
    const $toast                    = useToast();        
    const container = useAttrs().container;
    const nationalReport7Store = useNationalReport7Store();
    const globalGoals         = ref({});
    const indicators          = ref({});
    const nationalTargets     = ref();
    const nationalIndicatorData = ref([]);
    const nationalBinaryIndicatorData = ref({});
    const isBusy                = ref(true);
    const accordionToggle      = ref(null);
    const mouseOverTarget      = ref(null);
    const validationReport     = ref(null);
    const isEventDefined       = useHasEvents();
    

    const sectionIVComputed = computed({ 
        get(){ 
            return document.value.sectionIV
        }
    });
    const nationalTargetsComputed = computed(()=>nationalTargets.value);

    const complementaryIndicators = computed(()=>{
        return Object.keys(indicators.value).filter(e=>indicators.value[e].type == 'complementary').map(e=>indicators.value[e])
    })

    const componentIndicators = computed(()=>{
        return Object.keys(indicators.value).filter(e=>indicators.value[e].type == 'component').map(e=>indicators.value[e])
    })

    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }

    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};
        clean.sectionIV = sectionIVComputed.value;

        clean = useKmStorage().cleanDocument(clean);
        
        return clean;
    });

    const onPostClose = async (document)=>{
        
        if(isEventDefined('onClose'))
            emit('onClose', document);
        else{
            await useNavigateAppTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I);
        }
    }

    const onPreSaveDraft = async (document)=>{
        return document;
    };

    const onPostSaveDraft = async (document)=>{
        emit('onPostSaveDraft', document);
        nationalReport7Store.updateNationalReport(document);
    }

    const onPostReviewDocument = async(document, newValidationReport)=>{
        validationReport.value = newValidationReport.value;
    }
    
    const onPreReviewDocument = (document)=>{
        return document;
    }
    const onGetDocumentInfo = async ()=>{
        return nationalReport7Store.nationalReport;
    }

    async function loadNationalTargets(){

        const response = await KmDocumentsService.loadDocuments(`(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`,500, undefined, 0, true)
        const targets = await Promise.all(response?.Items?.map(async e=>{
                            const headlineIndicators = await Promise.all(e.body?.globalGoalAlignment?.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)})||[]);
                            const binaryIndicators   = await Promise.all(e.body?.globalGoalAlignment?.map(e=>{return GbfGoalsAndTargets.loadGbfBinaryIndicator(e.identifier)})||[]);
                            const componentIndicators       = await Promise.all(e.body?.componentIndicators    ?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
                            const complementaryIndicators   = await Promise.all(e.body?.complementaryIndicators?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
                            return {
                                identifier             : e.identifier,
                                title                  : e.title,
                                globalTargetAlignment  : e.globalTargetAlignment,
                                componentIndicators    : componentIndicators    ?.flat(),
                                complementaryIndicators: complementaryIndicators?.flat(),
                                nationalIndicators     : e.body?.otherNationalIndicators||[],
                                headlineIndicators     : headlineIndicators?.flat(),
                                binaryIndicators       : binaryIndicators  ?.flat(),
                            }
                        }));
                        return targets;
    }

    async function loadNationalIndicatorData(indicatorType){

        const query = `(type eq '${indicatorType}')`;

        const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,500, 'updatedOn desc', 0, true),
                            KmDocumentsService.loadDocuments(query,500, 'updatedOn desc', 0, true)]);  

        return [...result[0].Items,
                ...result[1].Items.filter(e=>!result[0].Items?.find(draft=>draft.identifier == e.identifier))]

    }

    async function init(){
        isBusy.value = true;

        try{
            const response = await Promise.all([
                                GbfGoalsAndTargets.loadGbfGoalsWithIndicators(),
                                nationalReport7Store.loadNationalReport(),
                                // loadNationalTargets(),
                                loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA),
                                loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA)
                            ]);  

            globalGoals.value     = arrayToObject(response[0], {selectedComponent:[], selectedComplementary : []});
            indicators.value      = flattenIndicators(response[0]);
            // nationalTargets.value = arrayToObject(response[2]); 
            nationalIndicatorData.value = normalizeIndicatorData(indicators.value , response[3][0], response[2].map(e=>e.body));
            
            if(!nationalReport7Store.nationalReport.sectionIV){
                // add all global goals and its headline and binary indicators
                // H & B will be mandatory and COMP/COM will be optional
                const sectionIV = [];
                response[0].forEach(e=>{
                    const goal = {
                        gbfGoal : { identifier: e.identifier },
                        indicatorData: {
                            headline : [],
                            binary   : [],
                            complementary : [],
                            component     : []
                        }
                    }
                    e.headlineIndicators?.forEach((indicator)=>{
                        goal.indicatorData.headline.push({ indicator : { identifier:indicator.identifier}});
                    });
                    e.binaryIndicators?.forEach((indicator)=>{
                        goal.indicatorData.binary.push({ indicator : { identifier:indicator.identifier}});
                    });

                    sectionIV.push(goal);
                });

                nationalReport7Store.nationalReport.sectionIV = sectionIV;
            }
            else{
                //if there are any selected COMP/COM indicators add them to the goals selected indicators list
                nationalReport7Store.nationalReport.sectionIV?.forEach(e=>{
                    console.log(e)
                })
            }

            document.value = cloneDeep(nationalReport7Store.nationalReport);
            
                       
            setTimeout(()=>accordionToggle.value.toggle(true), 500)
            
        }
        catch(e){
            useLogger().error(e,  'Error loading Section III')
        }

        isBusy.value = false;
    }

    function normalizeIndicatorData(indicatorTerms, binaryIndicatorData, otherIndicatorData){
        const normalized = {};
        Object.keys(indicatorTerms).forEach(indicator=>{
            if(~indicator?.indexOf('KMGBF-INDICATOR-BIN')){
                normalized[indicator] = normalizeNationalBinaryData(indicatorTerms[indicator], 'binary', binaryIndicatorData.body)
            }
            else{
                const nationalData = otherIndicatorData.find(e=>e.indicator.identifier == indicator)
                if(nationalData)
                    normalizeNationalData(indicatorTerms[indicator],indicatorTerms[indicator].type, nationalData)
            }
        });

        return normalized;
    }
    function normalizeNationalData(indicator, type, nationalData){
        return {
            ...indicator,
            nationalData,
            type
        }

    }

    function normalizeNationalBinaryData(indicator, type, nationalBinaryData){
        const binaryQuestion = binaryIndicatorQuestions.find(e=>e.binaryIndicator == indicator.identifier);
        
        if(binaryQuestion){
            const nationalData = nationalBinaryData[binaryQuestion.key]
            return {
                ...indicator,
                nationalData : {
                    ...nationalData,
                    header : nationalBinaryData.header,
                    government : nationalBinaryData.government,
                },
                type,
                question:binaryQuestion
            }
        }

    }

    function onAddIndicatorDataClose(document){
        if(!document?.body)
            return;

        const isBinaryIndicator = document.body.header.schema == SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA;
        
        if(!isBinaryIndicator){
            nationalIndicatorData.value[document.body?.indicator?.identifier] = document.body;
        }
        else{
            nationalBinaryIndicatorData.value = document
        }
        
        for (const value in nationalTargets.value) {
            if (Object.hasOwnProperty.call(nationalTargets.value, value)) {
                const target = nationalTargets.value[value];
                target.indicators?.forEach((indicator, index)=>{
                    if(document.body.header.schema == SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA){
                        if(indicator.identifier == document.body.indicator.identifier){
                            indicator.nationalData = document.body;
                        }
                    }
                    else {
                        const binaryQuestion = binaryIndicatorQuestions.find(e=>e.binaryIndicator == indicator.identifier);
                        if(binaryQuestion){
                            const mapData = mapWithNationalBinaryData(indicator);
                            indicator.nationalData = mapData.nationalData;
                            
                        }
                    }
                })
            }
        }
    }

    function onIndicatorChange(selectedItems, type, goal){
        console.log(selectedItems, type, goal)

        if(!['complementary', 'component'].includes(type))
            return;

        sectionIVComputed.value
            ?.filter(e=>e.gbfGoal.identifier == goal)
            ?.forEach(e=>{
                console.log(e.indicatorData[type])
                const existingIndicators = e.indicatorData[type];
                selectedItems.forEach((identifier)=>{
                    if(!existingIndicators.find(e=>e.indicator.identifier == identifier.identifier))
                    existingIndicators.push({indicator : identifier})
                });
            })
    }

    function onMouseleave(target){
        mouseOverTarget.value = null;
    }
    function onMouseOver({target}){
        mouseOverTarget.value = target;
    }

    function canHeaderStick(identifier){
        const accordionClasses = window.document.querySelector('#assessment-target'+identifier + ' button')?.className?.split(' ');
        const isCollapsed = accordionClasses?.includes('collapsed');

        return !isCollapsed && mouseOverTarget.value?.identifier == identifier
    }

    function arrayToObject(response, additionalProps = {}){

        if(response?.length){
            const obj = {};
            response.forEach(e=>{
                obj[e.identifier] = {...e, ...additionalProps };
            });

            return obj;
        }
    }

    function mapNationalIndicatorData(response){

        if(response?.length){
            const obj = {};
            response.forEach(e=>{
                obj[e.body?.indicator?.identifier] = e.body;
            });

            return obj;
        }
    }

    function flattenIndicators(goals){
        let indicators = {};

        goals.forEach(e=>{
            indicators = {...indicators, ...arrayToObject(e.headlineIndicators, {type:'headline'})},
            indicators = {...indicators, ...arrayToObject(e.binaryIndicators, {type:'binary'})},
            indicators = {...indicators, ...arrayToObject(e.complementaryIndicators, {type:'complementary'})},
            indicators = {...indicators, ...arrayToObject(e.componentIndicators, {type:'component'})}
        })

        return indicators
    }   

    provide('kmWorkflowFunctions', {
        onPreReviewDocument,
        onPreSaveDraft,
        onPostSaveDraft,
        onPostReviewDocument,
        onPostClose,
        onGetDocumentInfo
    });

    provide("validationReview", {
        hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    });
    
    onMounted(()=>{
        // setTimeout(init, 200);
        init();
    })
</script>
<style scoped>
.assessment-target-accordion{
    top:110px;
}
.assessment-target-active{
    border: 3px solid#26638e;
}
.accordion-header.assessment-target-accordion.header{
    border-bottom: 3px solid#26638e;
}
</style>
