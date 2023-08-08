<template>
    <div :class="{'dim-section':isBusy}">
        <Wizard
            squared-tabs
            card-background
            navigable-tabs
            scrollable-tabs
            hideButtons
            :custom-tabs="tabs"
            :beforeChange="onTabBeforeChange"
            @change="onChangeCurrentTab"
            @complete:wizard="wizardCompleted"
            :startIndex="activeTab"
            ref="wizardRef"
        >
            <div v-if="activeTab == tabName.introduction" class="m-1">
                <slot name="introduction" >
                    <CAlert color="success" v-bind:visible="true">
                        <CAlertHeading>Introduction!</CAlertHeading>
                        <hr />
                        <p class="mb-0">This section will have a brief description to help users submit information</p>
                    </CAlert>
                </slot>
            </div>

            <CRow v-if="(activeTab == tabName.submission || activeTab == tabName.review || activeTab == tabName.publish)">
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
                <km-validation-errors  v-if="(activeTab == tabName.submission && validationReport.validationErrors) || 
                                             (activeTab == tabName.review || activeTab == tabName.publish)"
                    :report="validationReport" :container="container" @on-jump-to="onJumpTo"></km-validation-errors>            
            </CRow>
            <div v-show="activeTab == tabName.submission" class="m-1"><slot name="submission"></slot></div>
            <div v-if="activeTab == tabName.review" class="m-1"><slot name="review"></slot></div>
            <div v-if="activeTab == tabName.publish" class="m-1"><slot name="publish"></slot></div>

            <CRow v-if="(activeTab == tabName.submission || activeTab == tabName.review || activeTab == tabName.publish)">
                    <km-validation-errors v-if="(activeTab == tabName.submission && validationReport.validationErrors) || 
                                            (activeTab == tabName.review || activeTab == tabName.publish)"
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
        </Wizard>
        <!-- <Wizard
            squared-tabs
            card-background
            navigable-tabs
            scrollable-tabs
            hideButtons
            :custom-tabs="tabs"
            :beforeChange="onTabBeforeChange"
            @change="onChangeCurrentTab"
            @complete:wizard="wizardCompleted"
            :startIndex="activeTab"
        ></Wizard> -->
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/edit/KmFormWorkflow.json"></i18n>
<script setup>
    import 'form-wizard-vue3/dist/form-wizard-vue3.css';
    import Wizard from 'form-wizard-vue3';
    import { KmValidationErrors, KmSpinner } from "~/components/controls";
    import { CButton, CRow } from '@coreui/vue';
    import $ from 'jquery';
    import { useI18n } from 'vue-i18n';
    import { EditFormUtility }  from '@/services/edit-form-utility';
    import {useToast} from 'vue-toast-notification';
    import {isEmpty} from 'lodash'


    const tabName = {
        introduction : 0,
        submission : 1,
        review : 2,
        publish: 3
        
    }
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
    
    let validationReport = ref({});
    const wizardRef      = ref(null);
    const activeTab      = ref(null);

    let { focusedTab, tab, ...props } = toRefs(definedProps);
    
    const tabs = [
        {
            title: 'Introduction',
        },
        {
            title: 'Submission',
        },
        {
            title: 'Review',
        }
        // {
        //     title: 'Publish',
        // },
    ];
    
    const isBusy = computed(()=>validationReport.value?.isSaving || validationReport.value?.isAnalyzing)
    const onChangeCurrentTab = (index, oldIndex)=>{
        activeTab.value = index;
        if(activeTab.value == tabName.review){
            onReviewDocument(true);
        }
    }
    const onTabBeforeChange = ()=> {
        // console.log('All Tabs');
    }
    const wizardCompleted = ()=> {
        // console.log('Wizard Completed');
    }

    async function onReviewDocument(tabChanged){
        if(!tabChanged && activeTab.value == tabName.review)
            return;
            
        await wizardRef.value.changeTab(tabName.review)
        activeTab.value = tabName.review;

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
            console.error(e)
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
        if(activeTab.value != tabName.submission){
            await wizardRef.value.changeTab(tabName.submission)
            onChangeCurrentTab(tabName.submission)
        }
        
        setTimeout(() => {
            
            const qLabel = $(container).find("form[name='editForm'] label[for='" + field + "']:first");
            const qBody  = $(container);

            var scrollNum = qLabel.offset().top

            if(container!= 'body,html'){
                //its a dialog calculate scrollTop
                var dialogContainer = $(container)
                scrollNum = scrollNum - dialogContainer.offset().top + dialogContainer.scrollTop();
            }
            else
                scrollNum -= 130; //forms 

            qBody.stop().animate({
                scrollTop: scrollNum
            }, 100);

        }, 200);

    }

    onMounted(() => {
        wizardRef.value.changeTab(focusedTab.value ?? 0)
        onChangeCurrentTab(focusedTab.value ?? 0)
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
  