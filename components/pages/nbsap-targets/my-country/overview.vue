<template>
    <div>
        <div class="justify-content-center">
            <div >
                <legend>{{t('welcome')}}</legend>
                <hr/>
            </div>  

            <CRow>
              <CCol :sm="6">
                <CCard>
                  <CCardBody>
                    <CCardTitle>{{t('partI')}}</CCardTitle>
                    <CCardText>{{t('nationalTarget')}}</CCardText>
                    <div class="d-grid gap-1 d-flex">
                        <km-link :to="appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I" title="Go to Part I" 
                            role="button" class="btn btn-primary"></km-link>
                        <CButton :disabled="disableActions"  @click="onValidate('partI')" color="secondary">
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
                        <km-link :to="appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_II" title="Go to Part II" 
                            role="button" class="btn btn-primary"></km-link>
                            
                        <CButton :disabled="disableActions" @click="onValidate('partII')" color="secondary">
                            <c-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"></c-spinner>
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
                        <CButton :disabled="disableActions" @click="onPublish()" color="primary" v-if="showPublishBtn">
                            <c-spinner v-if="isPublishing" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            {{t('publish')}}
                        </CButton>
                        <CButton :disabled="disableActions" @click="onValidate(undefined)" color="secondary">
                            <c-spinner v-if="isValidating" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            {{t('validatePartIAndPartII')}}
                        </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <validation ref="validationRef" @on-records-load="onRecordsLoad" @on-validation-finished="onValidationFinished"></validation>
                </CCol>
            </CRow>
        </div>

        <CModal scrollable class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showTargetsDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7">{{t('nationalTarget')}}</span>
                    <span v-if="missingTargets.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">{{t('targetMapping')}}</span>
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div id="nationalTargetsValidationEdit">
                    <div >
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
                                        <btn-new-target :query="{'globalTarget' : target.identifier}" :identifier="identifier"></btn-new-target>        
                                    </td>
                                </tr>
                            </tbody>                           
                        </table>
                        
                    </div>
                    
                </div>
            </CModalBody>
            <CModalFooter>
                <CButton @click="missingTargetDialogClose(missingTargets.schema)" color="success">{{t('close')}}</CButton>
                <CButton @click="missingTargetDialogProceed(missingTargets.schema)" color="danger">{{t('proceedAnyways')}}</CButton>
            </CModalFooter>
        </CModal>

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showConfirmDialog" >
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

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showSuccessDialog" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{t('successTitle')}}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CAlert color="success" class="d-flex align-items-center">
                    <font-awesome-icon icon="fa-solid fa-check" size="2x"/>
                    <span class="p-2">                             
                        {{t('successfulMessage')}}
                    </span>
                    <div v-if="security.role.isNAU()">               
                        {{t('successMessageNau')}}
                    </div>
                    <div v-if="security.role.isPA()">               
                        {{t('successMessagePa')}}
                    </div>
                </CAlert>
            </CModalBody>
            <CModalFooter>
                <CButton @click="successDialogClose()" color="secondary">{{t('close')}}</CButton>
            </CModalFooter>
        </CModal>

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showValidationErrorDialog" >
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

<i18n src="@/i18n/dist/components/pages/nbsap-targets/my-country/overview.json"></i18n>
<script setup lang="ts">

    import _ from 'lodash';
    import { KmSuspense, KmLink, KmNavLink, KmModalSpinner } from '@/components/controls'
    import validation from '@/components/pages/nbsap-targets/my-country/validation.vue';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import btnNewTarget from './btn-new-target.vue';
    import { sleep } from '@/utils';
    import { useStorage } from '@vueuse/core'
    import { useRealmConfStore } from '@/stores/realmConf';

    let globalTargets               = undefined;
    let userRecords                 = {}
    const {$appRoutes:appRoutes}    = useNuxtApp();
    const validationRef             = ref(null);
    const showPublishBtn            = ref(true);
    const isValidating              = ref(false);
    const isPublishing              = ref(false);
    const showTargetsDialog         = ref(false);
    const showConfirmDialog         = ref(false);
    const showSpinnerDialog         = ref(false);
    const showSuccessDialog         = ref(false);
    const confirmationPromise       = ref(null);
    const showValidationErrorDialog = ref(false);
    const missingTargets            = ref({});

    const { t }                     = useI18n();
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });

    const disableActions = computed(()=>isValidating.value || isPublishing.value)
    // const disableActions            = computed(()=>isValidating || isPublishing)
    async function onValidate(type:string = undefined){

        isValidating.value = true;
        
        try{
            await validationRef.value.validate(type);
        }
        catch(e){
            console.error(e);
        }
        isValidating.value = false;
    }

    async function onPublish(){
        
        isPublishing.value = true;
        
        try{
            await onValidate();
            const hasValidationErrors = [...(userRecords.nationalTargets||[]), ...(userRecords.nationalMappings||[])].some(e=>e.validationErrors);
            
            if(hasValidationErrors){
                showValidationErrorDialog.value = true;
                isPublishing.value = false;
                return;
            }

            //verify user has submitted national targets for all Global Indicators
            //and show dialog and move next step if he still wants to proceed
            const missingTargets = await findMissingGlobalTargets(userRecords.nationalTargets, 'gbfGoalsAndTargetAlignment' );
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
            const missingMappings = await findMissingGlobalTargets(userRecords.nationalMappings, 'globalGoalOrTarget' );
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
            console.error(e);
        }
        isPublishing.value = false;
    }

    function onRecordsLoad(records:object){
        
        if(!records.nationalRecords?.length && !records.nationalMappings?.length){
            showPublishBtn.value = false;
        }
    }

    function onValidationFinished(records:object){
        userRecords = records;
        console.log(records)
    }

    async function findMissingGlobalTargets(nationalTargets, field){
        
        const targets = _(nationalTargets).map(e=>{
            if(field == 'gbfGoalsAndTargetAlignment')
                return e.body[field]?.map(t=>t.identifier)
            
            return e.body[field]?.identifier;

        }).flatten().compact().uniq().value();
        

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
            const res = await useAPIFetch(`http://localhost:8000/api/v2023/national-reports/7/national-targets/${user.government||'scbd'}/publish`,{
                                            method: 'POST',
                                            query : {
                                                realm : realmConf.realm
                                            }
                                        });

            stateTargetWorkflow.value.batchId = res.batchId
        }
        catch(e){
            console.error(e);
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

    onMounted(() => {
        GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators().then(response=>{
            globalTargets = response;
        });
    })

</script>

<style scoped>

</style>