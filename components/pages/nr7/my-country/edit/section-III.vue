<template>
    <CCard>
      <CCardHeader>
        {{t('sectionIII')}} {{t('sectionIIIDescription')}}
      </CCardHeader>
      <CCardBody>
        
        <div  v-if="nationalReport7Store.isBusy || isBusy">
            <km-spinner></km-spinner>
        </div>{{ sectionIII }}
        <form v-if="!isBusy && !nationalReport7Store.isBusy && nationalReport7Store.nationalReport" name="editForm">          
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument" 
                :container="container">
                <template #submission>
                    <toggle-accordion class="float-end mr-1 mb-1 btn-xs"  ref="accordionToggle"
                    selector="#mapping-accordion .accordion-header button.accordion-button" v-if="nationalTargets?.length"></toggle-accordion>
                    <br>
                    <br>
                    <CAccordion always-open id="mapping-accordion">                    
                        <CAccordionItem :item-key="index+1" :visible="true" v-for="(target, index) in nationalTargets" :key="target"
                        @mouseover="onMouseOver(target)" @mouseleave="onMouseleave(target)">
                            <CAccordionHeader :id="'gbfTarget'+target.identifier" class="target-accordion"
                                :class="{'header header-sticky' : mouseOverTarget?.identifier == target?.identifier}">
                                {{lstring(target.title)}}                           
                            </CAccordionHeader>
                            <CAccordionBody> 
                                <km-form-group>
                                    <div class="card">
                                        <div class="card-body">
                                            <km-form-group name="additionalInformation" caption="Please briefly describe the main actions taken to implement this national target">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="target.sectionIII.mainActionsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>
                                            <km-form-group name="complementaryIndicators" caption="Please indicate the current level of progress towards this national target">
                                                <km-select
                                                    v-model="target.sectionIII.complementaryIndicators"
                                                    class="validationClass"
                                                    label="title"
                                                    track-by="identifier"
                                                    value-key="identifier"
                                                    placeholder="Please indicate the current level of progress towards this national target"
                                                    :options="[]"
                                                    :multiple="true"
                                                    :disabled="false"
                                                    :custom-label="customLabel"
                                                    :custom-selected-item="customSelectedItem"
                                                >
                                                </km-select>
                                            </km-form-group>
                                            <km-form-group name="additionalInformation" caption="Please provide a summary of progress towards this national target, including the main outcomes achieved, key challenges encountered, and different approaches that may be taken for further implementation">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="target.sectionIII.mainActionsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>

                                            <km-form-group name="additionalInformation" caption="Please provide examples or cases to illustrate the effectiveness of the actions taken to implement this national target. If needed, provide relevant web links or attach related materials or publications">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="target.sectionIII.mainActionsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>

                                            <km-form-group name="additionalInformation" caption="Please briefly describe how the implementation of this national target relates to progress in achieving related Sustainable Development Goals and associated targets and implementation of other related agreements ">
                                                <km-input-rich-lstring  :identifier="document.header.identifier" v-model="target.sectionIII.mainActionsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>
                                        </div>
                                    </div>
                                </km-form-group>
                                <km-form-group v-if="target.sectionIII?.indicators" >
                                    <!-- <div class="card">
                                        <div class="card-header bg-secondary" >
                                            Indicators
                                        </div>
                                        <div class="card-body"> -->
                                            <legend>Indicators</legend>
                                            <hr>
                                            <div class="card mb-3" v-for="indicator in target.sectionIII?.indicators" :key="indicator">
                                                <div class="card-header">
                                                    <!-- {{ indicator }} -->
                                                    {{ lstring(indicator?.title) }} 
                                                    <small>({{ indicator?.identifier }})</small>
                                                    <!-- <span class="float-end" v-if="indicator">
                                                        <add-indicator-data  :indicator="indicator" :raw-document="indicator.nationalData" :identifier="((indicator.nationalData||{}).header||{}).identifier"
                                                        :on-close="onAddIndicatorDataClose"></add-indicator-data>
                                                    </span> -->
                                                </div>
                                                <div class="card-body" v-if="indicator">
                                                    <!-- <missing-data-alert class="alert-sm" v-if="!indicator.nationalData"></missing-data-alert>  
                                                    <div v-if="indicator.nationalData">
                                                        <view-data :indicator-data="indicator.nationalData"></view-data>
                                                    </div> -->
                                                    <div v-if="indicator.identifier?.indexOf('KMGBF-INDICATOR-BIN')<0">
                                                        <missing-data-alert v-if="!Object.keys(indicator.nationalData||{})?.length && showMissingAlert"></missing-data-alert>    
                                        
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
                                        <!-- </div>
                                    </div> -->
                                </km-form-group>
                                
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>         
                    
                </template>
                <template #review>                
                    <view-nr7-section-II :identifier="nationalReport7Store.nationalReport.header.identifier" :document="nationalReport7Store.nationalReport"></view-nr7-section-II>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/section-III.json"></i18n>
