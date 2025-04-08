<template>
    <div class="mt-3">      
        
          <div class="card mt-3">
            <div class="card-header bg-secondary">
                {{t('nationalTargets')}}
                <strong id="partICountTour" v-if="nationalTargetRecords?.length" >({{ nationalTargetRecords?.length }})</strong>
            </div>
            <div class="card-body"> 
                <div v-if="isLoadingRecords" class="d-flex justify-content-center m-1"><km-spinner ></km-spinner></div>
                <country-record-type-records class="national-target-list" v-if="nationalTargetRecords?.length" :national-records="nationalTargetRecords" :view-route="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW"
                @on-delete-record="onDeleteRecord" @on-edit-record="onEditRecord" @on-record-status-change="onRecordStatusChange"></country-record-type-records>        
            </div>
          </div>
          
          <div class="card mt-3">
            <div class="card-header bg-secondary">
                {{t('globalMapping')}} 
                <strong id="partIICountTour" v-if="nationalMappingRecords?.length" >({{ nationalMappingRecords?.length }})</strong>
            </div>
            <div class="card-body">      
                <div v-if="isLoadingRecords" class="d-flex justify-content-center m-1"><km-spinner ></km-spinner></div>      
                <country-record-type-records class="national-mapping-list"
                    v-if="nationalMappingRecords?.length" :national-records="nationalMappingRecords" :view-route="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II_VIEW"
                    @on-delete-record="onDeleteRecord" @on-edit-record="onEditRecord" @on-record-status-change="onRecordStatusChange">
                    <template #recordTitle="{document}">
                        <km-term :value="document.body.globalGoalOrTarget" :locale="locale"></km-term>          
                    </template>
                </country-record-type-records>        
            </div>
          </div>

        <CModal  class="show d-block nationalTargetsValidationEdit" size="xl" alignment="center" backdrop="static" @close="() => {showEditDocumentModal=false}" :visible="showEditDocumentModal" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    <span v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7">{{lstring(editDocument.workingDocumentTitle||editDocument.title)}}</span>
                    <span v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">{{lstring(getGlobalTarget(editDocument.globalGoalOrTarget.identifier).title)}}</span>
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7">
                    <edit-target-part-1 :raw-document="editDocument" :workflow-active-tab="2"
                        :identifier="editDocument.header.identifier"
                        @on-close="onEditTargetClose"  @on-post-save-draft="onPostSaveDraft"
                        container=".nationalTargetsValidationEdit">
                    </edit-target-part-1>
                </div>
                <div v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">
                    <edit-target-part-2 :raw-document="editDocument" :workflow-active-tab="2"
                        :global-goal-or-target="editDocument.globalGoalOrTarget.identifier" 
                        :headline-indicators="getGlobalTarget(editDocument.globalGoalOrTarget.identifier).headlineIndicators"
                        :identifier="editDocument.header.identifier" @on-close="onEditTargetClose"  @on-post-save-draft="onPostSaveDraft"
                        container=".nationalTargetsValidationEdit">
                    </edit-target-part-2>
                </div>
            </CModalBody>
        </CModal>

    </div>
</template>

