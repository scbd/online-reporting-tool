<template>
    <!-- {{ workflow }} -->
    <div class="alert alert-danger" v-if="props.workflow"
     style="border-color:#DDD; background-color: #f5f5f5;" role="alert">
        <h3 class="color-black;" style="margin-top:0;border-bottom:1px solid #999;">
            <span v-if="workflow.type.name != 'deleteRecord'">{{ t('publishing') }} </span>
            <span v-if="workflow.type.name == 'deleteRecord'">{{ t('deletion') }} </span>
            {{ t('request') }}
        </h3>
        <div>
            <span style="font-size:12px">{{ t('requestedBy') }} </span>
            <span class="color-black">
                <span class="bold">{{ workflow.createdBy_info.firstName + ' ' + workflow.createdBy_info.lastName }} </span>
                    ({{workflow.createdBy_info.email}})
                <span> {{t('on')}} </span> <span style="text-transform: uppercase; font-size:12px" class="bold"
                    >{{ formatDate(workflow.createdOn) }} </span>
            </span>
        </div>
        <div v-if="workflow.data.additionalInfo">
            <span style="font-size:12px">{{t('message')}} </span>
            <span class="color-black">
                {{workflow.data.additionalInfo}}
            </span>
        </div>

        <div>
            <span style="font-size:12px"> {{t('requestExpiresIn')}} </span>
            <span>{{daysToApproval}} {{t('days')}}</span>
        </div>
        <!-- need to change to json -->
        <!-- filter: isOpen | orderBy: '-createdOn'  -->
        <div v-for="(activity, index)  in  openActivity" :key=" activity " class="m-2">
            <div class="d-grid gap-1 d-md-flex" v-if="isWorkflowAssignedToMe(activity)">
                <button type="button" class="btn btn-success bold" @click="confirmWorkflowRequestAction('confirmApproval')"
                    :disabled=" isRevealed " v-if=" activity.name != 'deleteRecord' ">
                    <span>{{t('approve')}}</span>
                </button>
                <!-- <button type="button" class="btn btn-danger bold" @click="confirmDelete()" :disabled=" isRevealed "
                    v-if=" activity.name == 'deleteRecord' ">
                    <span>{{t('delete')}}</span>
                </button> -->
                <button type="button" class="btn btn-warning bold" @click="confirmWorkflowRequestAction('confirmRejection')" :disabled=" isRevealed ">
                    <span v-if=" activity.name == 'deleteRecord' ">{{t('rejectNotDelete')}}</span>
                    <span v-if=" activity.name != 'deleteRecord' ">{{t('reject')}}</span>
                </button>
            </div>

            <div v-if="isWorkFlowCreatedByMe(workflow)">
                <button type="button" class="btn btn-warning bold" @click="confirmCancelWorkflowRequest()"
                    :disabled=" isRevealed ">
                    <span> {{t('cancelRequest')}}</span>
                </button>
            </div>
            <div v-if="security.role.isAdministrator() ">
                <br />
                <strong>{{t('workFlowAssign')}} {{formatDate(activity.createdOn)}}</strong> ({{t('visible')}})
                <span class="badge bg-secondary">
                    {{workflow.workflowAge.age}} {{workflow.workflowAge.type}}
                </span>
                <table class="table table-bordered mt-2" width="100%">
                    <tr v-for=" user  in  activity.assignedTo_info " :key=" user ">
                        <td>{{ user.userID }}</td>
                        <td class="ps-2" >{{ user.firstName + ' ' + user.lastName }}</td>
                        <td class="ps-2">{{ user.email }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

    <CModal  class="show d-block" alignment="center" backdrop="static" :visible="isRevealed && activeDialog.name == 'confirmCancellation'" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{ t('cancelPublishingRequest') }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <strong>{{ t('cancelPublishingRequestConfirm') }}</strong>
            <div class="mt-2" v-if="activeDialog.processing">
                <CSpinner size="md" variant="grow"/><strong>{{ t('cancellationProcessing') }}</strong>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton color="danger" @click="confirm({confirm:true, activeDialog})">{{t('yes')}}</CButton>
            <CButton color="secondary" @click="confirm({confirm:false, activeDialog})">{{t('no')}}</CButton>
        </CModalFooter>
    </CModal>


    <CModal  class="show d-block" alignment="center" backdrop="static" :visible="isRevealed && activeDialog.name == 'confirmRejection'" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{ t('rejectConfirmation') }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <strong>{{ t('rejectPublishingRequestConfirm') }}</strong>
            <div class="mt-2" v-if="activeDialog.processing">
                <CSpinner size="md" variant="grow"/><strong>{{ t('cancellationProcessing') }}</strong>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton :disabled="activeDialog.processing" color="danger" @click="confirm({confirm:true, activeDialog, actionData:{ action : 'reject' }})">{{t('reject')}}</CButton>
            <CButton :disabled="activeDialog.processing" color="secondary" @click="confirm({confirm:false, activeDialog})">{{t('cancel')}}</CButton>
        </CModalFooter>
    </CModal>

    <CModal  class="show d-block" alignment="center" backdrop="static" :visible="isRevealed && activeDialog.name == 'confirmApproval'" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{ t('approveConfirmation') }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <strong>{{ t('approvePublishingRequestConfirm') }}</strong>
            <div class="mt-2" v-if="activeDialog.processing">
                <CSpinner size="md" variant="grow"/><strong>{{ t('approvalProcessing') }}</strong>
            </div>
        </CModalBody>
        <CModalFooter>
            <CButton :disabled="activeDialog.processing" color="danger" @click="confirm({confirm:true, activeDialog, actionData:{ action : 'approve' }})">{{t('approve')}}</CButton>
            <CButton :disabled="activeDialog.processing" color="secondary" @click="confirm({confirm:false, activeDialog})">{{t('cancel')}}</CButton>
        </CModalFooter>
    </CModal>

</template>

<i18n src="@/i18n/dist/components/actions/workflow-actions.json"></i18n>    
<script setup lang="ts">    
    import moment from 'moment';
    import { useI18n } from 'vue-i18n';
    import { isWorkflowAssignedToMe, isWorkFlowCreatedByMe } from '@/utils'
    import { useToast } from 'vue-toast-notification';
    import { KmModalSpinner } from '@/components/controls';
    import { sleep } from '@/utils';
    import { useConfirmDialog } from '@/composables/useConfirmDialog'//'@vueuse/core'

    const props = defineProps({
        workflow: {
            type: Object,
            required: true
        }
    });    
    const emit = defineEmits(['onWorkflowAction']);

    const { $api }      = useNuxtApp();
    const security      = useSecurity();
    const { t, locale } = useI18n();
    const $toast        = useToast();
    const activeDialog  = ref({name:'', data:[], processing:false});
    const { isRevealed, reveal, confirm, cancel, onConfirm,  onCancel, } = useConfirmDialog();

    const daysToApproval = computed(()=>{
        const workflow = props.workflow;
        var expiryDate = moment.utc(workflow.createdOn)
                            .add(workflow.workflowAge.age, workflow.workflowAge.type);
        return expiryDate.diff(moment.utc(), 'days');
    })
    const openActivity   = computed(()=>{
        return props.workflow.activities?.
            filter(e=>!e.closedOn && !e.timedOut)?.
            sort((a,b)=>Date.parse(a.createdOn)-Date.parse(b.createdOn)).
            reverse()
    });


    async function updateActivity(actionData:object) {
        try{

            activeDialog.value.processing = true;
            let result;
            if(props.workflow.data.batchId)
                result = await $api.kmWorkflows.updateBatchActivity(props.workflow.data.batchId, props.workflow.activities[0].name, actionData)
            else
                result = await $api.kmWorkflows.updateActivity(props.workflow._id, props.workflow.activities[0].name, actionData);

            await sleep(5000) //sleep for 5 seconds 

            emit('onWorkflowAction', {
                action    : actionData.action,
                workflowId: props.workflow._id,
                batchId   : props.workflow.data.batchId,
                name      : props.workflow.activities[0].name,
                actionData
            });
            if(actionData.action == 'approve')
                $toast.success(t('approvedSuccessful'))
            else
                $toast.success(t('rejectedSuccessful'))
        }
        catch(error) {
            useLogger().error(error, t('error'));
        }

        activeDialog.value.processing = false;
    };

    async function confirmWorkflowRequestAction(dialog){
        activeDialog.value.name = dialog;
        const { data, isCanceled } = await reveal();       
        activeDialog.value = {name:'', data:[], processing:false};

    }

    async function confirmCancelWorkflowRequest(workflow:Object){
        activeDialog.value.name = 'confirmCancellation';
        const { data, isCanceled } = await reveal();       
        activeDialog.value = {name:'', data:[], processing:false};

    }

    onConfirm(async (data)=>{

        if(!data?.confirm)
            return;

        if(data.activeDialog.name == 'confirmCancellation')
            return deleteWorkflowRequest(data);
        else
            return updateActivity(data.actionData)//'confirmRejection', 'approve'
    });

    async function deleteWorkflowRequest(data){

        try{
            data.activeDialog.processing = true;
            let result;
            if(props.workflow.data.batchId)
                result = await $api.kmWorkflows.cancelBatch(props.workflow.data.batchId)
            else
                result = await $api.kmWorkflows.cancelWorkflow(props.workflow._id);

            await sleep(5000) //sleep for 5 seconds 

            emit('onWorkflowAction', {
                action    : 'canceled',
                workflowId: props.workflow._id,
                batchId   : props.workflow.data.batchId,
                name      : props.workflow.activities[0].name
            });

            $toast.success(t('canceledSuccessful'))
        }
        catch(error) {
            useLogger().error(error, t('error'));
        }
    }

</script>

<style scoped></style>