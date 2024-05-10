<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <font-awesome-icon icon="fa fa-arrows-down-to-people" /> {{t('title')}} </slot>
        </CCardHeader>
        <CCardBody>
            <CRow>
                <CCol col="12" sm="3" md="6"  xs="6">
                    <km-document-count :published-count="publishedNationalTargets?.length"
                    :draft-count="draftNationalTargets?.length"
                    :request-count="requestCount">
                    </km-document-count>         
                </CCol>                                                   
                <CCol col="12" sm="9" md="6" xs="6">
                    <CCallout color="secondary">
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                
                    <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY" :title="t('goToOverview')" 
                                role="button" class="btn btn-secondary" 
                                icon="fa-wand-magic-sparkles">
                    </km-link> 

                    <CButton @click="loadRecords()" color="secondary">
                        <font-awesome-icon icon="fa-arrows-rotate"/>
                        {{t('refresh')}}
                    </CButton>
                    <CButton color="secondary" size="sm" @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW, {})">
                        <font-awesome-icon icon="fa-plus"/> {{t('submitNewTarget')}}
                    </CButton>
                    </div>
                </CCallout>
                </CCol>
            </CRow>
                                              

            <km-spinner v-if="isLoadingRecords" center ></km-spinner>
            <table class="table" v-if="nationalTargets?.length">
            <thead>
                <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">GBF goals and targets</th>
                <th scope="col">Status</th>
                <th scope="col">Updated on</th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(draft,  index) in nationalTargets" :key="draft.identifier">
                    <th scope="row" >{{ index+1 }}</th>
                    <td scope="row" class="col-5">{{lstring(draft.workingDocumentTitle||draft.title, locale)}}</td>
                    <td>
                        <goal-target-list :goal-targets="getAlignedGoalsOrTargets(draft.workingDocumentBody||draft.body)">
                        </goal-target-list>                           
                    </td>
                    <td>
                        <div v-if="draft.workingDocumentBody"><CBadge color="dark">Draft</CBadge></div>
                        <div v-if="!draft.workingDocumentBody"><CBadge color="success">Published</CBadge></div>
                        <div v-if="draft.workingDocumentLock"><CBadge color="danger">{{t('locked')}}</CBadge></div>
                    </td>
                    <td>
                        {{formatDate(draft.updatedOn)}}<br/>
                        {{ draft.updatedBy.firstName }} {{ draft.updatedBy.lastName }}
                    </td>
                    <td>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <km-link color="secondary"  class="btn-sm btn btn-secondary" icon="fa-search" :to="navigationUrl(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW, draft)" title="View"></km-link>
                        <CButton color="secondary" size="sm" :disabled="!canEdit || draft.workingDocumentLock" @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_EDIT, draft)">
                            <font-awesome-icon icon="fa-edit" /> Edit
                        </CButton>
                        <km-delete-record :document="draft" @on-delete="onRecordDelete"></km-delete-record>
                        </div>
                    </td>
                </tr>
            </tbody>
            </table>
          
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

    loadRecords();

</script>