<template>
    <CCard>
        <CCardHeader>
            <slot name="header">{{t('indicatorData')}}</slot>
        </CCardHeader>
        <CCardBody>

            <div  v-if="isBusy">
                <km-spinner center="true"></km-spinner>
            </div>

                <CNav variant="tabs" role="tablist">
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 1"
                            @click="() => {tabPaneActiveKey = 1}"
                        >
                             {{t('headlineIndicators')}} 
                             <strong>({{ nationalHeadlineIndicators?.length || 0 }})</strong>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 2"
                            @click="() => {tabPaneActiveKey = 2}"
                        >
                             {{t('binaryIndicators')}}
                             <strong>({{ nationalBinaryIndicators?.length || 0 }})</strong>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 3"
                            @click="() => {tabPaneActiveKey = 3}"
                        >
                            {{t('componentIndicators')}}
                            <strong>({{ nationalComponentIndicators?.length || 0 }})</strong>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 4"
                            @click="() => {tabPaneActiveKey = 4}"
                        >
                            {{t('complementaryIndicators')}}
                            <strong>({{ nationalComplementaryIndicators?.length || 0 }})</strong>
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 5"
                            @click="() => {tabPaneActiveKey = 5}"
                        >{{t('otherNationalIndicators')}} 
                        <strong>({{ otherNationalIndicators?.length || 0 }})</strong>
                        </CNavLink>
                    </CNavItem>
                </CNav>
                <CTabContent>
                    <CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
                        <indicator-list indicator-type="otherHeadlineIndicators" v-if="nationalHeadlineIndicators" :indicators="nationalHeadlineIndicators" 
                            show-missing-alert="true" @on-record-delete="onRecordDelete"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
                        <indicator-list indicator-type="binaryIndicators" v-if="nationalBinaryIndicators" :indicators="nationalBinaryIndicators" 
                        show-missing-alert="true" @on-record-delete="onRecordDelete"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 3">
                        <div class="alert alert-info mt-2"  v-if="globalComponentIndicators">
                             {{t('componentIndicatorsNotLinked')}}                           
                        </div>
                        <indicator-list indicator-type="componentIndicators" v-if="nationalComponentIndicators" :indicators="nationalComponentIndicators"
                            @on-record-delete="onRecordDelete"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="contact-tab" :visible="tabPaneActiveKey === 4">
                        <div class="alert alert-info m-2" v-if="globalComplementaryIndicators">
                            {{t('complementaryIndicatorsNotLinked')}}                            
                        </div>
                        <indicator-list indicator-type="complementaryIndicators" v-if="nationalComplementaryIndicators" :indicators="nationalComplementaryIndicators"
                            @on-record-delete="onRecordDelete"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 5">
                        <div class="alert alert-info m-2" v-if="!otherNationalIndicators?.length">
                            {{t('missingNationalIndicators')}}                            
                        </div>
                        <indicator-list indicator-type="otherNationalIndicators" v-if="otherNationalIndicators?.length" :indicators="otherNationalIndicators"
                            @on-record-delete="onRecordDelete"></indicator-list>
                    </CTabPane>
                </CTabContent>
                <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal" message="Adding indicator to the list...">
                   
                </km-modal-spinner>

        </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/nr7-indicator-data-overview.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
  
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util';    
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import {getBinaryIndicatorQuestions } from '~/app-data/binary-indicator-questions'
    import {cloneDeep} from 'lodash';

    let document = ref({});
    let sectionIII;
    const props = defineProps({
        workflowActiveTab  : {type:Number, default:0 }
    }) 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }              = useI18n();
    const $toast                    = useToast();        
    const container = useAttrs().container;
    const nationalReport7Store = useNationalReport7Store();

    const globalIndicators          = ref({});
    let   nationalIndicatorData     = ref([]);
    let   nationalBinaryDatDocument = ref({});
    let   nationalTargets           = ref([]);
    const isBusy                    = ref(false);
    const showSpinnerModal          = ref(false);
    const tabPaneActiveKey          = ref(1)
    const selectedComplementary     = ref([]);
    const selectedComponent         = ref([]);

    const isEventDefined        = useHasEvents();
    
    const binaryIndicatorQuestions = computed(()=>getBinaryIndicatorQuestions(locale.value));

    const nationalHeadlineIndicators        = computed(()=>globalIndicators.value.headlineIndicators?.map(mapWithNationalRecords));
    const nationalBinaryIndicators          = computed(()=>globalIndicators.value.binaryIndicators?.map(mapBinaryIndicatorWithNationalData));
    const nationalComponentIndicators       = computed(()=>globalIndicators.value?.componentIndicators?.filter(e=>filterNationalIndicators(e, 'componentIndicators'))?.map(mapWithNationalRecords));
    const nationalComplementaryIndicators   = computed(()=>globalIndicators.value.complementaryIndicators?.filter(e=>filterNationalIndicators(e, 'complementaryIndicators'))?.map(mapWithNationalRecords));
    const otherNationalIndicators           = computed(()=>nationalTargets.value?.flatMap(e=>e.otherNationalIndicators)
                                                            ?.map(e=>{
                                                                e.title = e.value; 
                                                                e.type  = 'national'
                                                                return e;
                                                            })
                                                            ?.map(mapWithNationalRecords));
    const globalComplementaryIndicators = computed(()=>globalIndicators.value?.complementaryIndicators?.filter(filterNationalCompIndicators));
    const globalComponentIndicators     = computed(()=>globalIndicators.value?.componentIndicators?.filter(filterNationalComIndicators));

    function filterNationalIndicators(indicator, nationalIndicator){
        const nationalIndicators = nationalTargets.value?.flatMap(e=>e[nationalIndicator])
        
        //verify if the COM/COP indicators is selected in National targets
        if(nationalIndicators.find(e=>e.identifier == indicator.identifier)){
            indicator.isNational = true;
            return true;
        }

        // if not linked with national target check if there is national data
        // for COM/COP as its possible that the user selected them from the additional
        // dropdown method 

        return isOtherIndicatorData(indicator);
    }

    function isOtherIndicatorData(indicator){
        return nationalIndicatorData.value?.find(e=>e.body?.indicator?.identifier == indicator.identifier)
    }
    function filterNationalCompIndicators(item){
        return !item.isNational && !isOtherIndicatorData(item)
    }
    function filterNationalComIndicators(item){
        return !item.isNational && !isOtherIndicatorData(item)
    }
    

    function mapWithNationalRecords(indicator){
        const document = nationalIndicatorData.value?.find(e=>e.body?.indicator?.identifier == indicator.identifier)
        return {
            ...indicator,
            nationalData : document?.body,
            documentInfo : document
        }
    }

    function mapBinaryIndicatorWithNationalData(indicator){
        const binaryQuestion = binaryIndicatorQuestions.value?.find(e=>e.binaryIndicator == indicator?.identifier);
        const binaryDataDocument = nationalBinaryDatDocument.value?.body||{}
        let nationalData = {}
        
        if(binaryQuestion){
            if(binaryDataDocument)
                nationalData = binaryDataDocument[binaryQuestion.key] || {}
        }
        nationalData.header = binaryDataDocument.header;
        nationalData.government = binaryDataDocument.government;

        return {
            question : {...binaryQuestion},
            ...indicator,
            nationalData
        }
    }

    async function loadNationalTargets(){

        let query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`
        if(user.value?.government)
            query += ` and owner eq 'country:${user.value.government}'` ;
        const response = await KmDocumentsService.loadDocuments(query,500, undefined, 0, true)
        const targets  = await Promise.all(response?.Items?.map(async e=>{
                            const headlineIndicators = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)}));
                            const binaryIndicators   = await Promise.all(getAlignedGoalsOrTargets(e.body)?.map(e=>{return GbfGoalsAndTargets.loadGbfBinaryIndicator(e.identifier)}));
                            return {
                                identifier             : e.identifier,
                                title                  : e.title,
                                globalTargetAlignment  : e.body?.globalTargetAlignment,
                                componentIndicators    : e.body?.componentIndicators||[],
                                complementaryIndicators: e.body?.complementaryIndicators||[],
                                otherNationalIndicators     : e.body?.otherNationalIndicators||[],
                                headlineIndicators     : headlineIndicators?.flat(),
                                binaryIndicators       : binaryIndicators  ?.flat()
                            }
                        }));
        return targets;
    }

    async function loadNationalIndicatorData(schema:String){

        let query = `(type eq '${schema}')`;
        if(user.value?.government)
            query += ` and owner eq 'country:${user.value.government}'` ;
        
        const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,500, 'updatedOn desc', 0, true),
                            KmDocumentsService.loadDocuments(query,500, 'updatedOn desc', 0, true)]);  

        return [...result[0].Items,
                ...result[1].Items.filter(e=>!result[0].Items?.find(draft=>draft.identifier == e.identifier))]

    }

    async function init(){
        isBusy.value = true;
 
        const indicatorResponse = await Promise.all([
                                    GbfGoalsAndTargets.loadGbfHeadlineIndicator(),
                                    GbfGoalsAndTargets.loadGbfBinaryIndicator(),
                                    GbfGoalsAndTargets.loadGbfComponentIndicator(),
                                    GbfGoalsAndTargets.loadGbfComplementaryIndicator(),
                                    loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA),
                                    loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA),
                                    loadNationalTargets()
                                ]);

        globalIndicators.value = {
            headlineIndicators      : indicatorResponse[0],  
            binaryIndicators        : indicatorResponse[1],
            componentIndicators     : indicatorResponse[2],
            complementaryIndicators : indicatorResponse[3],
        }
        nationalIndicatorData.value = indicatorResponse[4];
        //Get the first response as binary data can only have one record per govermnet
        nationalBinaryDatDocument.value = indicatorResponse[5] ? indicatorResponse[5][0] : [];

        nationalTargets.value    = indicatorResponse[6];
        
        // selectedComplementary.value  = globalComplementaryIndicators.value.filter(e=>!e.isNational).map(e=>(e.title, e.identifier))   
        // selectedComponent    .value  = globalComplementaryIndicators.value.filter(e=>!e.isNational).map(e=>(e.title, e.identifier))
        
        isBusy.value = false;
    }


    async function onIndicatorChange(selectedItems, type){

        if(!['complementary', 'component'].includes(type))
            return;

        showSpinnerModal.value = true;

        try{
            for (let i = 0; i < selectedItems.length; i++) {
                const indicator = selectedItems[i];            
                let existing = false;

                if(type == 'component')
                    existing = nationalComponentIndicators.value.find(e=>e.identifier == indicator) 
                
                if(type == 'complementary')
                    existing = nationalComplementaryIndicators.value.find(e=>e.identifier == indicator)   
                
                if(!existing){
                    const document = EditFormUtility.buildEmptyDocument(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA);
                    document.indicator = { identifier : indicator };
                    const documentSaveResponse = await EditFormUtility.saveDraft(document);
                    documentSaveResponse.body = document;
                    
                    nationalIndicatorData.value.push(documentSaveResponse)
                    
                }
            };
            selectedComplementary.value = [];
            selectedComponent.value = [];
        }
        catch(error){
            useLogger().error(error, t('error'));
        }
        finally{
            showSpinnerModal.value = false;
        }
    }

    function onRecordDelete({identifier, type, indicator}): void{
        nationalIndicatorData.value.removeItem(e=>e.identifier == identifier);

        const headline = nationalHeadlineIndicators.value?.find(e=>e?.identifier == indicator.identifier)
        const component = nationalComponentIndicators.value?.find(e=>e.identifier == indicator.identifier)
        const complementary = nationalComplementaryIndicators.value?.find(e=>e.identifier == indicator.identifier);
        //fake update the so that computed prop can update 
        if(headline)
            headline.status = 'deleted';
        if(component)
            component.status = 'deleted';
        if(complementary)
            complementary.status = 'deleted';

    }
    

    init();
</script>
