<template>
    <div>
        <div class="justify-content-center">
            
            <CRow>
              <CCol :sm="6">
                <CCard>
                  <CCardBody>
                    <CCardTitle>{{t('partI')}}</CCardTitle>
                    <CCardText>{{t('nationalTarget')}}</CCardText>
                    <div class="d-grid gap-1 d-flex">
                        <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I" title="Go to Part I" 
                            role="button" class="btn btn-secondary" icon="fa-square-up-right"></km-link>
                        <km-link :disabled="disableActions" :to="useLocalePath()(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW)" title="Submit new target" 
                            role="button" class="btn btn-secondary" icon="fa-plus"></km-link>
                        <CButton :disabled="disableActions"  @click="onValidate('partI')" color="secondary">
                            <font-awesome-icon icon="fa-file-shield"></font-awesome-icon>
                            <c-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            {{t('validatePartI')}}
                        </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol :sm="6">
                <CCard>
                  <CCardBody>
                    <CCardTitle>{{t('partII')}}</CCardTitle>
                    <CCardText>{{t('nationalMapping')}} </CCardText>
                    <div class="d-grid gap-1 d-flex">
                        <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II" title="Go to Part II" 
                            role="button" class="btn btn-secondary" icon="fa-square-up-right"></km-link>  
                        <CButton :disabled="disableActions" @click="onValidate('partII')" color="secondary">
                            <c-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            <font-awesome-icon icon="fa-file-shield"></font-awesome-icon>
                            {{t('validatePartII')}}
                        </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol class="mt-1" :sm="12">
                <CCard>
                  <CCardBody>
                    <div class=" float-end d-grid gap-1 d-flex">
                        <CButton :disabled="disableActions || !showPublishBtn" @click="onPublish()" color="secondary">
                            <c-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            <font-awesome-icon icon="fa-bullhorn" :beat="isPublishing"></font-awesome-icon>
                            {{t('publish')}}
                        </CButton>
                        <CButton :disabled="disableActions" @click="onValidate(undefined)" color="secondary">
                            <c-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            <font-awesome-icon icon="fa-file-shield"></font-awesome-icon>
                            {{t('validatePartIAndPartII')}}
                        </CButton>
                        <CButton @click="onRefresh()" color="secondary" style="z-index: 1000;" :disabled="isLoading||isPublishing||isValidating">
                            <font-awesome-icon icon="fa-arrows-rotate" :spin="isLoading"/>
                            {{t('refresh')}}
                        </CButton>
                    </div>
                    <km-suspense>
                        <workflow-actions v-if="openWorkflow" :workflow="openWorkflow" @on-workflow-action="onWorkflowAction"></workflow-actions>
                    </km-suspense>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <km-suspense>
                        <validation ref="validationRef" @on-records-load="onRecordsLoad" @on-validation-finished="onValidationFinished"
                            @on-record-status-change="onRecordStatusChange"></validation>
                    </km-suspense>
                </CCol>
            </CRow>
        </div>

        <CModal scrollable class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showTargetsDialog=false}" :visible="showTargetsDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle style="width:100%">
                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7">{{t('nationalTarget')}}</span>
                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">{{t('nationalMapping')}}</span>
                    <hr/>
                    <CAlert color="danger" class="d-flex align-items-center">
                            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                            <span class="p-2">
                                <slot name="message">
                                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7">
                                        {{t('missingNationalTargets')}} ({{ missingTargets.targets.length }}).
                                    </span>
                                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">
                                        {{t('missingNationalMappings')}} ({{ missingTargets.targets.length }}).
                                    </span>
                                </slot>
                            </span>                            
                        </CAlert>
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>{{ t('globalTarget') }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(target, index) in missingTargets.targets">
                            <td width="83%">
                                {{ lstring(target.title) }}
                            </td>
                            <td>
                                <btn-new-target v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7" 
                                    :query="{'globalTarget' : target.identifier}" :identifier="identifier"></btn-new-target>        
                                <CButton  v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING" 
                                    color="secondary" size="sm" 
                                    @click="useNavigateAppTo({path: useLocalePath()($appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II), query:{'globalTarget' : target.identifier}})" >
                                    <font-awesome-icon icon="fa-solid fa-pen-to-square"/> Edit mapping
                                </CButton>
                            </td>
                        </tr>
                    </tbody>                           
                </table>
            </CModalBody>
            <CModalFooter>
                <CButton @click="missingTargetDialogClose(missingTargets.schema)" color="success">{{t('close')}}</CButton>
                <CTooltip content="It is important that you submit information for all Global Goals and Targets." placement="bottom" trigger="hover">
                    <template #toggler="{ on }">
                        <CButton v-on="on" @click="missingTargetDialogProceed(missingTargets.schema)" color="danger">{{t('proceedAnyways')}}</CButton>
                    </template>
                </CTooltip>
                
            </CModalFooter>
        </CModal>

        <CModal  class="show d-block" alignment="center" backdrop="static" @close="() => {showConfirmDialog=false}" :visible="showConfirmDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle class="bg-red">
                    {{t('confirmationTitle')}}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                {{t('confirmationMessage')}}
            </CModalBody>
            <CModalFooter>
                <CButton @click="confirmationDialogProceed()" color="success">{{t('yes')}}</CButton>
                <CButton @click="confirmationDialogClose()" color="danger">{{t('no')}}</CButton>
            </CModalFooter>
        </CModal>
        <km-modal-spinner :visible="showSpinnerDialog" :message="t('spinnerMessage')"></km-modal-spinner>

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showConfirmDialog=false}" :visible="showSuccessDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{t('successTitle')}}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CAlert color="success" class="d-flex">
                    <font-awesome-icon icon="fa-solid fa-check" size="2x"/>
                    <div class="p-2">                             
                        {{t('successfulMessage')}}
                        <strong>
                            <div v-if="security.role.isNationalAuthorizedUser(SCHEMAS.NATIONAL_TARGET_7)">               
                                {{t('successMessageNau')}}
                            </div>
                            <div v-if="security.role.isPublishingAuthority(SCHEMAS.NATIONAL_TARGET_7)">               
                                {{t('successMessagePA')}}
                            </div>
                        </strong>
                    </div>
                </CAlert>
                <CAlert color="info" class="d-flex mt-2">
                    <font-awesome-icon icon="fa-solid fa-exclamation" size="2x"/>
                    <span class="p-2">                             
                        {{t('nbsapMessage')}}
                    </span>
                </CAlert>
            </CModalBody>
            <CModalFooter>
                <CButton @click="successDialogClose()" color="secondary">{{t('close')}}</CButton>
            </CModalFooter>
        </CModal>

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showValidationErrorDialog=false}" :visible="showValidationErrorDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{t('validationErrorsTitle')}}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                    <CAlert color="danger" class="d-flex align-items-center">
                        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                        <span class="p-2">                                
                            {{t('validationErrorsMessage')}}
                        </span>
                    </CAlert>
            </CModalBody>
            <CModalFooter>
                <CButton @click="validationDialogClose()" color="secondary">{{t('close')}}</CButton>
            </CModalFooter>
        </CModal>
    </div>
