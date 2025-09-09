<template>
    
    <CCard>
        <CCardHeader>
          <slot name="header"> <font-awesome-icon icon="fa fa-arrows-down-to-people" /> {{title}} </slot>
        </CCardHeader>
        <CCardBody>
            <on-boarding v-if="onBoardingSteps" teleport-to="#takeTourTeleport" :page-title="title" 
            :steps="onBoardingSteps" @on-tour-start="onTourStart" @on-tour-end="onTourEnd"></on-boarding>
        
            <CRow>
                <CCol col="12" sm="3" md="6"  xs="6">
                    <km-document-count id="partICountsTour" :published-count="publishedNationalRecords?.length"
                    :draft-count="draftNationalRecords?.length"
                    :request-count="requestCount">
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
                    </div>
                </CCallout>
                </CCol>
            </CRow>
                                              
            <tour-dummy-table v-if="tourStarted" id="nationalRecords"></tour-dummy-table>
                        
            <km-spinner v-if="isLoadingRecords" center ></km-spinner>
            <country-record-type-records class="national-records-list" v-if="nationalRecords?.length" :national-records="nationalRecords" 
                :view-route="viewRoute" :has-gbf-objectives="false"
                @on-delete-record="onRecordDelete" @on-edit-record="onEditRecord" ></country-record-type-records>        
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
    })

    const rowsPerPage              = UTILS.ROWS_PER_PAGE_300;
    const { t, locale }            = useI18n();
    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user }                 = useAuth();
    const schemaDetails            = useGetRealmSchema(props.schema);

    const draftNationalRecords     = ref<EDocumentInfo[]>([]);
    const publishedNationalRecords = ref([]);
    const isLoadingRecords         = ref(false);
    const tourStarted               = ref(false);

    const nationalRecords = computed(()=>{
        return [
            ...draftNationalRecords.value,
            ...publishedNationalRecords.value
        ]
    });

    const requestCount = computed(()=>
        draftNationalRecords.value?.filter((e:EDocumentInfo)=>e.workingDocumentLock)?.length
    )

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

    async function loadRecords(){
        try{
            isLoadingRecords.value = true;
            let query = `(type eq '${props.schema}')`

            if(schemaDetails.type == 'national' && user.value?.government)
                query += ` and owner eq 'country:${user.value.government}'` ;

            const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true),
                                KmDocumentsService.loadDocuments(query,rowsPerPage, 'updatedOn desc', 0, true)]);  
            draftNationalRecords.value     = result[0].Items;
            publishedNationalRecords.value = result[1].Items.filter(e=>!draftNationalRecords.value.find(draft=>draft.identifier == e.identifier))
            isLoadingRecords.value = false;
        }
        catch(e){
            useLogger().error(e)
        }
    }

    function onRecordDelete({identifier, type}): void{

        if(type != 'draft'){
            publishedNationalRecords.value = publishedNationalRecords.value.filter(e=>e.identifier != identifier)
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

    loadRecords();

</script>