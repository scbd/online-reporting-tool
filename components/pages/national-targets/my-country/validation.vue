<template>
    <div class="mt-3">      
        
          <div class="card mt-3">
            <div class="card-header bg-secondary">
                National targets 
            </div>
            <div class="card-body">            
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  
                    <tr v-if="isLoadingRecords">
                        <td colspan="4" >
                            <div class="d-flex justify-content-center m-1"><km-spinner ></km-spinner></div>
                        </td>
                    </tr>
                    <template  v-if="!isLoadingRecords">
                        <tr v-for="(document,  index) in draftNationalTargets" :key="document.identifier" :class="{'bg-danger':document.errors}">
                            <th scope="row">{{ index+1 }}</th>
                            <td>{{(document.workingDocumentTitle||document.title).en}}</td>                    
                            <td>
                                <CBadge color="info" v-if="document.isValidating">
                                        <km-spinner :message="t('validating')+ '...'"></km-spinner>
                                </CBadge>
                                <CBadge color="danger" v-if="!document.isValidating && document.errors">
                                    {{t('hasErrors')}} ({{ document.errors.length }})
                                </CBadge>
                                <CBadge color="success" v-if="document.validated && !document.isValidating && !document.errors">
                                    {{t('passedValidation')}}
                                </CBadge>
                                <CBadge color="dark" v-if="!document.workingDocumentLock">
                                    {{t('draftState')}}
                                </CBadge>
                                <CBadge color="danger" v-if="document.workingDocumentLock">
                                    {{t('lockedState')}}
                                </CBadge>
                            </td>
                            <td>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <CButton :disabled="isValidatingRecords" color="secondary" size="sm"  @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW, document)">
                                <font-awesome-icon icon="fa-search" /> View
                                </CButton>
                                <CButton :disabled="isValidatingRecords || disableActions || isEditAllowed(document)" color="secondary" size="sm" @click="onEditTarget(document)">
                                <font-awesome-icon icon="fa-edit" /> Edit
                                </CButton>
                            </div>
                            </td>
                        </tr>
                        <tr v-for="(document,  index) in publishedNationalTargets" :key="document.identifier" :class="{'bg-danger':document.errors}">
                            <th scope="row">{{ index+1 + (draftNationalTargets?.length||0) }}</th>
                            <td>{{(document.workingDocumentTitle||document.title).en}}</td>                    
                            <td>                        
                                <CBadge color="success">
                                    {{t('publishedState')}}
                                </CBadge>
                            </td>
                            <td>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <km-link color="secondary"  class="btn-sm btn btn-secondary" icon="fa-search" 
                                    :to="navigationUrl(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW, document)" title="View"></km-link>
                                <CButton :disabled="isValidatingRecords || disableActions || isEditAllowed(document)" color="secondary" size="sm" @click="onEditTarget(document)">
                                <font-awesome-icon icon="fa-edit" /> Edit
                                </CButton>
                            </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="card mt-3">
            <div class="card-header bg-secondary">
                Global Goal/Targets mapping
            </div>
            <div class="card-body">            
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-if="isLoadingRecords">
                        <td colspan="4" >
                            <div class="d-flex justify-content-center m-1"><km-spinner ></km-spinner></div>
                        </td>
                    </tr>
                    <template  v-if="!isLoadingRecords">
                        <tr v-for="(document,  index) in draftNationalMappings" :key="document.identifier" :class="{'bg-danger':document.errors}">
                            <th scope="row">{{ index+1 }}</th>
                            <td>
                                <km-term :value="document.body.globalGoalOrTarget" :locale="locale"></km-term>                        
                            </td>                    
                            <td>
                                <CBadge color="info" v-if="document.isValidating">
                                        <km-spinner :message="t('validating')+ '...'"></km-spinner>
                                </CBadge>
                                <CBadge color="danger" v-if="!document.isValidating && document.errors">
                                    {{t('hasErrors')}} ({{ document.errors.length }})
                                </CBadge>
                                <CBadge color="success" v-if="document.validated && !document.isValidating && !document.errors">
                                    {{t('passedValidation')}}
                                </CBadge>
                                <CBadge color="dark" v-if="!document.workingDocumentLock">
                                    {{t('draftState')}}
                                </CBadge>
                                <CBadge color="danger" v-if="document.workingDocumentLock">
                                    {{t('lockedState')}}
                                </CBadge>
                            </td>
                            <td>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <CButton :disabled="isValidatingRecords" color="secondary" size="sm"  @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II_VIEW, document)">
                                    <font-awesome-icon icon="fa-search" /> View
                                </CButton>
                                <CButton :disabled="isValidatingRecords || disableActions|| isEditAllowed(document)" color="secondary" size="sm" @click="onEditTarget(document)">
                                    <font-awesome-icon icon="fa-edit" /> Edit
                                </CButton>
                            </div>
                            </td>
                        </tr>

                        <tr v-for="(document,  index) in publishedNationalMappings" :key="document.identifier">
                            <th scope="row">{{ index+1 + (draftNationalMappings?.length||0) }}</th>
                            <td>
                                <km-term :value="document.body.globalGoalOrTarget" :locale="locale"></km-term>      
                            </td>                    
                            <td>                        
                                <CBadge color="success">
                                    {{t('publishedState')}}
                                </CBadge>
                            </td>
                            <td>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <km-link color="secondary"  class="btn-sm btn btn-secondary" icon="fa-search" :to="navigationUrl(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II_VIEW, document)" title="View"></km-link>
                                <CButton :disabled="isValidatingRecords || disableActions || isEditAllowed(document)" color="secondary" size="sm" @click="onEditTarget(document)">
                                <font-awesome-icon icon="fa-edit" /> Edit
                                </CButton>
                            </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
              </table>
            </div>
          </div>

        <CModal  class="show d-block nationalTargetsValidationEdit" size="xl" alignment="center" backdrop="static" :visible="showEditDocumentModal" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    <span v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7">{{lstring(editDocument.title)}}</span>
                    <span v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">{{lstring(getGlobalTarget(editDocument.globalGoalOrTarget.identifier).title)}}</span>
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7">
                    <edit-target-part-1 :raw-document="editDocument" :workflow-active-tab="2"
                        :identifier="editDocument.header.identifier"
                        :on-close="onEditTargetClose"  :on-post-save-draft="onPostSaveDraft"
                        container=".nationalTargetsValidationEdit">
                    </edit-target-part-1>
                </div>
                <div v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">
                    <edit-target-part-2 :raw-document="editDocument" :workflow-active-tab="2"
                        :global-goal-or-target="editDocument.globalGoalOrTarget.identifier" 
                        :headline-indicators="getGlobalTarget(editDocument.globalGoalOrTarget.identifier).headlineIndicators"
                        :identifier="editDocument.header.identifier" :on-close="onEditTargetClose"  :on-post-save-draft="onPostSaveDraft"
                        container=".nationalTargetsValidationEdit">
                    </edit-target-part-2>
                </div>
            </CModalBody>
        </CModal>

    </div>