</template>

<i18n src="@/i18n/dist/components/pages/national-targets/my-country/overview.json"></i18n>
<script setup lang="ts">

    import _ from 'lodash';
    import { KmSuspense, KmLink, KmNavLink, KmModalSpinner } from '@/components/controls'
    import WorkflowActions from '@/components/actions/workflow-actions.vue';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import btnNewTarget from './btn-new-target.vue';
    import { sleep } from '@/utils';
    import { useStorage } from '@vueuse/core'
    import { useRealmConfStore } from '@/stores/realmConf';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';

    const validation = defineAsyncComponent(()=>import("@/components/pages/national-targets/my-country/validation.vue"));

    let globalTargets               = undefined;
    let userRecords                 = {}
    const { $appRoutes:appRoutes, $api } = useNuxtApp();
    const validationRef             = ref(null);
    const showPublishBtn            = ref(true);
    const isValidating              = ref(false);
    const isPublishing              = ref(false);
    const isLoading                 = ref(false);
    const showTargetsDialog         = ref(false);
    const showConfirmDialog         = ref(false);
    const showSpinnerDialog         = ref(false);
    const showSuccessDialog         = ref(false);
    const confirmationPromise       = ref(null);
    const showValidationErrorDialog = ref(false);
    const missingTargets            = ref({});
    const openWorkflow              = ref(null);

    const security                  = useSecurity();
    const { t }                     = useI18n();
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });

    const disableActions = computed(()=>isLoading.value || isValidating.value || isPublishing.value || !!stateTargetWorkflow.value.batchId)
    
    async function onValidate(type:string = undefined){

        isValidating.value = true;
        
        try{
            await validationRef.value.validate(type);
        }
        catch(e){
            useLogger().error(e);
        }
        isValidating.value = false;
    }

    async function onPublish(){
        
        isPublishing.value = true;
        
        try{
            await onValidate();
            const hasValidationErrors = [...(userRecords.draftNationalTargets||[]), ...(userRecords.draftNationalMappings||[])].some(e=>e.errors);
            
            if(hasValidationErrors){
                showValidationErrorDialog.value = true;
                isPublishing.value = false;
                return;
            }
            if(!globalTargets)
                globalTargets = await GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators();

            //verify user has submitted national targets for all Global Indicators
            //and show dialog and move next step if he still wants to proceed
            const userNationalTargets = [...(userRecords.draftNationalTargets||[]), ...(userRecords.publishedNationalTargets||[])]
            
            const missingTargets = await findMissingGlobalTargets(userNationalTargets, ['globalTargetAlignment', 'globalGoalAlignment'] );
            if(missingTargets?.length){
                const userResponse = await showMissingTargetsDialog(SCHEMAS.NATIONAL_TARGET_7, missingTargets);
                if(userResponse == 'close'){
                    isPublishing.value      = false;
                    showTargetsDialog.value = false;
                    missingTargets.value    = {}
                    return;
                }
            }

            //verify user has submitted extra info (part II) for all  Global Indicators
            //and show dialog and move next step if he still wants to proceed
            const userNationalMappings = [...(userRecords.draftNationalMappings||[]), ...(userRecords.publishedNationalMappings||[])]
            const missingMappings = await findMissingGlobalTargets(userNationalMappings, ['globalGoalOrTarget'] );
            if(missingMappings?.length){
                const userResponse = await showMissingTargetsDialog(SCHEMAS.NATIONAL_TARGET_7_MAPPING, missingMappings);
                if(userResponse == 'close'){
                    isPublishing.value      = false;
                    showTargetsDialog.value = false;
                    missingTargets.value    = {}
                    return;
                }
            }

            showTargetsDialog.value = false;
            missingTargets.value    = {}

            //show user final confirmation
            const confirmationResponse = await showConfirmation();
            confirmationPromise.value = null;
            showConfirmDialog.value = false;
            if(confirmationResponse == 'close'){
                isPublishing.value      = false;
                return;
            }

            const batchId = await publishNationalTargets();
            //save batch id from api to local storage

            //disable all action buttons
            disableActionButtons();
            //show user message
            showSuccessDialog.value = true;
        }
        catch(e){
            useLogger().error(e);
        }
        isPublishing.value = false;
    }

    async function onRecordsLoad(records:object){
        isLoading.value = false;
        if(!records.draftNationalTargets?.length && !records.draftNationalMappings?.length){
            showPublishBtn.value = false;
        }
        else{
            showPublishBtn.value = true;
        }


        // verify if there any lock records
        openWorkflow.value=undefined;
        const lockedRecord = [...records.draftNationalTargets, ...records.draftNationalMappings].find(e=>e.workingDocumentLock);

        if(lockedRecord){
            await loadOpenWorkflow(lockedRecord);
        }
        else if (stateTargetWorkflow.value.batchId){
            const batchWorkflow =  await $api.kmWorkflows.getBatchWorkflowDetails(stateTargetWorkflow.value.batchId);
            if(batchWorkflow){                
                if(['workflowActivityInitiated', 'workflowActivityUpdated', 'workflowTimeOut', 'workflowCanceled', 'workflowRejected',].includes(batchWorkflow.status)){
                    stateTargetWorkflow.value.batchId = undefined;
                }
            }
        }
    }

