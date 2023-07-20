<template>
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
        :startIndex="currentTab"
    >
        <div v-if="currentTab == 0" class="m-1">
            <slot name="introduction" >
                <CAlert color="success" v-bind:visible="true">
                    <CAlertHeading>Introduction!</CAlertHeading>
                    <hr />
                    <p class="mb-0">This section will have a brief description to help users submit infromation</p>
                </CAlert>
            </slot>
        </div>

        <CRow v-if="(currentTab == 1 || currentTab == 2 || currentTab == 3)">
            <CCol>
                <div class="action-buttons float-end">
                    <CButton @click="onReviewDocument()" color="primary" class="me-md-2" :disabled="showSpinnerModal">Review</CButton>
                </div>
            </CCol>

            <km-validation-errors :report="validationReport" :container="container" @on-jump-to="onJumpTo"></km-validation-errors>            
        </CRow>
        <div v-show="currentTab == 1" class="m-1"><slot name="submission"></slot></div>
        <div v-if="currentTab == 2" class="m-1"><slot name="review"></slot></div>
        <div v-if="currentTab == 3" class="m-1"><slot name="publish"></slot></div>
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
        :startIndex="currentTab"
    ></Wizard> -->
  </template>
  
<script setup>
    import 'form-wizard-vue3/dist/form-wizard-vue3.css';
    import Wizard from 'form-wizard-vue3';
    import { KmValidationErrors, KmSpinner } from "~/components/controls";
    import { CButton, CRow } from '@coreui/vue';
    import $ from 'jquery';
    
    const definedProps = defineProps({
        currentTab                  : { type:Number, default:0 },
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
    
    const container = useAttrs().container;

    let validationReport = ref({});
    let { currentTab, tab, ...props } = toRefs(definedProps);

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

    const onChangeCurrentTab = (index, oldIndex)=>{
        currentTab = index;     
    }
    const onTabBeforeChange = ()=> {
        // console.log('All Tabs');
    }

    async function onReviewDocument(){

        validationReport.value = { isAnalyzing:true };
        const document = props.getDocument.value();

        const validationResponse = await validate(document.value)
        if(validationResponse && validationResponse?.errors?.length) {
            validationReport.value = {...validationResponse};
            // $scope.tab = "review";
        }
        console.log(validationReport)
    }

    const wizardCompleted = ()=> {
        // console.log('Wizard Completed');
    }

    async function validate(document) {
                    
        if(!document)
            throw "Invalid document";

        const { $api } = useNuxtApp();
        const { data, error } = await $api.kmStorage.documents.validate(document);

        if(error?.value)
                throw error;
            
        return data;
    }

    function onJumpTo(field) {

        //change tab to review
        onChangeCurrentTab(1)
        const qLabel = $(container).find("form[name='editForm'] label[for='" + field + "']:first");
        const qBody  = $(container);

        var scrollNum = qLabel.offset().top

        if(container!= 'body,html'){
            //its a dialog calculate scrollTop
            var dialogContainer = $(container)
            scrollNum = scrollNum - dialogContainer.offset().top + dialogContainer.scrollTop();
        }
        else
            scrollNum -= 10; //forms 
console.log(scrollNum)
        qBody.stop().animate({
            scrollTop: scrollNum-300
        }, 100);

    }

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
  