<script setup>
  
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import addIndicatorData from './indicator-data/nr7-add-indicator-data.vue';
    import MissingDataAlert from './indicator-data/missing-data-alert.vue';
    import ViewData         from './indicator-data/nr7-view-indicator-data.vue';
    import {uniqBy, compact } from 'lodash';
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util'; 
    import {binaryIndicatorQuestions } from '~/app-data/binary-indicator-questions.js'

    let document = ref({});
    let sectionIII;
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
    const nationalIndicatorData = ref([]);
    const nationalBinaryIndicatorData = ref({});
    const isBusy                = ref(true);
    const accordionToggle      = ref(null);
    const mouseOverTarget      = ref(null);

    //Currently there is no other way but get it using currentInstance
    const currentVueInstance        = getCurrentInstance();

    const stakeholderLists = [
        {identifier: '1', title: 'Indigenous peoples and local communities,,'},
        {identifier: '1', title: 'Focal points for other multilateral environmental agreements,'},
        {identifier: '1', title: 'The Protocols and SDGs,  '},
        {identifier: '1', title: 'Subnational governments,'},
        {identifier: '1', title: 'Cities and other local authorities,'},
        {identifier: '1', title: 'Non-governmental organizations,'},
        {identifier: '1', title: 'Women\'s groups, youth groups,'},
        {identifier: '1', title: 'The business and finance community,'},
        {identifier: '1', title: 'The scientific community,'},
        {identifier: '1', title: 'Academia,'},
        {identifier: '1', title: 'Faith-based organizations'},
        {identifier: '1', title: 'Representatives of sectors related to or dependent on biodiversity,'},
        {identifier: '1', title: 'Citizens at large,'},
        {identifier: '1', title: 'Other stakeholders'},
        
    ]
    const policyInstrumentLists = [
        {identifier: '1', title: 'Adopted through legislation or otherwise by parliament'},
        {identifier: '1', title: 'Adopted by Council of Ministers, Office of the President/Prime Minister or equivalent whole-of-government body'},
        {identifier: '1', title: 'Adopted by Ministry of Environment or other sectoral ministry'},
        {identifier: '1', title: 'Integrated into the poverty reduction strategy, sustainable development strategy, national development plan, and other related strategies or plans'},
        {identifier: '1', title: 'Other (please specify)'},
    ]

    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }

    function cleanDocument(){
        const  clean = useKmStorage().cleanDocument({...nationalReport7Store.nationalReport});
        clean.sectionIII = undefined;
        return toRef(clean);
    }

    const onPostClose = async (document)=>{
        
        if(hasOnClose.value)
            emit('onClose', document);
        else{
            await useNavigateAppTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I);
        }
    }

    const onPostSaveDraft = async (document)=>{
        emit('onPostSaveDraft', document);
    }

    const onPostReviewDocument = async(document, newValidationReport)=>{
        validationReport.value = newValidationReport.value;
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
                                globalTargetAlignment  : e.globalTargetAlignment,
                                componentIndicators    : componentIndicators    ?.flat(),
                                complementaryIndicators: complementaryIndicators?.flat(),
                                nationalIndicators     : e.body?.nationalIndicators||[],
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
                                GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators(),
                                nationalReport7Store.loadNationalReport(),
                                loadNationalTargets(),
                                loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA),
                                loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA)
                            ]);            
            nationalTargets.value = response[2]; 
            nationalIndicatorData.value = response[3];
            if(response[4]?.length)//there can be only binary indicator data record per government
                nationalBinaryIndicatorData.value = response[4][0];

            document.value = nationalReport7Store.nationalReport?.body;
            sectionIII = nationalReport7Store.nationalReport.sectionIII;
            if(!sectionIII){
                nationalReport7Store.nationalReport.sectionIII = sectionIII = toRef([]);
            }

            // if(!sectionIII?.length){
                nationalTargets.value.forEach(e=>{
                    const indicators = [
                        ...(compact(uniqBy(e.headlineIndicators     ||[], 'identifier').map(e=>mapWithNationalData(e, 'headlineIndicators')))),
                        ...(compact(uniqBy(e.binaryIndicators       ||[], 'identifier').map(e=>mapWithNationalBinaryData(e, 'binaryIndicators')))),
                        ...(compact(uniqBy(e.componentIndicators    ||[], 'identifier').map(e=>mapWithNationalData(e, 'componentIndicators')))),
                        ...(compact(uniqBy(e.complementaryIndicators||[], 'identifier').map(e=>mapWithNationalData(e, 'complementaryIndicators')))),
                        ...(compact(uniqBy(e.nationalIndicators     ||[], 'identifier').map(e=>mapWithNationalData(e, 'nationalIndicators')))),
                    ]
                    // indicators.map(e=>e.identifier)
                    const nationalTarget = { 
                        identifier : e.identifier,
                        mainActionsInfo : {},
                        indicators :  indicators
                    };
                    e.sectionIII = nationalTarget;
                    sectionIII.value.push({nationalTarget});
                });
            // }
            // else{
            //     //remove any deleted one
            //     //add new targets
            // }
           
            nextTick(()=>accordionToggle.value.toggle(true))

            console.log(sectionIII)
        }
        catch(e){
            useLogger().error(e,  'Error loading Section III')
        }

        isBusy.value = false;
    }

    function mapWithNationalData(indicator, type){
        const nationalData = nationalIndicatorData.value?.find(e=>e.body?.indicator?.identifier == indicator.identifier)?.body
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
        console.log(document)
        if(!document?.body)
            return;

        const isBinaryIndicator = document.body.header.schema == SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA;
        
        if(isBinaryIndicator){
            let existingIndex = nationalIndicatorData.value.findIndex(e=>e.identifier == document.identifier);
            if(~existingIndex)
            nationalIndicatorData.value[existingIndex] = document;
            else 
                nationalIndicatorData.value.push({identifier:document.identifier, body : document.body});
        }
        else{
            nationalBinaryIndicatorData.value = document
        }
        
        sectionIII.value.forEach(e=>{
            e.nationalTarget?.indicators?.forEach((indicator, index)=>{
                if(document.body.header.schema == SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA){
                    if(indicator.identifier == document.body.indicator.identifier){
                        indicator.nationalData = document.body;
                    }
                }
                else {
                    const binaryQuestion = binaryIndicatorQuestions.find(e=>e.binaryIndicator == indicator.identifier);
                    if(binaryQuestion){
                        // const response = document.body[binaryQuestion?.key];
                        const mapData = mapWithNationalBinaryData(indicator);
                        indicator.nationalData = mapData.nationalData;
                        // indicator.question     = mapData.question;
                        
                    }
                }
                // return indicator
            })
            // return e;
        })
        console.log(sectionIII.value);
    }

    function onMouseleave(target){
        mouseOverTarget.value = null;
    }
    function onMouseOver({identifier}){
        mouseOverTarget.value = {identifier};
    }


    provide('kmWorkflowFunctions', {
        // onPreReviewDocument,
        // onPreSaveDraft,
        onPostSaveDraft,
        onPostReviewDocument,
        onPostClose
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
.target-accordion{
    top:110px;
}
</style>