</template>

<i18n src="@/i18n/dist/components/pages/national-targets/my-country/validation.json"></i18n>
<script setup lang="ts">
    import  { KmSpinnerSuspense, KmSpinner, KmModalSpinner, KmTerm, KmLink
            } from "@/components/controls";
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { useThesaurusStore } from "@/stores/thesaurus";
    import { buildTargetMatrix } from "./part-2/util";
    import { useStorage } from '@vueuse/core';
    import { EditFormUtility } from "@/services/edit-form-utility";

                    defineExpose({ validate, refresh });
    const $emits =  defineEmits(['onRecordsLoad', 'onValidationFinished']);

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

    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();
    const thesaurusStore  = useThesaurusStore();

    const isValidatingRecords                    = ref(false);
    const isLoadingRecords          = ref(false);
    const draftNationalTargets      = ref([]);
    const publishedNationalTargets  = ref([]);
    const draftNationalMappings     = ref([]);
    const publishedNationalMappings = ref([]);
    const editDocument              = ref(null);
    const editTargetMapping         = ref(null);
    const showEditDocumentModal     = ref(false);

    const disableActions = computed(()=>!!stateTargetWorkflow.value.batchId)

    onMounted(()=> {
        $eventBus.on('evt:server-pushNotification', onServerPushNotification)
        isLoadingRecords.value = true;
        setTimeout(() => {
            init();    
        }, 100);
    })

    onBeforeUnmount(()=>{
        $eventBus.off('evt:server-pushNotification', onServerPushNotification)
    })
    
    function navigationUrl(route, document){
         
         const query = {};
         const path = route.replace(':identifier', document?.identifier||document?.header?.identifier);
 
         if(document.workingDocumentBody)
             query.draft = true //open draft record view page
 
         return {
             path, query
         }
     }

    const navigateToPage = async (route:string, document:any)=>{
        const {path, query} = navigationUrl(route, document)

        await useNavigateAppTo({path, query});
    }

    const customUrl = (route:string, document:any)=>{
      const url = route.replace(':identifier', document?.identifier||document?.header?.identifier)
      return localePath(url);
    }

    async function loadNationalRecords(query, draftList, publishedList){

        const response = await Promise.all([
            kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true),
            KmDocumentsService.loadDocuments(query,rowsPerPage, 'updatedOn desc', 0, true)
        ]) 

        draftList.value = response[0].Items;
        publishedList.value = response[1].Items;
        response[0].Items.forEach(e=>{
            removeDraftFromPublished(e, publishedList);
        })
    }

    async function init(){
        try{
            isLoadingRecords.value = true;        
            const response = await Promise.all([
                GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators(), 
                loadNationalRecords(`(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`, draftNationalTargets, publishedNationalTargets), 
                loadNationalRecords(`(type eq '${SCHEMAS.NATIONAL_TARGET_7_MAPPING}')`, draftNationalMappings, publishedNationalMappings)
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

    async function validateDocument(document:any){
        
        const { $api } = useNuxtApp();
        const data     = await $api.kmStorage.documents.validate(document);
 
        return data?.errors;

    }

    async function validateDocuments(documents){

        //use foreach so that everything is validated together
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

    async function onEditTarget(document:Object){
        console.log(document);
        editDocument.value  = document.body;
        showEditDocumentModal.value = true;
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
                        draftNationalTargets.value.push({...existingDocument});
                        
                        removeDraftFromPublished(existingDocument, publishedNationalTargets);
                    }
                    else 
                        existingDocument = newDocument;
                }
                else{
                    existingDocument   = publishedNationalMappings.value.find(e=>e.identifier == newDocument.header.identifier);
                    
                    if(existingDocument){
                        draftNationalMappings.value.push({...existingDocument});
                        removeDraftFromPublished(existingDocument, publishedNationalMappings);
                    }
                    else 
                        existingDocument = newDocument;
                }
                
                $emits('onRecordsLoad', {
                    draftNationalTargets : draftNationalTargets.value, 
                    draftNationalMappings : draftNationalMappings.value,
                    publishedNationalTargets : publishedNationalTargets.value, 
                    publishedNationalMappings : publishedNationalMappings.value
                })
            }
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

    function isEditAllowed(document){
        return !!document?.workingDocumentLock
    }

    function removeDraftFromPublished(draftRecord, publishedList){
        const existing = publishedList.value.find(e=>e.identifier == draftRecord.identifier)
        const index = publishedList.value.indexOf(existing);
        if(index>=0)
            publishedList.value.splice(index, 1)
    }

    async function onServerPushNotification(data:Object){
        
        if(!data?.data)
            return;

        const notificationType = ['workflowActivityStatus', 'userNotification'];

        if(notificationType.includes(data.type) && data.data?.identifier){
            
            const publishedList:Array<Object> =  data.data.schema == SCHEMAS.NATIONAL_TARGET_7 ? publishedNationalTargets :  publishedNationalMappings;
            const draftList:Array<Object>     =  data.data.schema == SCHEMAS.NATIONAL_TARGET_7 ? draftNationalTargets :  draftNationalMappings;

            const existingDocument = draftList.value.find(e=>e.identifier == data.data.identifier);

            if(data.data.workflowActivity == 'document-lock'){
                existingDocument.workingDocumentLock = 'workflow-fake'//fake workflow id
            }
            else if(data.data.workflowActivity == 'create-revision-from-draft'){
                const newDocument = await KmDocumentsService.loadDocument(data.data.identifier);
                if(newDocument){
                    const index          = publishedList.value.findIndex(e=>e.identifier == newDocument.identifier);
                    const draftIndex     = draftList.value.findIndex(e=>e.identifier == newDocument.identifier);
                    publishedList.value[index] = newDocument;
                    draftList.value.splice(draftIndex, 1);
                    stateTargetWorkflow.value = undefined;
                }      
            }
            //'document-deleted'
        }
    }
</script>

<style scoped>

</style>