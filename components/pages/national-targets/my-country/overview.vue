<template>
    <div>
        <on-boarding v-if="onBoardingSteps" teleport-to="#takeTourTeleport" :page-title="t('tourTitle')" 
            :steps="onBoardingSteps" @on-tour-start="onTourStart" @on-tour-end="onTourEnd"></on-boarding>
        <div class="justify-content-center">
            <CRow>
              <CCol :sm="6" id="partITour">
                <CCard>
                  <CCardBody>
                    <CCardTitle >{{t('partI')}} {{t('nationalTarget')}}</CCardTitle>
                    <CCardText> 
                        <km-document-count id="partICountsTour" :published-count="userRecords.publishedNationalTargets?.length"
                            :draft-count="userRecords.draftNationalTargets?.length"
                            :request-count="userRecords.requestedNationalTargets?.length"></km-document-count>                     
                       
                    </CCardText>
                    <div class="d-grid gap-1 d-flex">
                        <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I" :title="t('goToPartI')" 
                           id="partIGoToTour" role="button" class="btn btn-secondary" icon="fa-square-up-right"></km-link>
                        <km-link :disabled="disableActions" :to="useLocalePath()(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW)" :title="t('submitNewTarget')" 
                           id="partISubmitTour" role="button" class="btn btn-secondary" icon="fa-plus"></km-link>
                        <CButton :disabled="disableActions"  @click="onValidate('partI')" color="secondary"
                            id="partIValidateTour">
                            <font-awesome-icon icon="fa-file-shield"></font-awesome-icon>
                            <km-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                            {{t('validatePartI')}}
                        </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol :sm="6" id="partIITour">
                <CCard>
                  <CCardBody>
                    <CCardTitle>{{t('partII')}} {{t('nationalMapping')}}</CCardTitle>
                    <CCardText> 
                        <km-document-count id="partIICountsTour" :published-count="userRecords.publishedNationalMappings?.length"
                            :draft-count="userRecords.draftNationalMappings?.length"
                            :request-count="userRecords.requestedNationalMappings?.length"></km-document-count>                                            
                    </CCardText>                    
                    <div class="d-grid gap-1 d-flex">
                        <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II" title="Go to Part II" 
                            id="partIIGoToTour" role="button" class="btn btn-secondary" icon="fa-square-up-right"></km-link>  
                        <CButton :disabled="disableActions" @click="onValidate('partII')" color="secondary"
                            id="partIIValidateTour">
                            <km-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
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
                        <CButton id="publishTour" :disabled="disableActions || !showPublishBtn" @click="onPublish()" color="secondary">
                            <km-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                            <font-awesome-icon icon="fa-bullhorn" :beat="isPublishing"></font-awesome-icon>
                            {{t('publish')}}
                        </CButton>
                        <CButton id="validateTour" :disabled="disableActions" @click="onValidate(undefined)" color="secondary">
                            <km-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                            <font-awesome-icon icon="fa-file-shield"></font-awesome-icon>
                            {{t('validatePartIAndPartII')}}
                        </CButton>
                        <CButton id="refreshTour" @click="onRefresh()" color="secondary" style="z-index: 1000;" :disabled="isLoading||isPublishing||isValidating">
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
                        <tour-dummy-table v-if="tourStarted" id="partI" title="National targets"></tour-dummy-table>
                        <tour-dummy-table v-if="tourStarted" id="partII" title="Global Goal/Targets mapping "></tour-dummy-table>
                        <validation ref="validationRef" @on-records-load="onRecordsLoad" @on-validation-finished="onValidationFinished"
                            @on-record-status-change="onRecordStatusChange"></validation>
                    </km-suspense>
                </CCol>
            </CRow>
        </div>

        <CModal scrollable class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showTargetsDialog=false}" :visible="showTargetsDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle style="width:100%">
                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7">{{t('nationalTarget')}} : {{ t('partI') }}</span>
                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">{{t('nationalMapping')}} : {{ t('partII') }}</span>
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
                            <th>{{ t('globalTargets') }}</th>
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

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" @close="() => {showSuccessDialog=false}" :visible="showSuccessDialog" >
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
                    <CAlert color="danger" class="d-flex align-items-center" v-if="hasValidationErrors">
                        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                        <span class="p-2">                                
                            {{t('validationErrorsMessage')}}
                        </span>
                    </CAlert>
                    <CAlert color="success" class="d-flex align-items-center" v-if="!hasValidationErrors">
                        <font-awesome-icon icon="fa-solid fa-check" size="2x"/>
                        <span class="p-2">                                
                            {{t('validationSuccessMessage')}}
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
//@ts-nocheck

    import _ from 'lodash';
    import { KmSuspense, KmLink, KmNavLink, KmModalSpinner } from '~/components/controls'
    import WorkflowActions from '@/components/actions/workflow-actions.vue';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import btnNewTarget from './btn-new-target.vue';
    import { sleep } from '@/utils';
    import { useStorage } from '@vueuse/core'
    import { useRealmConfStore } from '@/stores/realmConf';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';

    const validation = defineAsyncComponent(()=>import("@/components/pages/national-targets/my-country/validation.vue"));

    let globalTargets               = undefined;
    let userRecords                 = ref({})
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
    const tourStarted               = ref(false);
    const hasValidationErrors       = ref(false);

    const security                  = useSecurity();
    const { t }                     = useI18n();
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });

    const disableActions = computed(()=>isLoading.value || isValidating.value || isPublishing.value || !!stateTargetWorkflow.value.batchId)
    
    const onBoardingSteps = [
        { attachTo: { element: '#tourWelcome' },           content: { title: t('tourWelcomeTitle')     , description: t('tourWelcomeContent') } },
        { attachTo: { element: '#partITour' },                 content: { title: t('partITitle')           , description: t('partIContent') } },
        { attachTo: { element: '#partICountsTour' },           content: { title: t('partICountsTitle')     , description: t('partICountsContent') } },
        { attachTo: { element: '#partIGoToTour' },             content: { title: t('partIGoToTitle')       , description: t('partIGoToContent') } },
        { attachTo: { element: '#partISubmitTour' },           content: { title: t('partISubmitTitle')     , description: t('partISubmitContent') } },
        { attachTo: { element: '#partIValidateTour' },         content: { title: t('partIValidateTitle')   , description: t('partIValidateContent') } },
        { attachTo: { element: '#partIITour' },                content: { title: t('partIITitle')          , description: t('partIIContent') } },
        { attachTo: { element: '#partIICountsTour' },          content: { title: t('partIICountsTitle')    , description: t('partIICountsContent') } },
        { attachTo: { element: '#partIIGoToTour' },            content: { title: t('partIIGoToTitle')      , description: t('partIIGoToContent') } },
        { attachTo: { element: '#partIIValidateTour' },        content: { title: t('partIIValidateTitle')  , description: t('partIIValidateContent') } },
        { attachTo: { element: '#publishTour' },               content: { title: t('publishTitle')         , description: t('publishContent') } },
        { attachTo: { element: '#validateTour' },              content: { title: t('validateTitle')        , description: t('validateContent') } },
        { attachTo: { element: '#refreshTour' },               content: { title: t('refreshTitle')         , description: t('refreshContent') } },
        { attachTo: { element: '#partICountTour' },            content: { title: t('partICountTitle')      , description: t('partICountContent') } },
        { attachTo: { element: '.national-target-list #linkedGbfTour' },        content: { title: t('partILinkedGbfTitle')  , description: t('partILinkedGbfContent') } },
        { attachTo: { element: '.national-target-list #recordStatusTour' },           content: { title: t('partIStatusTitle')     , description: t('partIStatusContent') } },
        { attachTo: { element: '#partIICountTour' },           content: { title: t('partIICountTitle')     , description: t('partIICountContent') } },
    ];

    async function onValidate(type:string = undefined, showMessage = true){

        isValidating.value = true;
        hasValidationErrors.value = false;
        try{
            await validationRef.value.validate(type);
            const hasAnyValidationErrors = [...(userRecords.value.draftNationalTargets||[]), ...(userRecords.value.draftNationalMappings||[])].some(e=>e.errors);
            
            if(hasAnyValidationErrors){
                hasValidationErrors.value = true;
            }
            if(showMessage)
                showValidationErrorDialog.value = true;
        }
        catch(e){
            useLogger().error(e);
        }
        finally{
            isValidating.value = false;
        }
    }

    async function onPublish(){
        
        isPublishing.value = true;
        hasValidationErrors.value = false;
        
        try{
            await onValidate(undefined, false);
            const hasValidationErrors = [...(userRecords.value.draftNationalTargets||[]), ...(userRecords.value.draftNationalMappings||[])].some(e=>e.errors);
            
            if(hasValidationErrors){
                showValidationErrorDialog.value = true;
                isPublishing.value = false;
                return;
            }
            if(!globalTargets)
                globalTargets = await GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators();

            //verify user has submitted national targets for all Global Indicators
            //and show dialog and move next step if he still wants to proceed
            const userNationalTargets = [...(userRecords.value.draftNationalTargets||[]), ...(userRecords.value.publishedNationalTargets||[])]
            
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
            const userNationalMappings = [...(userRecords.value.draftNationalMappings||[]), ...(userRecords.value.publishedNationalMappings||[])]
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
        userRecords.value = records;
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
        const workflowId=lockedRecord?.workingDocumentLock?.lockID?.replace('workflow-', '');

        if(!workflowId)
            return;

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
        userRecords.value = records;
    }

    function onTourStart(){
        tourStarted.value = true
    }

    function onTourEnd(){
        tourStarted.value = false
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