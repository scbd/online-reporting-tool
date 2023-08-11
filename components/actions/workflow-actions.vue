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
                    >{{ formatDateWithTime(workflow.createdOn) }} </span>
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
        <div v-for="(activity, index)  in  workflow.activities" :key=" activity " class="m-2">
            <div class="d-grid gap-1 d-md-flex" v-if="isWorkflowAssignedToMe(activity)">
                <button type="button" class="btn btn-success bold" @click="updateActivity({ action : 'approve' })"
                    :disabled=" isUpdating " v-if=" activity.name != 'deleteRecord' ">
                    <span>{{t('approve')}}</span>
                </button>
                <button type="button" class="btn btn-danger bold" @click="confirmDelete()" :disabled=" isUpdating "
                    v-if=" activity.name == 'deleteRecord' ">
                    <span>{{t('delete')}}</span>
                </button>
                <button type="button" class="btn btn-warning bold" @click="showRejectDialog()" :disabled=" isUpdating ">
                    <span v-if=" activity.name == 'deleteRecord' ">{{t('rejectNotDelete')}}</span>
                    <span v-if=" activity.name != 'deleteRecord' ">{{t('reject')}}</span>
                </button>
            </div>

            <div v-if="isWorkFlowCreatedByMe(workflow)">
                <button type="button" class="btn btn-warning bold" @click="askCancelWorkflowRequest()"
                    :disabled=" isUpdating ">
                    <span> {{t('cancelRequest')}}</span>
                </button>
            </div>
            <div v-if="security.role.isAdministrator() ">
                <br />
                <strong>{{t('workFlowAssign')}} {{activity.createdOn | formatDateWithTime}}</strong> ({{t('visible')}})
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
</template>
<i18n src="@/i18n/dist/components/controls/workflow-actions.json"></i18n>
<script setup lang="ts">
    import moment from 'moment';
    import { useI18n } from 'vue-i18n';
    import { isWorkflowAssignedToMe, isWorkFlowCreatedByMe } from '@/utils'


    const props = defineProps({
        workflow: {
            type: Object,
            required: true
        }
    });    
    const emit = defineEmits(['']);

    const { $api }      = useNuxtApp();
    const security      = useSecurity();
    const { t, locale } = useI18n();

    const daysToApproval = computed(()=>{
        const workflow = props.workflow;
        var expiryDate = moment.utc(workflow.createdOn)
                            .add(workflow.workflowAge.age, workflow.workflowAge.type);
        return expiryDate.diff(moment.utc(), 'days');
    })

    function formatDateWithTime(date){
        return date;
    }

    async function updateActivity(actionData:object, cancelRequest:boolean) {

        try{
            let result;
            if(props.workflow.data.batchId)
                result = await $api.kmWorkflows.updateBatchActivity(props.workflow.data.batchId, props.workflow.activities[0].name, actionData)
            else
                result = await $api.kmWorkflows.updateActivity(props.workflow._id, props.workflow.activities[0].name, actionData)
            
            
        }
        catch(error) {
            useLogger().error(error, 'There was an error processing your request, please try again.');
        }
    };

</script>

<style scoped></style>