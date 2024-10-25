
<template>
    <div class="d-grid gap-1 km-record-status">
        <div class="processing-status" v-if="document.showProcessing">
            <CBadge color="info"><km-spinner :message="t('processing')"></km-spinner></CBadge>
        </div>
        <div class="draft-status" v-if="!document.showProcessing && document.workingDocumentBody">
            <CBadge color="dark">{{ t('draft') }}</CBadge>
        </div>
        <div class="locked-status" v-if="(document.workingDocumentLock)">
            <CBadge color="danger">{{ t('locked') }}</CBadge>
        </div>
        <div class="success-status" v-if="!document.showProcessing && !document.workingDocumentBody">
            <CBadge color="success">{{ t('published') }}</CBadge>
        </div>
    </div>
                    
</template>
<i18n src="@/i18n/dist/components/controls/common/km-document-status.json"></i18n>
<script setup lang="ts">

    import { useStorage } from '@vueuse/core';
    import { KmDocumentsService } from '@/services/kmDocuments';
    import { KmDocumentDraftsService } from '@/services/kmDocumentDrafts';

    const props               = defineProps({
        document : { type:Object, required:true}
    });
    const emit   = defineEmits(['onStatusChange'])

    const { t } = useI18n();
    const stateTargetWorkflow = useStorage('ort-target-workflow', { batchId : undefined });    
    const { $eventBus }       = useNuxtApp();

    const { document }        = toRefs(props);
    // const lockStatus          = ref(null);

    onMounted(()=> {
        $eventBus.on('evt:server-pushNotification', onServerPushNotification);        
    })

    onBeforeUnmount(()=>{
        $eventBus.off('evt:server-pushNotification', onServerPushNotification);
    })


    async function onServerPushNotification({data, type,...other}){
        
        if(!data)
            return;

        const notificationType = ['workflowActivityStatus', 'userNotification'];
        const { workflowActivity, identifier, schema } = data;

        if(notificationType.includes(type) && identifier){
            
            if(document.value.identifier != identifier)
                return;

            const statusChangeData = { workflowActivity, identifier, schema };
            
            // if(workflowActivity == 'document-lock'){
            //     lockStatus.value = 'workflow-lock'//fake workflow id
            // }else
             if(workflowActivity == 'create-revision-from-draft'){
                try{
                    const newDocument = await KmDocumentsService.loadDocument(identifier);
                    statusChangeData.newDocument = newDocument;
                    // lockStatus.value = undefined;
                    if(newDocument){
                        stateTargetWorkflow.value = undefined;
                    }   
                }
                catch(e){
                    //ignore as it will be 404 in most cases.
                }   
            }
            else if(workflowActivity == 'document-unlock'){
                
                try{
                    const newDocument = await KmDocumentDraftsService.loadDraftDocument(identifier);
                    statusChangeData.newDocument = newDocument;
                    // lockStatus.value = undefined;
                    if(newDocument){
                        stateTargetWorkflow.value = undefined;
                    }   
                }
                catch(e){
                    //ignore as it will be 404 in most cases.
                    console.error(e)
                }   
            }
            //'document-deleted'

            emit('onStatusChange', statusChangeData);
        }
    }
</script>

<style scoped></style>