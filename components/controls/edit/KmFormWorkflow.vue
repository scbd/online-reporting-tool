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
        <!-- TODO : find why onfirst load its not working without .value -->
        <div v-if="(currentTab.value || currentTab) == 0" class="m-1">
            <slot name="introduction" >
                <CAlert color="success" v-bind:visible="true">
                    <CAlertHeading>Introduction!</CAlertHeading>
                    <hr />
                    <p class="mb-0">This section will have a brief description to help users submit infromation</p>
                </CAlert>
            </slot>
        </div>
        <div v-if="(currentTab.value || currentTab) == 1" class="m-1"><slot name="submission"></slot></div>
        <div v-if="(currentTab.value || currentTab) == 2" class="m-1"><slot name="review"></slot></div>
        <div v-if="(currentTab.value || currentTab) == 3" class="m-1"><slot name="publish"></slot></div>
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

    const currentTabIndex = ref(0)
    currentTabIndex.value = 1;

    const onChangeCurrentTab = (index, oldIndex)=>{
        console.log(index, oldIndex);
        currentTabIndex.value = index;
    }
    const onTabBeforeChange = ()=> {
        if (currentTabIndex.value === 0) {
            console.log('First Tab');
        }
        console.log('All Tabs');
    }
    const wizardCompleted = ()=> {
        console.log('Wizard Completed');
    }

const currentTab = computed(()=>{
    return currentTabIndex.value
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
  