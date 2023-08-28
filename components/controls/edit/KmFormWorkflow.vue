<template>
    <div :class="{'dim-section':isBusy}">

        <form-wizard  @on-tab-change="onChangeCurrentTab" ref="formWizard">

            <CRow v-if="(activeTab == workflowTabs.submission.index || activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)">
                <CCol>
                    <div class="action-buttons float-end mb-1">
                        <CButton @click="onSaveDraft()" color="primary" class="me-md-2" :disabled="isBusy">
                        <c-spinner v-if="validationReport.isSaving" size="sm" variant="grow" aria-hidden="true"></c-spinner>
                            {{t('saveDraft')}}
                        </CButton> 
                        <CButton @click="onReviewDocument()" color="primary" class="me-md-2" :disabled="isBusy">
                            {{t('preview')}}
                        </CButton>
                        <!-- <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                        <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton>  -->
                        <CButton @click="onClose()" color="danger" class="me-md-2" :disabled="isBusy">{{t('close')}}</CButton>
                    </div>
                </CCol>
                <km-validation-errors  v-if="(activeTab == workflowTabs.submission.index && validationReport.errors?.length) || 
                                             (activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)"
                    :report="validationReport" :container="container" @on-jump-to="onJumpTo"></km-validation-errors>            
            </CRow>

            <tab-content :title="workflowTabs.introduction.title" :is-active="activeTab == workflowTabs.introduction.index">
                <slot name="introduction" >
                    <CAlert color="success" v-bind:visible="true">
                        <CAlertHeading>Introduction!</CAlertHeading>
                        <hr />
                        <p class="mb-0">This section will have a brief description to help users submit information</p>
                    </CAlert>
                </slot>
            </tab-content>
            <tab-content :title="workflowTabs.submission.title" v-show="activeTab == workflowTabs.submission.index" :is-active="true">
                <slot name="submission"></slot>
            </tab-content>
            <tab-content :title="workflowTabs.review.title" :is-active="activeTab == workflowTabs.review.index">
                <slot name="review"></slot>
            </tab-content>
            <tab-content :title="workflowTabs.publish.title" :is-active="activeTab == workflowTabs.publish.index">
                <slot name="publish"></slot>
            </tab-content>
            
            <CRow v-if="(activeTab == workflowTabs.submission.index || activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)">
                    <km-validation-errors v-if="(activeTab == workflowTabs.submission.index && validationReport.errors?.length) || 
                                            (activeTab == workflowTabs.review.index || activeTab == workflowTabs.publish.index)"
                    :report="validationReport" :container="container" @on-jump-to="onJumpTo"></km-validation-errors>  
                <CCol>
                    <div class="action-buttons float-end">
                        <CButton @click="onSaveDraft()" color="primary" class="me-md-2">{{t('saveDraft')}}</CButton> 
                        <CButton @click="onReviewDocument()" color="primary" class="me-md-2" >{{t('preview')}}</CButton>
                        <!-- <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                        <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton>  -->
                        <CButton @click="onClose()" color="danger" class="me-md-2">{{t('close')}}</CButton>
                    </div>
                </CCol>
            
            </CRow>
        </form-wizard>
        
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/KmFormWorkflow.json"></i18n>
<script setup>

    import FormWizard from './KmFormWizard.vue';
    import TabContent from './KmFormWizardTabContent.vue';
    import { KmValidationErrors, KmSpinner } from "~/components/controls";
    import { CButton, CRow } from '@coreui/vue';
    import $ from 'jquery';
    import { useI18n } from 'vue-i18n';
    import { EditFormUtility }  from '@/services/edit-form-utility';
    import {useToast} from 'vue-toast-notification';
    import {isEmpty} from 'lodash'
    import { scrollToElement } from '@/utils';

    const definedProps = defineProps({
        focusedTab                  : { type:Number, default:0 },
        tab                         : { type:String },
        // validationReport            : { type:Object,   required:true  },
    	getDocument                 : { type:Function, required:true  },
        onPreClose                  : { type:Function, required:false },
        onPostClose                 : { type:Function, required:false },
        onPreRevert                 : { type:Function, required:false },
        onPostRevert                : { type:Function, required:false },
        onPreSaveDraft              : { type:Function, required:false },
        onPostSaveDraft             : { type:Function, required:false },
        onPreRequest                : { type:Function, required:false },
        onPostRequest               : { type:Function, required:false },
        onPrePublish                : { type:Function, required:false },
        onPostPublish               : { type:Function, required:false },
        onError                     : { type:Function, required:false },
        onStepChange                : { type:Function, required:false },
        onReviewLanguageChange      : { type:Function, required:false },
        onPreSaveDraftVersion	    : { type:Function, required:false },
    });
    
    let originalDocument = null
    const container     = useAttrs().container ?? 'body,html';
    const { $eventBus } = useNuxtApp();
    const {t }          = useI18n();
    const $toast        = useToast();
    const formWizard       = ref(null);
    const validationReport = ref({});
    const activeTab      = ref(null);

    const workflowTabs = {
        introduction: { index : 0, title: t('introduction') },
        submission  : { index : 1, title: t('submission') },
        review      : { index : 2, title: t('review') },
        publish     : { index : 3, title: t('publish') },
    }

    let { focusedTab, tab, ...props } = toRefs(definedProps);
        
    const isBusy = computed(()=>validationReport.value?.isSaving || validationReport.value?.isAnalyzing);

    const onChangeCurrentTab = (index)=>{
        
        activeTab.value = index;
        if([workflowTabs.review.index, workflowTabs.publish.index].includes(activeTab.value)){
            onReviewDocument(true);
        }
        activeTab.value = index;
    }    

    async function onReviewDocument(tabChanged){
        if(!tabChanged && activeTab.value == workflowTabs.review.index)
            return;
            
        activeTab.value = workflowTabs.review.index;

        validationReport.value = { isAnalyzing:true };
        const document = props.getDocument.value();

        const validationResponse = await validate(document.value)
        if(validationResponse && validationResponse?.errors?.length) {
            validationReport.value = {...validationResponse};
            // $scope.tab = "review";
        }
        else 
            validationReport.value = {}
        $eventBus.emit('onReviewError', validationResponse)
    }

    async function onSaveDraft(){
        try{
            validationReport.value = { isSaving:true };
            const document = props.getDocument.value();

            // onPreSaveDraft
            if(definedProps.onPreSaveDraft)
                document = definedProps.onPreSaveDraft(document);
            
            // save document
            const documentSaveResponse = await EditFormUtility.saveDraft(document.value);
            originalDocument = { ...(document.value) }

            // onPostSaveDraft
            if(definedProps.onPostSaveDraft)
                definedProps.onPostSaveDraft({...documentSaveResponse, body:{...originalDocument}});

            $toast.success(t('draftSaveMessage'), {position:'top-right'});  
        }
        catch(e){
            $toast.error('Error saving draft record', {position:'top-right'}); 
            useLogger.error(e)
        }
        validationReport.value = { };
    }

    async function onClose(){
        
        let redirectTo = undefined;

        if(definedProps.onPreClose)
            redirectTo = definedProps.onPreClose(originalDocument);
            
        if(redirectTo.value)
            await navigateTo(redirectTo.value)
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
            onChangeCurrentTab(workflowTabs.submission.index)
        }
        
        setTimeout(() => {
            
            scrollToElement("form[name='editForm'] label[for='" + field + "']:first", container);
            
        }, 200);

    }

    onMounted(() => {
        formWizard.value?.selectTab(focusedTab.value ?? 0)
    })
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
  