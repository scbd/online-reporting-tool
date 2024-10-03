<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <font-awesome-icon icon="fa fa-arrows-down-to-people" /> {{t('title')}} </slot>
        </CCardHeader>
        <CCardBody>
            <on-boarding v-if="onBoardingSteps" teleport-to="#takeTourTeleport" :page-title="t('title')" 
            :steps="onBoardingSteps" @on-tour-start="onTourStart" @on-tour-end="onTourEnd"></on-boarding>
        
            <CRow>
                <CCol col="12" sm="3" md="6"  xs="6">
                    <km-document-count id="partICountsTour" :published-count="publishedNationalTargets?.length"
                    :draft-count="draftNationalTargets?.length"
                    :request-count="requestCount">
                    </km-document-count>         
                </CCol>                                                   
                <CCol col="12" sm="9" md="6" xs="6">
                    <CCallout color="secondary">
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                
                    <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY" :title="t('goToOverview')" 
                                role="button" class="btn btn-secondary" id="partIGoToOverview"
                                icon="fa-wand-magic-sparkles">
                    </km-link> 

                    <CButton @click="loadRecords()" color="secondary" id="partIRefreshTour">
                        <font-awesome-icon icon="fa-arrows-rotate"/>
                        {{t('refresh')}}
                    </CButton>
                    <CButton color="secondary" size="sm" id="partISubmitTour"
                        @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW, {})">
                        <font-awesome-icon icon="fa-plus"/> {{t('submitNewTarget')}}
                    </CButton>
                    </div>
                </CCallout>
                </CCol>
            </CRow>
                                              
            <tour-dummy-table v-if="tourStarted" id="nationalRecords"></tour-dummy-table>
                        
            <km-spinner v-if="isLoadingRecords" center ></km-spinner>
            <country-record-type-records class="national-target-list" v-if="nationalTargets?.length" :national-records="nationalTargets" 
                :view-route="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW"
                @on-delete-record="onRecordDelete" @on-edit-record="onEditRecord" ></country-record-type-records>        
        </CCardBody>
      
      </CCard> 
  </template>

<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-1/index.json"></i18n>

<script setup lang="ts">
    import { useI18n } from "vue-i18n"; 
    import { useStorage } from '@vueuse/core'
    import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util';    


    const rowsPerPage              = UTILS.ROWS_PER_PAGE_300;
    const { t, locale }            = useI18n();
    const { $appRoutes:appRoutes } = useNuxtApp();
    const stateTargetWorkflow      = useStorage('ort-target-workflow', { batchId : undefined });
    const draftNationalTargets     = ref([]);
    const publishedNationalTargets = ref([]);
    const isLoadingRecords         = ref(false);
    const tourStarted               = ref(false);

    const onBoardingSteps = [
        { attachTo: { element: '#tourWelcome' },               content: { title: t('tourWelcomeTitle')     , description: t('tourWelcomeContent') } },
        { attachTo: { element: '#partICountsTour' },           content: { title: t('partICountsTitle')     , description: t('partICountsContent') } },
        { attachTo: { element: '#partIGoToOverview' },             content: { title: t('partIGoToOverviewTitle')       , description: t('partIGoToOverviewContent') } },
        { attachTo: { element: '#partIRefreshTour' },               content: { title: t('partIRefreshTitle')         , description: t('partIRefreshContent') } },
        { attachTo: { element: '#partISubmitTour' },           content: { title: t('partISubmitTitle')     , description: t('partISubmitContent') } },
        { attachTo: { element: '.national-target-list #record' },        content: { title: t('partINationalTargetRecordTitle')  , description: t('partINationalTargetRecordContent') } },
        { attachTo: { element: '.national-target-list #linkedGbfTour' },        content: { title: t('partILinkedGbfTitle')  , description: t('partILinkedGbfContent') } },
        
        { attachTo: { element: '.national-target-list #recordStatusTour' },           content: { title: t('partIStatusTitle')     , description: t('partIStatusContent') } },
        { attachTo: { element: '.national-target-list #viewRecordTour' },           content: { title: t('partIViewTitle')     , description: t('partIViewContent') } },
        { attachTo: { element: '.national-target-list #editRecordTour' },           content: { title: t('partIEditTitle')     , description: t('partIEditContent') } },
        { attachTo: { element: '.national-target-list #deleteRecordTour' },           content: { title: t('partIDeleteTitle')     , description: t('partIDeleteContent') } },
        
        
    ];

    const canEdit = computed(()=>{
        return !stateTargetWorkflow.value.batchId
    });

    const nationalTargets = computed(()=>{
        return [
            ...draftNationalTargets.value,
            ...publishedNationalTargets.value
        ]
    });

    const requestCount = computed(()=>
        draftNationalTargets.value?.filter(e=>e.workingDocumentLock)?.length
    )

    function navigationUrl(route:String, draft:Object){
         
        const query = {};
        const path = route.replace(':identifier', draft?.identifier||draft?.header?.identifier);

        if(draft.workingDocumentBody)
            query.draft = true //open draft record view page

        return {
            path, query
        }
    }
    const navigateToPage = async (route:string, draft:any)=>{
        const {path, query} = navigationUrl(route, draft)

        await useNavigateAppTo(path, {query});

    }

    async function loadRecords(){
        try{
            isLoadingRecords.value = true;
            const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`

            const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true),
                                KmDocumentsService.loadDocuments(query,rowsPerPage, 'updatedOn desc', 0, true)]);  
            draftNationalTargets.value     = result[0].Items;
            publishedNationalTargets.value = result[1].Items.filter(e=>!draftNationalTargets.value.find(draft=>draft.identifier == e.identifier))
            isLoadingRecords.value = false;
        }
        catch(e){
            useLogger().error(e)
        }
    }

    function onRecordDelete({identifier, type}): void{

        if(type != 'draft'){
            publishedNationalTargets.value = publishedNationalTargets.value.filter(e=>e.identifier != identifier)
        }
        
        draftNationalTargets.value     = draftNationalTargets.value.filter(e=>e.identifier != identifier)
    }

    function onTourStart(){
        tourStarted.value = true
    }

    function onTourEnd(){
        tourStarted.value = false
    }
    async function onEditRecord(draft){
        await navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_EDIT, draft)
    }

    loadRecords();

</script>