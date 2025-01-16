<template>
    <km-suspense>
        <workflow-actions v-if="openWorkflow" :workflow="openWorkflow"  @on-workflow-action="onWorkflowAction"></workflow-actions>
    </km-suspense>
</template>

<script setup lang="ts">
//@ts-nocheck

    const emit  = defineEmits(['onWorkflowAction']);
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
            if(!workflow.closedOn){
                if(!workflow?.activities?.length && iteration < 5){
                    await sleep(2000);
                    return loadOpenWorkflow(lockedRecord, iteration+1)
                }
                else{                    
                    openWorkflow.value=workflow;
                }
            }
        }
    }

    async function onWorkflowAction({action, workflowId, batchId,name}){

        emit('onWorkflowAction', {action, workflowId, batchId,name});

        const redirectTo = resolveSchemaViewRoute(openWorkflow.value?.data?.metadata.schema, openWorkflow.value?.data?.identifier)
        await useNavigateAppTo(redirectTo);
        openWorkflow.value=undefined;
    }

    onMounted(()=>
        loadOpenWorkflow(props.workflowId)
    );

</script>

<style scoped>

</style>