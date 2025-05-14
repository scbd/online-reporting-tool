<template>
    <div>
        <div :class="{'dim-section':isBusy}">
            <div class="p-0 header header-sticky other-users-sticky-header"  v-if="otherCollaborators.length">
                <div class="container-fluid px-4 alert alert-danger" role="alert">      
                    <p>
                        {{t('collaboratorsMessage')}}
                        [<strong v-for="(user, index) in otherCollaborators" :key="user">
                            {{ user.name }}{{ index<otherCollaborators.length-1 ? ', ' : '' }}</strong>]                                
                    </p>                     
                </div>
            </div>
            <form-wizard  @on-tab-change="onChangeCurrentTab" ref="formWizard">
                <CRow v-if="(activeTab == workflowTabs.submission.index || activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)">
                    <CCol class="col-12">
                        <div class="action-buttons float-end mb-1">
                            <CButton @click="onSaveDraft()" color="primary" class="me-md-2" :disabled="isBusy">
                                <km-spinner v-if="validationReport.isSaving" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                                {{t('saveDraft')}}
                            </CButton> 
                            <CButton @click="onReviewDocument()" color="primary" class="me-md-2" :disabled="isBusy">
                                {{t('review')}}
                            </CButton>
                            <!-- <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton>   -->
                            <pdf-section  class="me-md-2 btn-secondary" element=".print-section" :title="printTitle"  
                            @on-pdf-document="onPrintDocument" @on-after-pdf="onAfterPrint"></pdf-section>
                            <print-section  class="me-md-2 btn-secondary" element=".print-section" 
                                @on-print-document="onPrintDocument" @on-after-print="onAfterPrint"></print-section> 
                            <CButton @click="onClose()" color="danger" class="me-md-2" :disabled="isBusy">{{t('close')}}</CButton>
                        </div>
                    </CCol>
                    <CCol class="col-12">
                        <slot name="validation-errors" :onJumpTo="onJumpTo">
                            <km-validation-errors  v-if="(activeTab == workflowTabs.submission.index && validationReport.errors?.length) || 
                                                    (activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)"
                                :report="validationReport" :container="container" @on-jump-to="onJumpTo">
                            </km-validation-errors>
                        </slot>  
                    </CCol>          
                </CRow>

                <tab-content :title="workflowTabs.introduction.title" :is-active="activeTab == workflowTabs.introduction.index">
                    <slot name="introduction" >
                        <CCard>
                            <CCardBody>

                                <cbd-article :query="articleQuery()" hide-cover-image="true" show-edit="true">
                                    <template #missingArticle>
                                        <CAlert color="success" v-bind:visible="true">
                                            <CAlertHeading>{{t('introduction')}}!</CAlertHeading>
                                            <hr />
                                            <p class="mb-0">{{t('introInfo')}}</p>
                                        </CAlert>
                                    </template>
                                </cbd-article>
                            </CCardBody>
                        </CCard>
                    </slot>
                </tab-content>
                <tab-content :title="workflowTabs.submission.title" v-show="activeTab == workflowTabs.submission.index" :is-active="true">
                    <slot name="submission"></slot>
                </tab-content>
                <tab-content :title="workflowTabs.review.title" :is-active="activeTab == workflowTabs.review.index || isPrinting">
                    <div>
                        <div class="print-section">
                            <slot name="review"></slot>
                        </div> 
                    </div>
                </tab-content>
                <tab-content v-if="$slots.publish" :title="workflowTabs.publish.title" :is-active="activeTab == workflowTabs.publish.index">
                    <CButton @click="onPublish()" color="success" class="me-md-2 btn-lg" :disabled="isBusy" v-if="!validationReport?.errors?.length">
                        <km-spinner v-if="validationReport.isPublishing" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                        {{t('publish')}}
                    </CButton> 
                    <slot name="publish"></slot>
                </tab-content>
                
                <CRow class="mt-3" v-if="(activeTab == workflowTabs.submission.index || activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)">
                    <CCol class="col-12">
                        <slot name="validation-errors" :onJumpTo="onJumpTo">
                            <km-validation-errors  v-if="(activeTab == workflowTabs.submission.index && validationReport.errors?.length) || 
                                                    (activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)"
                                :report="validationReport" :container="container" @on-jump-to="onJumpTo">
                            </km-validation-errors>
                        </slot> 
                    </CCol>   
                    <CCol class="col-12">
                        <div class="action-buttons float-end">
                            <CButton @click="onSaveDraft()" color="primary" class="me-md-2" :disabled="isBusy">
                                <km-spinner v-if="validationReport.isSaving" size="sm" variant="grow" aria-hidden="true" message=" "></km-spinner>
                                {{t('saveDraft')}}
                            </CButton> 
                            <CButton @click="onReviewDocument()" color="primary" class="me-md-2" :disabled="isBusy">
                                {{t('review')}}
                            </CButton>
                            <!-- <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton>   -->
                            <pdf-section  class="me-md-2 btn-secondary" element=".print-section" :title="printTitle"  
                            @on-pdf-document="onPrintDocument" @on-after-pdf="onAfterPrint"></pdf-section>
                            <print-section  class="me-md-2 btn-secondary" element=".print-section" 
                                @on-print-document="onPrintDocument" @on-after-print="onAfterPrint"></print-section> 
                            <CButton @click="onClose()" color="danger" class="me-md-2" :disabled="isBusy">{{t('close')}}</CButton>
                        </div>
                    </CCol>
                
                </CRow>
            </form-wizard>
        </div>

        <CModal  class="show d-block" alignment="center" backdrop="static" @close="() => {isRevealed=false; showOverwriteConfirmation=false}" 
            :visible="isRevealed && showOverwriteConfirmation" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{ t('overwriteConfirmationTitle') }}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <strong>{{ t('overwriteConfirmationMessage') }}</strong>
                <!-- <div>
                    {{ t('overwriteConfirmationMessage2') }}
                    <km-link :to="`copybrowserurl`">
                        link
                    </km-link>
                </div> -->
            </CModalBody>
            <CModalFooter>
                <CButton color="danger" @click="confirm({confirm:true})">{{t('overwriteConfirmationYes')}}</CButton>
                <CButton color="secondary" @click="confirm({confirm:false})">{{t('overwriteConfirmationNo')}}</CButton>
            </CModalFooter>
        </CModal>
        
        <CModal  class="show d-block" alignment="center" backdrop="static" @close="() => {isEditAllowed=false}" 
            :visible="!isEditAllowed" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    {{ t('unauthorizedAccess') }}
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <km-document-error document-error="403"></km-document-error>        
                
            </CModalBody>
            <CModalFooter>
                <CButton color="danger" @click="onClose">{{t('close')}}</CButton>
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
                            <div v-if="security.role.isPublishingAuthority(documentSchema)">               
                                {{t('successMessagePA')}}
                            </div>
                            <div v-else-if="security.role.isNationalAuthorizedUser(documentSchema)">               
                                {{t('successMessageNau')}}
                            </div>
                        </strong>
                    </div>
                </CAlert>
                <CAlert color="info" class="d-flex mt-2" v-if="$slots.additionalSuccessMessage">
                    <font-awesome-icon icon="fa-solid fa-exclamation" size="2x"/>
                    <span class="p-2">       
                        <slot name="additionalSuccessMessage">         
                        </slot>             
                    </span>
                </CAlert>
            </CModalBody>
            <CModalFooter>
                <CButton @click="successDialogClose()" color="secondary">{{t('close')}}</CButton>
            </CModalFooter>
        </CModal>
    </div>

