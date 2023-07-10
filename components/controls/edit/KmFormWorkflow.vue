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
        <div v-if="currentTab == 1" class="m-1"><slot name="submission"></slot></div>
        <div v-if="currentTab == 2" class="m-1"><slot name="review"></slot></div>
        <div v-if="currentTab == 3" class="m-1"><slot name="publish"></slot></div>
    </Wizard>
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
    ></Wizard>
  </template>
  
<script setup>
    import 'form-wizard-vue3/dist/form-wizard-vue3.css';
    import Wizard from 'form-wizard-vue3';
    
    const props = defineProps({
        currentTab : { type:Number, default:0 }
    })
    let { currentTab } = toRefs(props);

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
    const wizardCompleted = ()=> {
        // console.log('Wizard Completed');
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
  