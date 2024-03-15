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
                            Headline Indicators
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 2"
                            @click="() => {tabPaneActiveKey = 2}"
                        >
                            Binary Indicators
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 3"
                            @click="() => {tabPaneActiveKey = 3}"
                        >
                            Component Indicators
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 4"
                            @click="() => {tabPaneActiveKey = 4}"
                        >
                            Complementary Indicators
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink
                            href="javascript:void(0);"
                            :active="tabPaneActiveKey === 5"
                            @click="() => {tabPaneActiveKey = 5}"
                        >
                            Other National Indicators
                        </CNavLink>
                    </CNavItem>
                </CNav>
                <CTabContent>
                    <CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
                        <indicator-list v-if="nationalHeadlineIndicators" :indicators="nationalHeadlineIndicators" show-missing-alert="true"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
                        <indicator-list v-if="nationalBinaryIndicators" :indicators="nationalBinaryIndicators" show-missing-alert="true"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 3">
                        <indicator-list v-if="nationalComponentIndicators" :indicators="nationalComponentIndicators"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="contact-tab" :visible="tabPaneActiveKey === 4">
                        <indicator-list v-if="nationalComplementaryIndicators" :indicators="nationalComplementaryIndicators"></indicator-list>
                    </CTabPane>
                    <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 5">
                        <indicator-list v-if="otherNationalIndicators?.length" :indicators="otherNationalIndicators"></indicator-list>
                    </CTabPane>
                </CTabContent>
                <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>

        </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/section-II.json"></i18n>
<script setup lang="ts">
  
    import IndicatorList from './indicator-list.vue';
    import Nr7Workflow              from '../NR7Workflow.vue'
    import viewNr7SectionII         from "@/components/pages/nr7/my-country/view/section-II.vue";
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useNationalReport7Store }    from '@/stores/nationalReport7';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { useStorage } from '@vueuse/core'
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util';    
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import {binaryIndicatorQuestions } from '~/app-data/binary-indicator-questions.js'

    let document = ref({});
    let sectionIII;
    const props = defineProps({
        workflowActiveTab  : {type:Number, default:0 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    }) 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {t, locale }              = useI18n();
    const $toast                    = useToast();        
    const container = useAttrs().container;
    const nationalReportStore = useNationalReport7Store();

    const globalIndicators     = ref({});

    let nationalIndicatorData  = ref([]);
    let nationalBinaryData     = ref([]);
    let nationalTargets        = ref([]);
    const isBusy = ref(false);
    const tabPaneActiveKey = ref(1)


    const nationalHeadlineIndicators        = computed(()=>globalIndicators.value.headlineIndicators?.map(mapWithNationalRecords));
    const nationalBinaryIndicators          = computed(()=>globalIndicators.value.binaryIndicators?.map(mapBinaryIndicatorWithNationalData));
    const nationalComponentIndicators       = computed(()=>globalIndicators.value?.componentIndicators?.filter(e=>filterNationalIndicators(e, 'componentIndicators'))?.map(mapWithNationalRecords));
    const nationalComplementaryIndicators   = computed(()=>globalIndicators.value.complementaryIndicators?.filter(e=>filterNationalIndicators(e, 'complementaryIndicators'))?.map(mapWithNationalRecords));
    const otherNationalIndicators           = computed(()=>nationalTargets.value?.flatMap(e=>e.otherNationalIndicators)?.map(mapWithNationalRecords));


    function filterNationalIndicators(indicator, nationalIndicator){
        return nationalTargets.value?.flatMap(e=>e[nationalIndicator]).find(e=>e.identifier == indicator.identifier)
    }

    function mapWithNationalRecords(indicator){
        const nationalData = nationalIndicatorData.value?.find(e=>e.body?.indicator?.identifier == indicator.identifier)?.body
        return {
            ...indicator,
            nationalData
        }
    }

    function mapBinaryIndicatorWithNationalData(indicator){
        const binaryQuestion = binaryIndicatorQuestions.find(e=>e.binaryIndicator == indicator?.identifier);
        const binaryDataDocument = nationalBinaryData.value?.body
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

    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }

    function cleanDocument(){
        const  clean = useKmStorage().cleanDocument({...nationalReportStore.nationalReportDraft});
        return toRef(clean);
    }

    async function loadNationalTargets(){

        const response = await KmDocumentsService.loadDocuments(`(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`,500, undefined, 0, true)
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

        const query = `(type eq '${schema}')`;
        
        const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,500, 'updatedOn desc', 0, true),
                            KmDocumentsService.loadDocuments(query,500, 'updatedOn desc', 0, true)]);  

        return [...result[0].Items,
                ...result[1].Items.filter(e=>!result[0].Items?.find(draft=>draft.identifier == e.identifier))]

    }

    async function init(){
        isBusy.value = true;

        nationalIndicatorData.value = await loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA);
        const binaryData            = await loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA);
        if(binaryData?.length)
            nationalBinaryData.value= binaryData[0];
        nationalTargets.value       = await loadNationalTargets(); 
        const indicatorResponse = await Promise.all([
                                    GbfGoalsAndTargets.loadGbfHeadlineIndicator(),
                                    GbfGoalsAndTargets.loadGbfBinaryIndicator(),
                                    GbfGoalsAndTargets.loadGbfComponentIndicator(),
                                    GbfGoalsAndTargets.loadGbfComplementaryIndicator(),
                                    // loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA),
                                    // loadNationalIndicatorData(SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA),
                                    // loadNationalTargets()
                                ]);

        globalIndicators.value = {
            headlineIndicators      : indicatorResponse[0],  
            binaryIndicators        : indicatorResponse[1],
            componentIndicators     : indicatorResponse[2],
            complementaryIndicators : indicatorResponse[3],
        }
        // nationalIndicatorData.value = indicatorResponse[4];
        // //Get the first response as binary data can only have one record per govermnet
        // nationalTargets.value       = indicatorResponse[5] ? indicatorResponse[5][0] : [];

        // nationalBinaryData.value    = indicatorResponse[6];

        isBusy.value = false;
    }

    init();
</script>
