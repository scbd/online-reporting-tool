<template>
    
    <CCard>
        <CCardHeader>
          <slot name="header"> <font-awesome-icon icon="fa fa-arrows-down-to-people" /> {{title||t('records')}} </slot>
        </CCardHeader>
        <CCardBody>
            <on-boarding v-if="onBoardingSteps" teleport-to="#takeTourTeleport" :page-title="title" 
            :steps="onBoardingSteps" @on-tour-start="onTourStart" @on-tour-end="onTourEnd"></on-boarding>
        
            <CRow>
                <CCol col="12" sm="3" md="6"  xs="6">
                    <km-document-count id="partICountsTour" 
                    :published-count="publishCount" @on-published-click="onPublishedClick"
                    :draft-count="draftCount" @on-draft-click="onDraftClick"
                    :request-count="requestCount" @on-requested-click="onRequestedClick">
                    </km-document-count>         
                </CCol>                                                   
                <CCol col="12" sm="9" md="6" xs="6">
                    <CCallout color="secondary">
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                
                    <CButton @click="loadRecords()" color="secondary" id="partIRefreshTour">
                        <font-awesome-icon icon="fa-arrows-rotate"/>
                        {{t('refresh')}}
                    </CButton>        
                    <CButton color="secondary" size="sm" id="partISubmitTour"
                        @click="navigateToPage(newRoute, {})">
                        <font-awesome-icon icon="fa-plus"/> {{t('submitNew')}}
                    </CButton>
                    <slot name="actionButtons"></slot>
                    </div>
                </CCallout>
                </CCol>
            </CRow>
                                              
            <tour-dummy-table v-if="tourStarted" id="nationalRecords"></tour-dummy-table>
                        
            <km-spinner v-if="isLoadingRecords" center ></km-spinner>
            <pagination v-if="myRecordCount > 0" :recordCount="myRecordCount"  :recordsPerPage="recordsPerPage"
                    :currentPage="currentPage" @on-page-change="onPageChange" @on-records-per-page-changed="onRecordsPerPageChanged"  ></pagination>

            <country-record-type-records class="national-records-list" v-if="myRecords?.length" :national-records="myRecords" 
                :view-route="viewRoute" :has-gbf-objectives="false" :filter-by-title="filterByTitle"
                @on-delete-record="onRecordDelete" @on-edit-record="onEditRecord" ></country-record-type-records>      
                
            <pagination v-if="myRecordCount > 0" :recordCount="myRecordCount"  :recordsPerPage="recordsPerPage"
                :currentPage="currentPage" @on-page-change="onPageChange" @on-records-per-page-changed="onRecordsPerPageChanged"  ></pagination>

        </CCardBody>
      
      </CCard> 
  </template>

<!-- <i18n src="@/i18n/dist/components/pages/national-records/my-country/part-1/index.json"></i18n> -->
<i18n src="@/i18n/dist/components/controls/my-country/country-record-type-overview.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
    import { useI18n } from "vue-i18n"; 
    import { useStorage } from '@vueuse/core'
    import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments"; 

    const props = defineProps({
        title     : { type:String, required:true},  
        schema    : { type:String, required:true},  
        viewRoute : { type:String, required:true},
        editRoute : { type:String, required:true},
        newRoute  : { type:String, required:true},
        filterByTitle : { type:Boolean, require:false, default:true },
    })

    enum FilterType                { 
        published='published', 
        draft='draft', 
        requested='requested' 
    };
    const filterType               = ref(FilterType.published);
    const recordsPerPage           = ref(UTILS.ROWS_PER_PAGE_25);
    const currentPage              = ref(1);
    const { t, locale }            = useI18n();
    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user }                 = useAuth();
    const schemaDetails            = useGetRealmSchema(props.schema);

    const myRecords                = ref([]);
    const myRecordCount            = ref(0);
    const isLoadingRecords         = ref(false);
    const tourStarted               = ref(false);
    const publishCount             = ref(0);
    const draftCount               = ref(0);
    const requestCount             = ref(0);

    function navigationUrl(route:String, draft:EDocumentInfo){
         
        const query = {};
        const path = route.replace(':identifier', draft?.identifier);//||draft?.header?.identifier

        if(draft.workingDocumentBody)
            query.draft = true //open draft record view page

        return {
            path, query
        }
    }
    const navigateToPage = async (route:string, draft:EDocumentInfo)=>{
        const {path, query} = navigationUrl(route, draft)

        await useNavigateAppTo(path, {query});

    }

    async function loadRecords(type:FilterType){
        try{
            console.log(type)
            isLoadingRecords.value = true;
            let query = `(type eq '${props.schema}')`
            let recordPromise;
            if(type == 'published'){
                recordPromise = KmDocumentsService.loadDocuments(query,recordsPerPage.value, 'updatedOn desc', currentPage.value-1, true);
            }
            else if(type == 'draft'){
                recordPromise = KmDocumentDraftsService.loadDraftDocuments(`${query} and isRequest eq false`,recordsPerPage.value, 'updatedOn desc', currentPage.value-1, true, "mydraft");
            }
            else if(type == 'requested'){
                recordPromise = KmDocumentDraftsService.loadDraftDocuments(`${query} and isRequest eq true`,recordsPerPage.value, 'updatedOn desc', currentPage.value-1, true, "requested");
            }   

            if(recordPromise!== undefined){
                const result = await recordPromise;
                myRecords.value = result.Items;
                myRecordCount.value = result.Count;
            }
            
            isLoadingRecords.value = false;
        }
        catch(e){
            useLogger().error(e)
        }
    }

    async function loadCounts(){
        try{
            let query = `(type eq '${props.schema}')`
            const [published, draft, requested] = await Promise.all([
                KmDocumentsService.loadDocuments(query,1, 'updatedOn desc', 0, false),
                KmDocumentDraftsService.loadDraftDocuments(`${query} and isRequest eq false`,1, 'updatedOn desc', 0, false, "mydraft"),
                KmDocumentDraftsService.loadDraftDocuments(`${query} and isRequest eq true`,1, 'updatedOn desc', 0, false, "requested")
            ]);
            publishCount.value = published.Count;
            draftCount.value = draft.Count;
            requestCount.value = requested.Count;
        }
        catch(e){
            useLogger().error(e)
        }
    }

    function onRecordDelete({identifier, type}): void{

        if(type != 'draft'){
            myRecords.value = myRecords.value.filter(e=>e.identifier != identifier)
        }
        
        draftNationalRecords.value     = draftNationalRecords.value.filter(e=>e.identifier != identifier)
    }

    function onTourStart(){
        tourStarted.value = true
    }

    function onTourEnd(){
        tourStarted.value = false
    }
    async function onEditRecord(draft:EDocumentInfo){
        await navigateToPage(props.editRoute, draft)
    }

    function onPageChange(page:Number){
        currentPage.value = page;
        loadRecords(filterType.value);
    }

    function onRecordsPerPageChanged(rows:number){
        recordsPerPage.value = rows;
        loadRecords(filterType.value);
    }

    function onPublishedClick(){
        filterType.value = FilterType.published;
        loadRecords(filterType.value);
    }

    function onDraftClick(){
        filterType.value = FilterType.draft;
        loadRecords(filterType.value);
    }

    function onRequestedClick(){
        filterType.value = FilterType.requested;
        loadRecords(filterType.value);
    }

    onPublishedClick();
    loadCounts()
</script>