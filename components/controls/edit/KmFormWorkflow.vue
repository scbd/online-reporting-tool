<template>
    <div>
        <div :class="{'dim-section':isBusy}">
            <form-wizard  @on-tab-change="onChangeCurrentTab" ref="formWizard">

                <CRow v-if="(activeTab == workflowTabs.submission.index || activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)">
                    <CCol class="col-12">
                        <div class="action-buttons float-end mb-1">
                            <CButton @click="onSaveDraft()" color="primary" class="me-md-2" :disabled="isBusy">
                            <c-spinner v-if="validationReport.isSaving" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                                {{t('saveDraft')}}
                            </CButton> 
                            <CButton @click="onReviewDocument()" color="primary" class="me-md-2" :disabled="isBusy">
                                {{t('review')}}
                            </CButton>
                            <!-- <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                            <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton>  -->
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
                <tab-content :title="workflowTabs.review.title" :is-active="activeTab == workflowTabs.review.index">
                    <slot name="review"></slot>
                </tab-content>
                <!-- <tab-content :title="workflowTabs.publish.title" :is-active="activeTab == workflowTabs.publish.index">
                    <slot name="publish"></slot>
                </tab-content> -->
                
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
                            <CButton @click="onSaveDraft()" color="primary" class="me-md-2">{{t('saveDraft')}}</CButton> 
                            <CButton @click="onReviewDocument()" color="primary" class="me-md-2" >{{t('review')}}</CButton>
                            <!-- <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                            <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton>  -->
                            <CButton @click="onClose()" color="danger" class="me-md-2">{{t('close')}}</CButton>
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
                <strong>{{ t('overwriteConfirmation') }}</strong>
                
            </CModalBody>
            <CModalFooter>
                <CButton color="danger" @click="confirm({confirm:true})">{{t('confirm')}}</CButton>
                <CButton color="secondary" @click="confirm({confirm:false})">{{t('cancel')}}</CButton>
            </CModalFooter>
        </CModal>
    </div>

</template>
<i18n src="@/i18n/dist/components/controls/edit/KmFormWorkflow.json"></i18n>
<script setup>

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


    const definedProps = defineProps({
        focusedTab                  : { type:Number, default:0 },
        tab                         : { type:String },
    	document                    : { type:Object, required:true  },
    	validateServerDraft         : { type:Boolean, required:false, default:false  }
    });
    
    let originalDocument = null
    const container     = useAttrs().container ?? 'body,html';
    const {t }          = useI18n();
    const $toast        = useToast();
    const formWizard       = ref(null);
    const validationReport = ref({});
    const activeTab      = ref(null);
    let workflowFunctions;
    const showOverwriteConfirmation = ref(false);
    const { isRevealed, reveal, confirm, cancel, onConfirm,  onCancel, } = useConfirmDialog();

    const workflowTabs = {
        // use individual compute so that on language change the text is updated
        introduction: { index : 0, title: computed(()=>t('introduction')) }, 
        submission  : { index : 1, title: computed(()=>t('submission')) },
        review      : { index : 2, title: computed(()=>t('review')) },
        publish     : { index : 3, title: computed(()=>t('publish')) },
    }

    let { focusedTab, tab, ...props } = toRefs(definedProps);
        
    const isBusy = computed(()=>validationReport.value?.isSaving || validationReport.value?.isAnalyzing);

    const onChangeCurrentTab = (index)=>{
        
        activeTab.value = index;
        if([workflowTabs.review.index, workflowTabs.publish.index].includes(activeTab.value)){
            onReviewDocument(true);
        }
    }    

    async function onReviewDocument(tabChanged){
        if(!tabChanged && activeTab.value == workflowTabs.review.index)
            return;
            
        activeTab.value = workflowTabs.review.index;

        validationReport.value = { isAnalyzing:true };
        const document = props.document;

        // onPreReviewDocument
        if(workflowFunctions?.onPreReviewDocument)
            document.value = await workflowFunctions.onPreReviewDocument(document);

        const validationResponse = await validate(document.value)
        if(validationResponse && validationResponse?.errors?.length) {
            validationReport.value = {...validationResponse};
            // $scope.tab = "review";
        }
        else 
            validationReport.value = {}

        // onPostReviewDocument
        if(workflowFunctions?.onPostReviewDocument)
            await workflowFunctions.onPostReviewDocument(document, validationReport);

    }

    async function onSaveDraft(){
        try{
            validationReport.value = { isSaving:true };
            const document = props.document//document;

            // onPreSaveDraft
            if(workflowFunctions?.onPreSaveDraft)
                document.value = await workflowFunctions.onPreSaveDraft(document);

            const hasChangedAndOverwrite = await validateIfServerHasChanged()
            if(!hasChangedAndOverwrite)
                return;

            // save document
            const documentSaveResponse = await EditFormUtility.saveDraft(document.value);
            originalDocument = { ...(document.value) }

            // onPostSaveDraft
            if(workflowFunctions.onPostSaveDraft)
                await workflowFunctions.onPostSaveDraft({...documentSaveResponse, body:{...originalDocument}});

            $toast.success(t('draftSaveMessage'), {position:'top-right'});  
        }
        catch(e){
            $toast.error('Error saving draft record', {position:'top-right'}); 
            useLogger().error(e)
        }
        finally{
            validationReport.value = { };
        }
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

    async function validate(document) {
                    
        try{
            if(!document)
                throw "Invalid document";

            const { $api } = useNuxtApp();
            const data     = await $api.kmStorage.documents.validate(document);

            return data;
        }
        catch(e){
            useLogger().error(e);
            $toast.error('Error occurred while validating your record, please save your data and try again.')
        }
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
            if (answer) return false;
        }
    }

    async function validateIfServerHasChanged(){

        if(props.validateServerDraft.value){
            if(workflowFunctions.onGetDocumentInfo){
                const documentInfo = await workflowFunctions.onGetDocumentInfo(originalDocument);
                const serverDraft  = await KmDocumentDraftsService.loadDraftDocument(props.document.value.header.identifier);

                if(moment(serverDraft.updatedOn).isAfter(moment(documentInfo.updatedOn))){
                    showOverwriteConfirmation.value = true;
                    const { data } = await reveal(); 
                    return data.confirm;
                }
            }
            else{
                throw new Error('onGetDocumentInfo not defined, cannot validateIfServerHasChanged')
            }
        }

        return true;
    }

    onMounted(async() => {
        formWizard.value?.selectTab(focusedTab.value ?? 0)

        workflowFunctions = inject('kmWorkflowFunctions');

        // setTimeout(async() => {            
            if(workflowFunctions.onGetDocumentInfo){
                const documentInfo = await workflowFunctions.onGetDocumentInfo(originalDocument);
                originalDocument = cloneDeep(documentInfo.body);
            }
            else 
                originalDocument = cloneDeep(props.document.value);
        // }, 1000);
    })
    // same as beforeRouteLeave option with no access to `this`
    onBeforeRouteLeave((to, from) => {
        alertIfDocumentChanged();
    })
    onBeforeMount(() => {
        window.onbeforeunload = alertIfDocumentChanged
    });
    onUnmounted(() => {
        window.onbeforeunload = null
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
</style>
  