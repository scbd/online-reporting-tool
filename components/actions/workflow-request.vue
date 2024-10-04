<template>
    <km-suspense>
        <workflow-actions v-if="openWorkflow" :workflow="openWorkflow"></workflow-actions>
    </km-suspense>
</template>

<script setup lang="ts">

    const props = defineProps({
        workflowId : {type:String, required:true}
    });

    const { $api }      = useNuxtApp();
    const openWorkflow  = ref(null);

    async function loadOpenWorkflow(workflowId: string, iteration:number=0) {
        
        if(!workflowId)
            return;

        const workflow = await $api.kmWorkflows.getWorkflow(workflowId);
        if(workflow) {
            if(!workflow?.activities?.length && iteration < 5){
                await sleep(2000);
                return loadOpenWorkflow(lockedRecord, iteration+1)
            }
            else{
                openWorkflow.value=workflow;
            }
        }
    }

    async function onWorkflowAction(actionData){
        // console.log(actionData);       
        
    }

    onMounted(()=>
        loadOpenWorkflow(props.workflowId)
    );

</script>

<style scoped>

</style>