<i18n src="@/i18n/dist/components/pages/national-targets/my-country/validation.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    import  { KmSpinnerSuspense, KmSpinner, KmModalSpinner, KmTerm, KmLink
            } from "~/components/controls";
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { buildTargetMatrix } from "./part-2/util";
    import { useStorage } from '@vueuse/core';
    import { EditFormUtility } from "@/services/edit-form-utility";
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util';  


                    defineExpose({ validate, refresh, setProcessingStatus });
    const $emits =  defineEmits(['onRecordsLoad', 'onValidationFinished', 'onRecordStatusChange']);

    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });
    const EditTargetPart1 = defineAsyncComponent(()=>import("./part-1/edit-target-part-1.vue"));
    const EditTargetPart2 = defineAsyncComponent(()=>import('./part-2/edit-target-part-2.vue'));

    let   targetMapping = undefined;
    const rowsPerPage = 300;
    const { $appRoutes:appRoutes, $api } = useNuxtApp();
    const { user } = useAuth();
    const security = useSecurity();
    const route    = useRoute();
    const localePath  = useLocalePath()
    const { t, locale }       = useI18n(); 
    const { $eventBus } = useNuxtApp();

    const isValidatingRecords       = ref(false);
    const isLoadingRecords          = ref(false);
    const draftNationalTargets      = ref<EDocumentInfo[]>([]);
    const publishedNationalTargets  = ref<EDocumentInfo[]>([]);
    const draftNationalMappings     = ref<EDocumentInfo[]>([]);
    const publishedNationalMappings = ref<EDocumentInfo[]>([]);
    const editDocument              = ref<ENationalTarget7|ENationalTarget7>();
    const showEditDocumentModal     = ref(false);
    const showValidationMessageModal= ref(false);
    
    const disableActions = computed(()=>!!stateTargetWorkflow.value?.batchId)
    const nationalTargetRecords = computed(()=>{
        return [...draftNationalTargets.value, ...publishedNationalTargets.value]
    });
    const nationalMappingRecords = computed(()=>{
        return [...draftNationalMappings.value, ...publishedNationalMappings.value]
    });

    onMounted(()=> {
        isLoadingRecords.value = true;
        setTimeout(() => {
            init();    
        }, 100);
    })
    
    async function loadNationalRecords(query, draftList, publishedList){

        const response = await Promise.all([
            KmDocumentDraftsService.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true),
            KmDocumentsService.loadDocuments(query,rowsPerPage, 'updatedOn desc', 0, true)
        ]) 

        draftList.value = response[0].Items;
        publishedList.value = response[1].Items;
        response[0].Items.forEach(e=>{
            removeDraftFromPublished(e, publishedList);
        })
    }

    async function init(){

        var cat:EDocumentInfo = {}; 
        
        cat.d="";

        try{
            isLoadingRecords.value = true;    
            let query = '';
            if(user.value?.government)
                query = ` and owner eq 'country:${user.value.government}'` ; 

            const response = await Promise.all([
                GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators(), 
                loadNationalRecords(`(type eq '${SCHEMAS.NATIONAL_TARGET_7}' ${query})`, draftNationalTargets, publishedNationalTargets), 
                loadNationalRecords(`(type eq '${SCHEMAS.NATIONAL_TARGET_7_MAPPING}' ${query})`, draftNationalMappings, publishedNationalMappings)
            ]);
            targetMapping = buildTargetMatrix(response[0], draftNationalTargets.value, draftNationalMappings.value)
            $emits('onRecordsLoad', {
                draftNationalTargets : draftNationalTargets.value, 
                draftNationalMappings : draftNationalMappings.value,
                publishedNationalTargets : publishedNationalTargets.value, 
                publishedNationalMappings : publishedNationalMappings.value
            });

        }
        catch(e){
            useLogger().error(e)
        }
        finally{
            isLoadingRecords.value = false;
        }
        
    }

    async function validate(type:string){
        try{

            isValidatingRecords.value = true;  
            if(!type){
                await Promise.all([
                    validateDocuments(draftNationalTargets.value), 
                    validateDocuments(draftNationalMappings.value)
                ]);
            }
            else if(type == 'partI'){
                await validateDocuments(draftNationalTargets.value);
            }
            else if(type == 'partII'){
                await validateDocuments(draftNationalMappings.value)
            }

            $emits('onValidationFinished', {
                type, 
                draftNationalTargets : draftNationalTargets.value, 
                draftNationalMappings : draftNationalMappings.value,
                publishedNationalTargets : publishedNationalTargets.value, 
                publishedNationalMappings : publishedNationalMappings.value
            })
        }
        catch(e){
            useLogger().error(e)
        }

        isValidatingRecords.value = false;  
    }

    function refresh(){
        isLoadingRecords.value = true; 
        setTimeout(() => {
            init();
        }, 200);
    }

    function setProcessingStatus(isProcessing:Boolean, identifier:String){

        const documents = [
            ...(draftNationalTargets.value||[]),
            ...(draftNationalMappings.value||[])
        ]
        if(!identifier){
            documents.forEach(element => setStatus(element, isProcessing));
        }
        else{
            const document = documents.find(e=>e.identifier == identifier)
            if(document)
                setStatus(document, isProcessing);
        }

        function setStatus(document:Object, isProcessing:Boolean){
            document.showProcessing  = isProcessing;
            document.isValidating    = false;
            document.validated       = false;
        }
    }

    async function validateDocument(document:any){
        
        const { $api } = useNuxtApp();
        const data     = await $api.kmStorage.documents.validate(document);
 
        return data?.errors;

    }

    async function validateDocuments(documents){

        const promises = documents.map(async document=>{
            try{
                document.isValidating = true
                document.validated    = false;
                document.errors = undefined;
                const validationErrors = await validateDocument(document.body)
                if(validationErrors)
                    document.errors = [...validationErrors];
                
            }
            catch(e){
                useLogger().error(e);
                document.error = e;
            }
            document.validated = true;
            document.isValidating = false
        });

        return await Promise.all(promises);
    }

    function getGlobalTarget(identifier: string){
        return targetMapping.find(e=>e.identifier == identifier)
    }

    function onEditTargetClose(newDocument:Object){
        editDocument.value  = null;
        showEditDocumentModal.value = false;

        if(newDocument){
            let list:Array<Object> =  newDocument.header.schema == SCHEMAS.NATIONAL_TARGET_7 ? draftNationalTargets :  draftNationalMappings;
            let existingDocument   = list.value.find(e=>e.identifier == newDocument.header.identifier);
            if(!existingDocument){ // the record was in publishedList
                if(newDocument.header.schema == SCHEMAS.NATIONAL_TARGET_7){
                    existingDocument   = publishedNationalTargets.value?.find(e=>e.identifier == newDocument.header.identifier);
                    if(existingDocument){
                        draftNationalTargets.value.push({...existingDocument, workingDocumentBody:newDocument, workingDocumentTitle:newDocument.title});
                        
                        removeDraftFromPublished(existingDocument, publishedNationalTargets);
                    }
                    else 
                        existingDocument = newDocument;
                }
                else{
                    existingDocument   = publishedNationalMappings.value.find(e=>e.identifier == newDocument.header.identifier);
                    
                    if(existingDocument){
                        draftNationalMappings.value.push({...existingDocument, workingDocumentBody:newDocument});
                        removeDraftFromPublished(existingDocument, publishedNationalMappings);
                    }
                    else 
                        existingDocument = newDocument;
                }
                
            }
            else{
                existingDocument.workingDocumentBody = Object.assign(existingDocument.workingDocumentBody, newDocument)
            }

            $emits('onRecordsLoad', {
                draftNationalTargets : draftNationalTargets.value, 
                draftNationalMappings : draftNationalMappings.value,
                publishedNationalTargets : publishedNationalTargets.value, 
                publishedNationalMappings : publishedNationalMappings.value
            })
            validateDocuments([existingDocument])
        }
    }

    function onPostSaveDraft(newDocument:Object){

        const list:Array<Object> =  newDocument.type == SCHEMAS.NATIONAL_TARGET_7 ? draftNationalTargets :  draftNationalMappings;

        const index            = list.value.findIndex(e=>e.identifier == newDocument.identifier);
        const existingDocument = list.value.find     (e=>e.identifier == newDocument.identifier);
        if(existingDocument){
            Object.assign(existingDocument, newDocument);
            list[index] = existingDocument;
        }      
    }

    function removeDraftFromPublished(draftRecord, publishedList){
        const existing = publishedList.value.find(e=>e.identifier == draftRecord.identifier)
        const index = publishedList.value.indexOf(existing);
        if(index>=0)
            publishedList.value.splice(index, 1)
    }

    function onRecordStatusChange({workflowActivity, identifier, schema, newDocument}){
        
        const publishedList:Array<EDocumentInfo> =  schema == SCHEMAS.NATIONAL_TARGET_7 ? publishedNationalTargets :  publishedNationalMappings;
        const draftList:Array<EDocumentInfo>     =  schema == SCHEMAS.NATIONAL_TARGET_7 ? draftNationalTargets :  draftNationalMappings;

        const existingDocument = draftList.value.find(e=>e.identifier == identifier);

        if(workflowActivity == 'document-lock'){
            if(existingDocument){
                existingDocument.workingDocumentLock = 'workflow-fake'//fake workflow id
                if(!security.role.isPublishingAuthority())
                    existingDocument.showProcessing = false;
            }
        }
        else if(workflowActivity == 'create-revision-from-draft'){
            const draftIndex     = draftList.value.findIndex(e=>e.identifier == identifier);
            draftList.value.splice(draftIndex, 1);
            if(newDocument){
                const index          = publishedList.value.findIndex(e=>e.identifier == newDocument.identifier);
                if(index>0)
                    publishedList.value[index] = newDocument;
                else
                    publishedList.value.push(newDocument);
            }     
        }
        else if(workflowActivity == 'document-unlock'){
            const draftIndex     = draftList.value.findIndex(e=>e.identifier == identifier);
            draftList.value[draftIndex] = newDocument;
        }
        
        $emits('onRecordStatusChange', {workflowActivity, identifier, schema, newDocument}) 
    }

    const onEditRecord = (documentInfo:EDocumentInfo)=>{
        editDocument.value  = documentInfo.body;
        showEditDocumentModal.value = true;
    }

    const onDeleteRecord = ({identifier, type})=>{
        init();
    }
</script>

<style scoped>

</style>