</template>
<i18n src="@/i18n/dist/components/controls/edit/KmFormWorkflow.json"></i18n>
<script setup lang="ts">
//@ts-nocheck

    import {cloneDeep, isEqual} from 'lodash';
    import moment from 'moment';
    import FormWizard from './KmFormWizard.vue';
    import TabContent from './KmFormWizardTabContent.vue';
    import cbdArticle from '../../common/cbd-article.vue';
    import { useI18n } from 'vue-i18n';
    import { EditFormUtility }  from '@/services/edit-form-utility';
    import {useToast} from 'vue-toast-notification';
    import { scrollToElement } from '@/utils';
    import { useRealmConfStore } from '@/stores/realmConf';
    import { KmDocumentDraftsService } from '~/services/kmDocumentDrafts';
    import { useAppStateStore } from '@/stores/appState';
    import { SocketIOService } from '~/services/socket-io';
    import { type KmFormWorkflowFunctions } from '@/types/km-form-workflow-functions';


    const definedProps = defineProps({
        focusedTab                  : { type:Number, default:0 },
        tab                         : { type:String },
    	document                    : { type:Object, required:true  },
    	validateServerDraft         : { type:Boolean, required:false, default:true  }
    });
    
    const container     = useAttrs().container ?? 'body,html';
    const {t , locale}  = useI18n();
    const $toast        = useToast();
    const { user }      = useAuth();
    const security      = useSecurity();
    const { $api, $eventBus }      = useNuxtApp();
    const appState      = useAppStateStore();
    
    const isPrinting       = ref(false);
    const formWizard       = ref(null);
    const validationReport = ref({});
    const activeTab      = ref(null);   
    const isEditAllowed      = ref(true);
    const showOverwriteConfirmation = ref(false);
    const { isRevealed, reveal, confirm, cancel, onConfirm,  onCancel, } = useConfirmDialog();

    const showConfirmDialog         = ref(false);
    const showSuccessDialog         = ref(false);
    const confirmationPromise       = ref(null);
    const otherCollaborators = ref([]);

    let originalDocument = null
    let workflowFunctions:KmFormWorkflowFunctions;
    let saveDraftVersionTimer;
    let previousDraftVersion;
    let notifyCollaboratorsTimer;

    const workflowTabs = {
        // use individual compute so that on language change the text is updated
        introduction: { index : 0, title: computed(()=>t('introduction')) }, 
        submission  : { index : 1, title: computed(()=>t('submission')) },
        review      : { index : 2, title: computed(()=>t('review')) },
        publish     : { index : 3, title: computed(()=>t('publish')) },
    }

    let { focusedTab, tab, ...props } = toRefs(definedProps);
        
    const isBusy = computed(()=>validationReport.value?.isSaving || validationReport.value?.isAnalyzing || validationReport.value?.isPublishing);
    const printTitle = computed(()=>{
        let title = lstring(props.document.value?.title||'', locale);
        if(title?.trim() == '')
            title = `${props.document.value?.header?.schema?.toLowerCase()}`;

        return `${title}-draft`;
    });
    const documentSchema = computed(()=>props.document.value?.header?.schema);

    const onChangeCurrentTab = async (index)=>{
        if(index == activeTab.value)
            return;
        activeTab.value = index;
        if([workflowTabs.review.index].includes(activeTab.value)){
            onReviewDocument(true);
        }
        else if(workflowTabs.publish.index == activeTab.value){
            await onReviewDocument(true)
            if(validationReport.value?.errors?.length){
                formWizard.value?.selectTab(workflowTabs.review.index)
            }
            else{
                activeTab.value = workflowTabs.publish.index;
                formWizard.value?.selectTab(workflowTabs.publish.index)
            }
        }
    }    

    async function onReviewDocument(tabChanged){
        if(!tabChanged && activeTab.value == workflowTabs.review.index)
            return;
            
        activeTab.value = workflowTabs.review.index;

        validationReport.value = { isAnalyzing:true };
        let document = cloneDeep(props.document.value);

        // onPreReviewDocument
        if(workflowFunctions?.onPreReviewDocument)
            document = await workflowFunctions.onPreReviewDocument(document);

        let validationSection = null;
        if(workflowFunctions?.onPreReviewParams){
            const params = await workflowFunctions.onPreReviewParams(document);            
            validationSection = params.validationSection;
        }
        const validationResponse = await validate(document, {validationSection})
        if(validationResponse && validationResponse?.errors?.length) {
            validationReport.value = {...validationResponse};
            // $scope.tab = "review";
        }
        else 
            validationReport.value = {}

        // onPostReviewDocument
        if(workflowFunctions?.onPostReviewDocument){
            const report = await workflowFunctions.onPostReviewDocument(document, validationReport.value);
            if(report)
                validationReport.value = report;
        }

    }

    async function onSaveDraft(){
        try{
            validationReport.value = { isSaving:true };
            await saveDraft();
            $toast.success(t('draftSaveMessage'), {position:'top-right'});  
        }
        catch(e){
            if(e?.cause?.serverStatusCode != 409)
                $toast.error('Error saving draft record', {position:'top-right'}); 
            useLogger().error(e)
        }
        finally{
            validationReport.value = { };
        }
    }

    async function onPublish(){
        try{

            //show user final confirmation
            const confirmationResponse = await showConfirmation();
            confirmationPromise.value = null;
            showConfirmDialog.value = false;
            if(confirmationResponse == 'close'){
                return;
            }

            validationReport.value = { isSaving:true, isPublishing:true };
            const { document, documentSaveResponse } = await saveDraft(); 
            validationReport.value.isSaving          = false;

            // onPrePublish
            if(workflowFunctions?.onPrePublish)
                document = await workflowFunctions.onPrePublish(document);

            // save document
            const documentPublishResponse = await EditFormUtility.publishDraft(document);

            // onPostPublish
            if(workflowFunctions.onPostPublish)
                await workflowFunctions.onPostPublish({...documentPublishResponse, body:{...originalDocument}});

            showSuccessDialog.value = true;
            $toast.success(t('successfulMessage'), {position:'top-right'});  
        }
        catch(e){
            if(e?.cause?.serverStatusCode != 409)//ignore 
                $toast.error('Error publishing record', {position:'top-right'}); 
            useLogger().error(e)
        }
        finally{
            validationReport.value = { };
        }
    }

    function onPrintDocument(){
        isPrinting.value = true
    }

    function onAfterPrint(){
        isPrinting.value = false;
    }

    async function onClose(){
        
        let redirectTo = undefined;

        if(workflowFunctions.onPreClose)
            redirectTo = await workflowFunctions.onPreClose(originalDocument);
            
        if(redirectTo)
            await useNavigateAppTo(redirectTo)

        if(workflowFunctions.onPostClose)
            await workflowFunctions.onPostClose(originalDocument);
    }

    async function validate(document, {validationSection} = {}) {
                    
        try{
            if(!document)
                throw "Invalid document";
            
            const data     = await $api.kmStorage.documents.validate(document, {validationSection});

            return data;
        }
        catch(e){
            useLogger().error(e);
            $toast.error('Error occurred while validating your record, please save your data and try again.')
            return {
                errors : [{
                    property : e.message
                }]
            }
        }
    }

    async function saveDraft(){
        let document = cloneDeep(props.document.value)//document;

        // onPreSaveDraft
        if(workflowFunctions?.onPreSaveDraft)
            document = await workflowFunctions.onPreSaveDraft(document);

        const hasChangedAndOverwrite = await validateIfServerHasChanged()
        if(!hasChangedAndOverwrite)
            throw new Error('Document has changed on server, cannot save draft', { cause : {serverStatusCode:409}}); //409 Resource Conflict 

        // save document
        const documentSaveResponse = await EditFormUtility.saveDraft(document);
        originalDocument = { ...(document) }

        // onPostSaveDraft
        if(workflowFunctions.onPostSaveDraft)
            await workflowFunctions.onPostSaveDraft({...documentSaveResponse, body:{...originalDocument}});

        return { document, documentSaveResponse };
    }

    async function onJumpTo(field) {

        //change tab to review
        if(activeTab.value != workflowTabs.submission.index){
            formWizard.value?.selectTab(workflowTabs.submission.index)
        }
        
        setTimeout(() => {
            
            scrollToElement("form[name='editForm'] label[for='" + field + "']:first", container);
            
        }, 200);

    }

    function articleQuery(){
        const document = props.document;
        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf;
        const ag = [];
        ag.push({
            "$match":{
                "adminTags": { 
                    "$all" :
                        [   'edit-form', 
                            encodeURIComponent(realmConf.realm.toLowerCase().replace(/(\-[a-zA-Z]{1,5})/, '')),
                            encodeURIComponent(document.value?.header?.schema?.toLowerCase()||'')
                        ]
                }
            }
        });
        ag.push({"$project" : {"title":1, "content":1, "_id":1}});
        
        return {
            "ag" : JSON.stringify(ag)
        };
    }

    function alertIfDocumentChanged(e){
        if(originalDocument && !isEqual(originalDocument, props.document.value)){
            const answer = window.confirm(t('confirmLeave'))
            
            // cancel the navigation and stay on the same page
            //if not e then the call is from onBeforeRouteLeave else its from browser
            if(!e) return answer;

            if (answer) return false;

            return answer;
        }
    }

    async function validateIfServerHasChanged(){

        if(props.validateServerDraft.value){
            if(workflowFunctions.onGetDocumentInfo){
                const localDocumentInfo = await workflowFunctions.onGetDocumentInfo(originalDocument);
                try{
                    const serverDraft  = await KmDocumentDraftsService.loadDraftDocument(props.document.value.header.identifier);

                    const serverDocumentUpdatedOn = serverDraft.workingDocumentUpdatedOn||serverDraft.updatedOn;
                    const localDocumentUpdatedOn  = localDocumentInfo.workingDocumentUpdatedOn||localDocumentInfo.updatedOn;

                    if(moment(serverDocumentUpdatedOn).isAfter(moment(localDocumentUpdatedOn))){
                        showOverwriteConfirmation.value = true;
                        const { data } = await reveal(); 
                        return data.confirm;
                    }
                }
                catch(e){
                    if(e.status == 404)
                        return true; //if draft not found 

                    throw e
                }
            }
            else{
                throw new Error('onGetDocumentInfo not defined, cannot validateIfServerHasChanged')
            }
        }

        return true;
    }

    async function saveDraftVersion(){
        // console.log(new Date())
        let document = cloneDeep(props.document.value);

        if(workflowFunctions.onPreSaveDraftVersion){
            document = await workflowFunctions.onPreSaveDraftVersion(document);
        }

        if(document && !isEqual(document, previousDraftVersion)){
            const userId      = user.value.userID;
            const identifier  = document.header.identifier;
            const schema      = document.header.schema;
            const key         = `${schema}_${identifier}_${userId}`;


            try {
                const result         = await KmDocumentDraftsService.saveDraftVersion(key, document);
                previousDraftVersion = document;
                saveDraftVersionTimer = setTimeout(saveDraftVersion, 1000 * 60 * 10);

                appState.setBackupSpinner(true);
                setTimeout(()=>appState.setBackupSpinner(false), 5000)
            }
            catch(err){
                useError().error(err);
                saveDraftVersionTimer = setTimeout(saveDraftVersion, 1000*5);
            }
            finally{
            };
        }
        else{
            saveDraftVersionTimer = setTimeout(saveDraftVersion, 1000 * 60 * 10);
        }
    }

    function notifyCollaboratorProgress(){
        
        try {
            const document    = props.document.value;
            const identifier  = document.header.identifier;
            SocketIOService.notifyCollaboratorProgress(identifier, 'inProgress');            
        }
        catch(err){
            useError().error(err);
        }
        finally{
            notifyCollaboratorsTimer = setTimeout(notifyCollaboratorProgress, 1000*10); //notify every 30 seconds
        };
    }

    async function verifyUserCanAccess(){

        const $kmStorageApi = $api.kmStorage
        
        const metadata   = EditFormUtility.getDocumentMetadata(props.document.value);
        const identifier = props.document.value?.header?.identifier;

        const exists     = await EditFormUtility.draftExists(identifier);

        const qCanWrite  = exists  ? $kmStorageApi.drafts.canUpdate(identifier, { metadata })
                                : $kmStorageApi.drafts.canCreate(identifier, { metadata });

        const { isAllowed } = await qCanWrite;

        return isAllowed;

    }
    
    async function showConfirmation(){
        const dialogPromise = new Promise(async function (resolvePromise,reject){
            showConfirmDialog.value = true;
            confirmationPromise.value = resolvePromise;
        })

        return dialogPromise;
    }

    async function confirmationDialogClose(){
        confirmationPromise.value('close')
    }
    async function confirmationDialogProceed(){
        confirmationPromise.value('proceed')
    }

    function successDialogClose(){
        showSuccessDialog.value = false;
        onClose()
    }

    async function onServerPushNotification({type, identifier, status, by,...other}){
        
        if(!identifier)
            return;

        const notificationType = ['editRecordInProgress', 'editRecordFinished'];
        
        if(type == 'notifyCollaborator' && identifier){
            
            if(props.document.value?.header?.identifier != identifier)
                return;

            if(props.document.value?.header?.identifier == identifier){
                if(user.value.userID != by.userId){
                    if(status == 'inProgress' && !otherCollaborators.value.find((item) => item.userId == by.userId))    
                        otherCollaborators.value.push(by);

                    if(status == 'finished')   
                        otherCollaborators.value = otherCollaborators.value.filter((item) => item.userId != by.userId)
                }
            }
        }
    }

    onMounted(async() => {
        validationReport.value = {}; 
        originalDocument = null
        saveDraftVersionTimer = null;
        notifyCollaboratorsTimer = null;
        previousDraftVersion = null;
        
        formWizard.value?.selectTab(focusedTab.value ?? 0)

        workflowFunctions = inject<KmFormWorkflowFunctions>('kmWorkflowFunctions');
        try{
            if(workflowFunctions.onGetDocumentInfo){
                const documentInfo = await workflowFunctions.onGetDocumentInfo(originalDocument);
                originalDocument = cloneDeep(documentInfo.body);
            }
            else 
                originalDocument = cloneDeep(props.document.value);
            
            isEditAllowed.value = await verifyUserCanAccess();
            if(isEditAllowed.value){
                //start save draft version 10 sec later
                saveDraftVersionTimer = setTimeout(saveDraftVersion, 1000 * 10);
                notifyCollaboratorProgress();
                $eventBus.on('evt:server-pushNotification', onServerPushNotification);     
            }
        }
        catch(e){
            useLogger().error(e, 'Error loading edit form.')
        }
            
    })
    // same as beforeRouteLeave option with no access to `this`
    onBeforeRouteLeave((to, from) => {
        return alertIfDocumentChanged();
    })
    onBeforeMount(() => {
        window.onbeforeunload = alertIfDocumentChanged
    });
    onUnmounted(() => {
        window.onbeforeunload = null;

        if(saveDraftVersionTimer)
            clearTimeout(saveDraftVersionTimer);

        if(notifyCollaboratorsTimer)
            clearTimeout(notifyCollaboratorsTimer);

        const document    = props.document.value;
        const identifier  = document.header.identifier;
        SocketIOService.notifyCollaboratorProgress(identifier, 'finished');
        $eventBus.off('evt:server-pushNotification', onServerPushNotification);

    });

</script>

<style>
    .form-wizard-vue .fw-body{
        border-top: 1px solid #eee;
    }
    .fw-overflow-scroll .fw-body-list:hover{
        overflow-x: auto;
    }
    .form-wizard-vue .fw-body-content{
        padding:5px;
    }
    .other-users-sticky-header{
        top:113px!important;
    }
    .modal .other-users-sticky-header{
        top: 0px !important;
    }
</style>
  