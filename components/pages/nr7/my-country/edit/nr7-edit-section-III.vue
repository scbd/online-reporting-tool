<template>
    <CCard>
      <CCardHeader>
        {{t('sectionIII')}} {{t('sectionIIIDescription')}}
      </CCardHeader>
      <CCardBody>
        
        <div  v-if="nationalReport7Store.isBusy || isBusy">
            <km-spinner center></km-spinner>
        </div>
        <div v-if="(!nationalReport7Store.isBusy && !isBusy) && !nationalTargetsComputed" class="alert alert-danger">
            <strong>Missing National Targets</strong>
            <p>
                Your country has not published any national targets, 
                please submit national targets to pre populate section III of the 7th national report. 
                <KmNavLink class="btn btn-secondary btn-sm"  :title="t('Go to national targets')" :to="localePath(appRoutes.NATIONAL_TARGETS_MY_COUNTRY)" >
                </KmNavLink>
            </p>
        </div>
        <form v-if="!isBusy && !nationalReport7Store.isBusy && nationalReport7Store.nationalReport && nationalTargetsComputed" name="editForm">          
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument" 
                :container="container" :validate-server-draft="true">
                <template #submission>
                    <km-form-group name="sectionIII" class="visually-hidden">
                        <label class="form-label control-label" for="sectionIII">
                            <span >{{ t('sectionMandatory') }}</span>                                            
                        </label>
                    </km-form-group>      
                
                    <toggle-accordion class="float-end mr-1 mb-1 btn-xs"  ref="accordionToggle"
                    selector="#mapping-accordion .accordion-header button.accordion-button" v-if="nationalTargets"></toggle-accordion>
                    <br>
                    <br>
                    <CAccordion always-open id="mapping-accordion">          
                        <!-- nationalTargets           -->
                       
                        <CAccordionItem :item-key="index+1" :visible="true" 
                            v-for="(assessment, index) in sectionIIIComputed" :key="assessment" 
                            class="mb-2" :class="{'assessment-target-active' : mouseOverTarget?.identifier == assessment.target?.identifier}"
                            @mouseover="onMouseOver(assessment)" @mouseleave="onMouseleave(assessment)">
                            <CAccordionHeader :id="'assessment-target'+assessment.target?.identifier" 
                                class="assessment-target-accordion"
                                :class="{'p-0 header header-sticky' : canHeaderStick(assessment.target?.identifier)}">
                                {{lstring(nationalTargets[assessment.target.identifier]?.title)}}  
                                <strong v-if="assessment.targetType" class="ms-1">({{ capitalCase(assessment.targetType) }})</strong>
                            </CAccordionHeader>
                            <CAccordionBody> 
                                <km-form-group>
                                    <div class="card">
                                        <div class="card-body">
                                            <km-form-group required :name="'mainActionsInfo_'+ assessment.target?.identifier" caption="Please briefly describe the main actions taken to implement this national target">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.mainActionsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>
                                            <km-form-group required :name="'levelOfProgress_'+ assessment.target?.identifier" caption="Please indicate the current level of progress towards this national target">
                                                <km-select
                                                    v-model="assessment.levelOfProgress"
                                                    class="validationClass"
                                                    label="title"
                                                    track-by="identifier"
                                                    value-key="identifier"
                                                    placeholder="Please indicate the current level of progress towards this national target"
                                                    :options="progressAssessmentLists"
                                                    :disabled="false"
                                                    :custom-label="customLabel"
                                                    :custom-selected-item="customSelectedItem"
                                                    
                                                >
                                                </km-select>
                                            </km-form-group>
                                            <km-form-group required :name="'progressSummaryInfo_'+ assessment.target?.identifier" caption="Please provide a summary of progress towards this national target, including the main outcomes achieved, key challenges encountered, and different approaches that may be taken for further implementation">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.progressSummaryInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>

                                            <km-form-group required :name="'actionEffectivenessInfo_'+ assessment.target?.identifier" caption="Please provide examples or cases to illustrate the effectiveness of the actions taken to implement this national assessment. If needed, provide relevant web links or attach related materials or publications">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.actionEffectivenessInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>

                                            <km-form-group :name="'sdgRelationInfo_'+ assessment.target?.identifier" caption="Please briefly describe how the implementation of this national target relates to progress in achieving related Sustainable Development Goals and associated targets and implementation of other related agreements ">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.sdgRelationInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>
                                        </div>
                                    </div>
                                </km-form-group>
                                <km-form-group v-if="nationalTargets[assessment.target.identifier]?.indicators" >
                                    <legend>
                                       Indicator Data ({{ nationalTargetsComputed[assessment.target.identifier]?.indicators?.length }})
                                    </legend>
                                    <hr>
                                    <div class="card mb-3" v-for="indicator in nationalTargetsComputed[assessment.target.identifier]?.indicators" :key="indicator">
                                        <div class="card-header">
                                            <!-- {{ indicator }} -->
                                            <strong>{{ t(indicator.type) }}:</strong>
                                            {{ lstring(indicator?.title||indicator?.value) }} 
                                            <small class="fw-bold" v-if="indicator.type!='nationalIndicators'">({{ indicator?.identifier }})</small>
                                            <!-- <span class="float-end" v-if="indicator">
                                                <add-indicator-data  :indicator="indicator" :raw-document="indicator.nationalData" :identifier="((indicator.nationalData||{}).header||{}).identifier"
                                                :on-close="onAddIndicatorDataClose"></add-indicator-data>
                                            </span> -->
                                        </div>
                                        <div class="card-body" v-if="indicator">                                                    
                                            <div v-if="indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')<0">
                                                <missing-data-alert v-if="!Object.keys(indicator.nationalData||{})?.length"></missing-data-alert>    
                                
                                                <nr7-add-indicator-data :indicator="indicator" :raw-document="indicator.nationalData" 
                                                    :identifier="((indicator.nationalData||{}).header||{}).identifier" @on-post-save-draft="onAddIndicatorDataClose">
                                                </nr7-add-indicator-data>       
                                                <div v-if="indicator.nationalData">
                                                    <nr7-view-indicator-data :indicator-data="indicator.nationalData"></nr7-view-indicator-data>
                                                </div>
                                            </div>      
                                            <div v-if="indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')>=0" >  
                                                <nr7-add-binary-indicator-data :indicator="indicator" container=".nr7-add-binary-indicator-data-modal"
                                                    :identifier="indicator?.nationalData?.header?.identifier" 
                                                    @on-post-save-draft="onAddIndicatorDataClose">
                                                </nr7-add-binary-indicator-data>   
                                                <div v-if="indicator.nationalData">
                                                    <nr7-view-binary-indicator-data :indicator-data="indicator.nationalData" :questions="indicator?.question?.questions">
                                                    </nr7-view-binary-indicator-data>
                                                </div>    
                                            </div>
                                        </div>
                                    </div>
                                </km-form-group>
                                
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
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-III.json"></i18n>
<script setup>
  
    import { capitalCase } from 'change-case';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { sortBy } from "lodash";
    
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import addIndicatorData from './indicator-data/nr7-add-indicator-data.vue';
    import MissingDataAlert from './indicator-data/missing-data-alert.vue';
    import ViewData         from './indicator-data/nr7-view-indicator-data.vue';
    import _,{uniqBy, compact, cloneDeep } from 'lodash';
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
    const nationalTargets     = ref();
    const gbfMissingNationalTargets = ref();
    const nationalIndicatorData = ref([]);
    const nationalBinaryIndicatorData = ref({});
    const isBusy                = ref(true);
    const accordionToggle      = ref(null);
    const mouseOverTarget      = ref(null);
    const validationReport     = ref(null);
    const isEventDefined        = useHasEvents();
    const thesaurusStore        = useThesaurusStore ();
    

    const sectionIIIComputed = computed({ 
        get(){ 
            return sortBy(document.value.sectionIII, 'targetType').reverse()
        }
    });
    const nationalTargetsComputed = computed(()=>nationalTargets.value);
    const progressAssessmentLists = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.ASSESSMENT_PROGRESS)||[]));
    
    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }

    const cleanDocument = computed(()=>{
        let clean = {...nationalReport7Store.nationalReport};
        clean.sectionIII = sectionIIIComputed.value;

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
        if(newValidationReport.value?.errors)
            newValidationReport.value.errors = newValidationReport.value?.errors?.filter(e=>e.parameters=='sectionIII');

        validationReport.value     = newValidationReport.value;

        return newValidationReport.value;
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
                            const headlineIndicators = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)})||[]);
                            const binaryIndicators   = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfBinaryIndicator(e.identifier)})||[]);
                            const componentIndicators       = await Promise.all(e.body?.componentIndicators    ?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
                            const complementaryIndicators   = await Promise.all(e.body?.complementaryIndicators?.map(e=>{return GbfGoalsAndTargets.loadIndicator(e.identifier)})||[]);
                            return {
                                identifier             : e.identifier,
                                title                  : e.title,
                                globalTargetAlignment  : e.body?.globalTargetAlignment,
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

    async function findMissingGlobalTargets(nationalTargets){
        const globalTargets = await GbfGoalsAndTargets.loadGbfTargets()
        const targets = _(Object.keys(nationalTargets||{}))
                .map(e=>{
                    const target = nationalTargets[e];
                    const values = target.globalTargetAlignment;

                    if(Array.isArray(values))
                        return values?.map(t=>t.identifier)
                    
                    return values?.identifier;

                }).flattenDeep().compact().uniq().value();

        return globalTargets.filter(e=>{
            return !targets.includes(e.identifier)
        });
    }

    async function init(){
        isBusy.value = true;

        try{
            const response = await Promise.all([
                                GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators(),
                                nationalReport7Store.loadNationalReport(),
                                loadNationalTargets(),
                                loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA),
                                loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA),
                                thesaurusStore.loadDomainTerms(THESAURUS.ASSESSMENT_PROGRESS)
                            ]);            
            nationalTargets.value = arrayToObject(response[2]) || {}; 
            
            nationalIndicatorData.value = mapNationalIndicatorData(response[3]);
            if(response[4]?.length)//there can be only binary indicator data record per government
                nationalBinaryIndicatorData.value = response[4][0];

            document.value = nationalReport7Store.nationalReport;

            if(!document.value.sectionIII){
                nationalReport7Store.nationalReport.sectionIII = [];
            }

            const sectionIII = document.value.sectionIII || [];
            if(sectionIII?.length){
                
                //verify if the existing data in section iii exists in published targets
                sectionIII.removeItem((section, index)=>{
                    
                    if(!section.targetType){
                        if(section.target.identifier.startsWith('GBF-'))
                            section.targetType = 'global'
                        else
                            section.targetType = 'national';
                    }

                    if(section.targetType == 'national' && !nationalTargets.value[section.target.identifier])
                       return true
                    else if(section.targetType == 'global'){
                        // remove global indicators from list, there is possibility that new national target 
                        // may have been added aligned with this global one
                        const {target, targetType, others} = section;
                        if(Object.keys(others||{})?.length == 0)
                        return true
                    }
                });
            }

            //Add any new national targets to the list
            for (const target in nationalTargets.value) {
                if (Object.hasOwnProperty.call(nationalTargets.value, target)) {
                    const element = nationalTargets.value[target];
                    if(!sectionIII.find(e=>e.target?.identifier ==  element.identifier)){
                        sectionIII.push({target : {identifier : element.identifier}, targetType:'national'})
                    }
                }
            }
            // Map all national targets to indicator data
            if(sectionIII?.length){
                for (const value in nationalTargets.value) {
                    if (Object.hasOwnProperty.call(nationalTargets.value, value)) {
                        const target = nationalTargets.value[value];
                        const indicators = mapIndicatorsToData(target)
                        target.indicators = indicators;
                    }
                }
                
            }
            // Any global target which are not aligned with any national targets, countries will assess against those global targets
            const missingTargets = gbfMissingNationalTargets.value = await findMissingGlobalTargets(nationalTargets.value);
            missingTargets.forEach(e=>{
                if(!sectionIII.find(sec3=>sec3.target?.identifier ==  e.identifier)){
                    sectionIII.push({target : {identifier : e.identifier}, targetType:'global'})
                }
                if(!nationalTargets.value[e.identifier]){
                    const indicators = mapIndicatorsToData({
                        headlineIndicators:e.headlineIndicators, binaryIndicators:e.binaryIndicators})
                    nationalTargets.value[e.identifier] = {...e, indicators };
                }
            });

            // add any global targets to list of national targets temporarily to display titles on the grid.
            const globalTargets = await GbfGoalsAndTargets.loadGbfTargets()
            sectionIII.filter(e=>e.target?.targetType == 'global' || e.target?.identifier.startsWith('GBF-'))
            .forEach(e=>{
                if(!nationalTargets.value[e.target.identifier]){
                    const globalTarget = globalTargets.find(g=>g.identifier == e.target?.identifier)
                    const indicators = mapIndicatorsToData({
                        headlineIndicators:globalTarget.headlineIndicators, binaryIndicators:globalTarget.binaryIndicators})

                    nationalTargets.value[globalTarget.identifier] = {...globalTarget, indicators };
                }
            })

            nationalReport7Store.nationalReport.sectionIII = sectionIII;
            
            setTimeout(()=>accordionToggle.value.toggle(true), 500)
            
        }
        catch(e){
            useLogger().error(e,  'Error loading Section III')
        }

        isBusy.value = false;

      function mapIndicatorsToData(target) {
        return [
          ...(compact(uniqBy(target.headlineIndicators||[], 'identifier').map(e => mapWithNationalData(e, 'headlineIndicators')))),
          ...(compact(uniqBy(target.binaryIndicators||[], 'identifier').map(e => mapWithNationalBinaryData(e, 'binaryIndicators')))),
          ...(compact(uniqBy(target.componentIndicators||[], 'identifier').map(e => mapWithNationalData(e, 'componentIndicators')))),
          ...(compact(uniqBy(target.complementaryIndicators||[], 'identifier').map(e => mapWithNationalData(e, 'complementaryIndicators')))),
          ...(compact(uniqBy(target.nationalIndicators||[], 'identifier').map(e => mapWithNationalData(e, 'nationalIndicators')))),
        ];
      }
    }

    function mapWithNationalData(indicator, type){
        
        let nationalData = {}
        if(nationalIndicatorData.value)
            nationalData = nationalIndicatorData.value[indicator.identifier];
        
        return {
            ...indicator,
            nationalData,
            type
        }

    }

    function mapWithNationalBinaryData(indicator, type){
        const nationalBinaryData = nationalBinaryIndicatorData.value?.body||{};
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

    function arrayToObject(response){

        if(response?.length){
            const obj = {};
            response.forEach(e=>{
                obj[e.identifier] = e;
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