async function loadOpenWorkflow(lockedRecord: any, iteration:number=0) {
  const workflowId=lockedRecord.workingDocumentLock.lockID.replace('workflow-', '');
  const workflow=await $api.kmWorkflows.getWorkflow(workflowId);
  if(workflow) {
    if(!workflow?.activities?.length && iteration < 5){
        await sleep(2000);
        return loadOpenWorkflow(lockedRecord, iteration+1)
    }
    else{
        openWorkflow.value=workflow;
        stateTargetWorkflow.value.batchId=undefined;
    }
  }
}

    async function onWorkflowAction(actionData){
        // console.log(actionData);
        showSpinnerDialog.value = true;
        const workflow =  await $api.kmWorkflows.getWorkflow(actionData.workflowId);
        if(workflow){
            openWorkflow.value = undefined;
            stateTargetWorkflow.value.batchId = undefined;
        }

        showSpinnerDialog.value = false;
        
    }

    function onValidationFinished(records:object){
        userRecords = records;
    }

    async function findMissingGlobalTargets(nationalTargets, fields: Array<string>){
        
        let targets = _(fields).map(field=>{
                            return nationalTargets.map(e=>{
                                const values = e.body[field];

                                if(Array.isArray(values))
                                    return values?.map(t=>t.identifier)
                                
                                return values?.identifier;
                            });
                        }).flattenDeep().compact().uniq().value();

        return globalTargets.filter(e=>{
            return !targets.includes(e.identifier)
        });
    }

    async function showConfirmation(){
        const dialogPromise = new Promise(async function (resolvePromise,reject){
            showConfirmDialog.value = true;
            confirmationPromise.value = resolvePromise;
        })

        return dialogPromise;
    }

    async function publishNationalTargets(){
        showSpinnerDialog.value = true;

        try{
            const { user }        = useAuth();
            const realmConfStore  = useRealmConfStore();
            const realmConf = realmConfStore.realmConf;
            validationRef.value.setProcessingStatus(true);
            const res = await useAPIFetch(`/api/v2023/national-reports/7/national-targets/${user.government||'scbd'}/publish`,{
                                            method: 'POST',
                                            query : {
                                                realm : realmConf.realm
                                            }
                                        });
            
            stateTargetWorkflow.value.batchId = res.batchId

            await sleep(10000);
        }
        catch(e){
            useLogger().error(e);
            isPublishing.value = false;
            validationRef.value.setProcessingStatus(false);
        }
        showSpinnerDialog.value = false;

    }

    async function showMissingTargetsDialog(schema:string, targets:Array<any>){

        const dialogPromise = new Promise(async function (resolvePromise,reject){

            if(targets?.length){
                showTargetsDialog.value = true;
                missingTargets.value = { targets, schema, resolvePromise };
            }
            else
                resolvePromise('proceed')
        })

        return dialogPromise;

        
    }

    async function missingTargetDialogClose(schema){
        missingTargets.value.resolvePromise('close')
    }
    async function missingTargetDialogProceed(schema){
        missingTargets.value.resolvePromise('proceed')
    }

    async function confirmationDialogClose(){
        confirmationPromise.value('close')
    }
    async function confirmationDialogProceed(){
        confirmationPromise.value('proceed')
    }

    function successDialogClose(){
        showSuccessDialog.value = false;
    }
    function validationDialogClose(){
        showValidationErrorDialog.value = false;
    }

    function disableActionButtons(){

    }
    function onRefresh(){
        isLoading.value = true;
        validationRef.value.refresh();
    }
    const onRecordStatusChange = async ({identifier, newDocument})=>{
        if(!openWorkflow.value){
            if(!newDocument)
                newDocument = await KmDocumentDraftsService.loadDraftDocument(identifier);
            loadOpenWorkflow(newDocument)
        }
    }
    
    onMounted(() => {     
        
    })

</script>

<style scoped>

</style>