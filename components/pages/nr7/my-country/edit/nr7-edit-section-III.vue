<template>
    <CCard>
      <CCardHeader>
        {{t('sectionIII')}} {{t('sectionIIIDescription')}}
      </CCardHeader>
      <CCardBody>
        
        <div  v-if="nationalReport7Store.isBusy || isBusy">
            <km-spinner center></km-spinner>
        </div>
        <div v-if="(!nationalReport7Store.isBusy && !isBusy) && !Object.keys(nationalTargetsComputed||[])?.length" class="alert alert-danger">
            <strong>{{ t('missingNationalTargets') }}</strong>
            <p>{{ t('missingNationalTargetsDescription') }} 
                <KmNavLink class="btn btn-secondary btn-sm"  :title="t('Go to national targets')" :to="localePath(appRoutes.NATIONAL_TARGETS_MY_COUNTRY)" >
                </KmNavLink>
            </p>
        </div>
        <form v-if="!isBusy && !nationalReport7Store.isBusy && nationalReport7Store.nationalReport && Object.keys(nationalTargetsComputed||[])?.length" name="editForm">          
            <km-form-workflow :focused-tab="props.workflowActiveTab" :document="cleanDocument"  
                :container="container" :validate-server-draft="true"  :admin-tags="['section-III']">
                <template #submission>
                    <div class="alert alert-info">
                        <strong v-if="Object.keys(nationalTargets).length">
                            {{ t('reportingNationalCount', [Object.keys(nationalTargets).length]) }}
                        </strong>
                        <strong v-if="gbfMissingNationalTargets.length" class="d-block">
                            {{ t('reportingGlobalCount',   [gbfMissingNationalTargets.length]) }}
                        </strong>
                    </div>                    
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
                        <!-- nationalTargets          -->
                       
                        <CAccordionItem :item-key="index+1" :visible="true" 
                            v-for="(assessment, index) in sectionIIIComputed" :key="assessment" 
                            class="mb-2" :class="{'assessment-target-active' : mouseOverTarget?.identifier == assessment.target?.identifier}"
                            @mouseover="onMouseOver(assessment)" @mouseleave="onMouseleave(assessment)">

                            <CAccordionHeader :id="'assessment-target'+assessment.target?.identifier" 
                                class="assessment-target-accordion" 
                                @click="setAccordionStatus(assessment.target?.identifier)"
                                :class="{'p-0 header header-sticky' : canHeaderStick(assessment.target?.identifier)}">
                                
                                {{ lstring(nationalTargets[assessment.target.identifier]?.title) }}

                                <strong v-if="assessment.targetType" class="ms-1">({{ capitalCase(assessment.targetType) }})</strong>
                            </CAccordionHeader>
                            <CAccordionBody  :id="'assessment-target-body-'+assessment.target?.identifier" >
                                <div v-if="!accordionItemVisibility[assessment.target?.identifier]">
                                    <km-spinner center></km-spinner>
                                </div>
                                <div v-if="accordionItemVisibility[assessment.target?.identifier]">
                                    <div class="alert alert-info" v-if="assessment.targetType == 'national'">
                                        <km-link target="_blank"
                                            :to="localePath(resolveSchemaViewRoute(SCHEMAS.NATIONAL_TARGET_7, assessment.target?.identifier))" >
                                            {{ lstring(nationalTargets[assessment.target.identifier]?.title) }}
                                        </km-link>
                                    </div>
                                    <km-form-group>
                                        <div class="card">
                                            <div class="card-body">
                                                <km-form-group required :name="'mainActionsSummary_'+ assessment.target?.identifier">
                                                    <template #caption>
                                                        <span class="d-none">
                                                            {{lstring(nationalTargets[assessment.target.identifier]?.title) }} :
                                                        </span>
                                                        {{ t('brieflyDescribeTheMainActions') }}
                                                    </template>
                                                    <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.mainActionsSummary" :locales="document.header.languages"></km-input-rich-lstring>
                                                </km-form-group>
                                                <km-form-group required :name="'levelOfProgress_'+ assessment.target?.identifier">
                                                    <template #caption>
                                                        <span class="d-none">
                                                            {{lstring(nationalTargets[assessment.target.identifier]?.title) }} :
                                                        </span>
                                                        {{ t('indicateTheCurrentLevelOfProgress') }}
                                                    </template>
                                                    <km-select
                                                        v-model="assessment.levelOfProgress"
                                                        class="validationClass"
                                                        label="title"
                                                        track-by="identifier"
                                                        value-key="identifier"
                                                        :placeholder="t('indicateTheCurrentLevelOfProgress')"
                                                        :options="progressAssessmentLists"
                                                        :disabled="false"
                                                        :custom-label="customLabel"
                                                        :custom-selected-item="customSelectedItem"
                                                        
                                                    >
                                                    </km-select>
                                                </km-form-group>
                                                <km-form-group required :name="'progressSummary_'+ assessment.target?.identifier">
                                                    <template #caption>
                                                        <span class="d-none">
                                                            {{lstring(nationalTargets[assessment.target.identifier]?.title) }} :
                                                        </span>
                                                        {{ t('provideASummaryOfProgress') }}
                                                    </template>
                                                    <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.progressSummary" :locales="document.header.languages"></km-input-rich-lstring>
                                                </km-form-group>

                                                <km-form-group required :name="'keyChallengesSummary_'+ assessment.target?.identifier">
                                                    <template #caption>
                                                        <span class="d-none">
                                                            {{lstring(nationalTargets[assessment.target.identifier]?.title) }} :
                                                        </span>
                                                        {{ t('keyChallengesSummary') }}
                                                    </template>
                                                    <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.keyChallengesSummary" :locales="document.header.languages"></km-input-rich-lstring>
                                                </km-form-group>

                                                <km-form-group required :name="'actionEffectivenessSummary_'+ assessment.target?.identifier">
                                                    <template #caption>
                                                        <span class="d-none">
                                                            {{lstring(nationalTargets[assessment.target.identifier]?.title) }} :
                                                        </span>
                                                        {{ t('provideExamplesOrCases') }}
                                                    </template>
                                                    <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.actionEffectivenessSummary" :locales="document.header.languages"></km-input-rich-lstring>
                                                </km-form-group>

                                                <km-form-group :name="'sdgRelationSummary_'+ assessment.target?.identifier">
                                                    <template #caption>
                                                        <span class="d-none">
                                                            {{lstring(nationalTargets[assessment.target.identifier]?.title) }} :
                                                        </span>
                                                        {{ t('brieflyDescribeImplementation') }}
                                                    </template>
                                                    <km-input-rich-lstring  :identifier="document.header.identifier" v-model="assessment.sdgRelationSummary" :locales="document.header.languages"></km-input-rich-lstring>
                                                </km-form-group>
                                            </div>
                                        </div>
                                    </km-form-group>
                                    <km-form-group v-if="nationalTargets[assessment.target.identifier]?.indicators" >
                                        <legend>
                                            <label :for="'indicatorData_'+assessment.target.identifier">
                                                <span class="d-none">{{lstring(nationalTargets[assessment.target.identifier]?.title) }} : </span>
                                                {{ t('indicatorData') }} ({{ nationalTargetsComputed[assessment.target.identifier]?.indicators?.length }})
                                            </label>
                                        </legend>
                                        <hr>
                                       
                                        <nr7-view-target-indicators :target-indicators="assessment?.indicatorData"
                                            :indicators-data="indicatorsData" :national-indicators="nationalIndicators">
                                            <template #header="{key,indicatorIdentifier, nationalIndicator}">
                                                <label :for="`indicatorData_${assessment.target.identifier}_${key}_${indicatorIdentifier}`">   
                                                    <span class="d-none">{{lstring(nationalTargets[assessment.target.identifier]?.title) }} : {{ t('indicatorData') + ' - ' }} </span> 
                                                    <km-term v-if="key!='national'" :value="indicatorIdentifier" :locale="locale"></km-term>
                                                    <span v-if="key=='national'">{{ lstring(nationalIndicator?.value, locale) }}</span>
                                                </label>
                                            </template>   
                                            <template #actionButtons="{key,indicatorData, indicator}">
                                                <nr7-add-indicator-data :indicator="indicator"  v-if="key!='binary'"
                                                        :identifier="indicatorData?.identifier" 
                                                        container=".nr7-add-indicator-data-modal"
                                                        @on-close="onAddIndicatorDataClose">
                                                    </nr7-add-indicator-data>  
                                                <nr7-add-binary-indicator-data :indicator="indicator"  v-if="key=='binary'"
                                                    container=".nr7-add-binary-indicator-data-modal"
                                                    :identifier="indicatorData?.identifier" 
                                                    @on-close="onAddIndicatorDataClose">
                                                </nr7-add-binary-indicator-data>   
                                            </template>
                                                                                         
                                        </nr7-view-target-indicators>   
                                            
                                    </km-form-group>                                
                                </div>
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>         
                    
                </template>
                <template #review>                
                    <nr7-view-section-III :identifier="nationalReport7Store.nationalReport?.header?.identifier" 
                        :document="cleanDocument" :locales="cleanDocument.header.languages"
                        :national-targets="nationalTargetsComputed"></nr7-view-section-III>
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>


      </CCardBody>
    </CCard>
    
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-III.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
  
    import { capitalCase } from 'change-case';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { sortBy } from "lodash";
    
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { nationalReport7Service } from '~/services/national-report-7-service';
    import addIndicatorData from './indicator-data/nr7-add-indicator-data.vue';
    import MissingDataAlert from './indicator-data/missing-data-alert.vue';
    import ViewData         from '../view/nr7-view-indicator-data.vue';
    import _,{uniqBy, compact, cloneDeep } from 'lodash';
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util'; 
    import {binaryIndicatorQuestions } from '~/app-data/binary-indicator-questions'
    import { Collapse } from '@coreui/coreui';

    let document = ref({});
    const props = defineProps({
        workflowActiveTab  : {type:Number, default:0 },
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
    const indicatorsData        = ref([]);
    const nationalIndicatorData = ref([]);
    const nationalBinaryIndicatorData = ref({});
    const isBusy                = ref(true);
    const accordionToggle      = ref(null);
    const mouseOverTarget      = ref(null);
    const validationReport     = ref(null);
    const isEventDefined        = useHasEvents();
    const thesaurusStore        = useThesaurusStore ();
    const accordionItemVisibility= ref({});
    let firstLoad = true;

    const sectionIIIComputed = computed({ 
        get(){ 
            const nationalTargets = document.value.sectionIII.filter(e=>e.targetType == 'national')
            const globalTargets   = document.value.sectionIII.filter(e=>e.targetType == 'global');
            return [...nationalTargets, ...globalTargets]
        }
    });

    const nationalIndicators      = computed(()=>{
        return Object.values(nationalTargets.value).map(e=>e.nationalIndicators||[]).flat();
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

        // Indicator data
        clean.sectionIII.forEach(section => {
            const indicatorData = nationalTargetsComputed.value[section.target.identifier];            
            section.indicatorData = {
                headline     : nationalReport7Service.indicatorDataDTO(indicatorData, 'headlineIndicators'),
                binary       : nationalReport7Service.indicatorDataDTO(indicatorData, 'binaryIndicators'),
                component    : nationalReport7Service.indicatorDataDTO(indicatorData, 'componentIndicators'),
                complementary: nationalReport7Service.indicatorDataDTO(indicatorData, 'complementaryIndicators'),
                national     : nationalReport7Service.indicatorDataDTO(indicatorData, 'nationalIndicators'),
            }
        });

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
        validationReport.value     = cloneDeep(newValidationReport);

        if(validationReport.value?.errors){
            validationReport.value.errors = validationReport.value?.errors?.filter(e=>e.parameters=='sectionIII');
            
            const ids = new Set(validationReport.value.errors.map(e=>e.property.replace(/^.*_/, '')))
            ids.forEach(async (identifier)=>{
                if(!accordionItemVisibility.value[identifier]){
                    accordionItemVisibility.value[identifier] = true;
                    await sleep(100)
                    toggleAccordionBody(identifier);
                }
            })

            await sleep(1000);
        }

        return validationReport.value;
        
    }
    
    const onPreReviewDocument = (document)=>{
        return document;
    }
     
    const onPreReviewParams = ()=>{
        return {validationSection:'sectionIII'};
    }

    const onGetDocumentInfo = async ()=>{
        return nationalReport7Store.nationalReport;
    }

    async function loadNationalTargets(){
        let query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`
        if(user.value?.government)
            query += ` and owner eq 'country:${user.value.government}'` ;
        const response = await KmDocumentsService.loadDocuments(query, 500, undefined, 0, true)
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
        return targets
        // .filter(e=>e.identifier == 'GBF-TARGET-11');
    }

    async function loadNationalIndicatorData(indicatorType){

        let query = `(type eq '${indicatorType}')`;
        if(user.value?.government)
            query += ` and owner eq 'country:${user.value.government}'` ;

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
        })
        // .filter(e=>e.identifier == 'GBF-TARGET-11');
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
            indicatorsData.value        = response[3]||[];
            if(response[4]?.length){//there can be only binary indicator data record per government
                nationalBinaryIndicatorData.value = response[4][0];
                indicatorsData.value.push(nationalBinaryIndicatorData.value);
            }

            document.value = nationalReport7Store.nationalReport;

            if(!document.value.sectionIII){
                nationalReport7Store.nationalReport.sectionIII = [];
            }

            let sectionIII = document.value.sectionIII || [];
            sectionIII = [];
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
                        const {target, targetType, ...others} = section;
                        if(Object.keys(others||{})?.length == 0)
                        return true
                    }
                    return false;
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

            // Filter out any global targets which are aligned with any national targets,
            // this will happen if countries align new NT after saving the NR7
            sectionIII =  sectionIII.filter(e=>e.targetType == 'national' || 
                                            (e.targetType == 'global' && !hasNationalTargetForGlobalTarget(e.target.identifier)));

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
                if(!hasNationalTargetForGlobalTarget(e.target.identifier)){
                    const globalTarget = globalTargets.find(g=>g.identifier == e.target?.identifier)
                    const indicators = mapIndicatorsToData({
                        headlineIndicators:globalTarget.headlineIndicators, binaryIndicators:globalTarget.binaryIndicators})

                    nationalTargets.value[globalTarget.identifier] = {...globalTarget, indicators };
                }
            })

            
            nationalReport7Store.nationalReport.sectionIII = sectionIII;
            
            
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

    function hasNationalTargetForGlobalTarget(targetIdentifier){
        return Object.values(nationalTargets.value||{})
                     .find(e=>e.globalTargetAlignment?.map(e=>e.identifier)?.includes(targetIdentifier))
    }   

    async function onAddIndicatorDataClose(document){
        
        if(!document?.body)
            return;
        
        await sleep(300);
        const isBinaryIndicator = document.body.header.schema == SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA;
        
        if(!isBinaryIndicator){
            nationalIndicatorData.value[document.body?.indicator?.identifier] = document.body;
        }
        else{
            nationalBinaryIndicatorData.value = document
        }
        const indicatorDataIndex = indicatorsData.value.findIndex(e=>e.identifier == document.identifier);
        if(~indicatorDataIndex){
            indicatorsData.value.splice(indicatorDataIndex, 1, document);
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

    function setAccordionStatus(identifier:string, status:boolean){
        setTimeout(() => {
           
            const hasShow = window.document.querySelector(`#assessment-target-body-${identifier}`)?.classList?.contains('show');
            
            accordionItemVisibility.value[identifier] = hasShow
            if(accordionItemVisibility.value[identifier])
                nationalReport7Store.setSectionIIIActiveAccordion(identifier);
            else
                nationalReport7Store.clearSectionIIIActiveAccordion(identifier);
    
        }, 400);
    }

    function toggleAccordionBody(identifier:string){
        try
        {

            const headerElement = `#assessment-target-body-${identifier}`;        
            const myCollapse    = window.document.querySelector(headerElement);
            if(myCollapse){
                const bsCollapse    = new Collapse(myCollapse, { toggle: false });
                bsCollapse.show();

                const accordionButton = window.document.querySelector('#assessment-target'+identifier + ' button');
                accordionButton?.classList?.remove('collapsed');
            }
        } 
        catch(e){
            //ignore error
        }
    }


    function onStepChange(step) {
        if(step==1 && firstLoad) {
            setTimeout(() => {
                const identifier = nationalReport7Store.sectionIIIActiveAccordion || sectionIIIComputed.value[0]?.target?.identifier;
                toggleAccordionBody(identifier);
                setAccordionStatus(identifier, true);
                scrollToElement(`#assessment-target${identifier}`, container);
                firstLoad = false;
            }, 200);
        }
    }
    

    provide('kmWorkflowFunctions', {
        onPreReviewDocument,
        onPreSaveDraft,
        onPostSaveDraft,
        onPostReviewDocument,
        onPreReviewParams,
        onPostClose,
        onGetDocumentInfo,
        onStepChange
    });

    provide("validationReview", {
        hasError : (name)=>validationReport.value?.errors?.find(e=>e.property == name)
    });

    defineExpose({cleanDocument, isBusy})
    
    onMounted(()=>{
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
