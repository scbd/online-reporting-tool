<template>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>Request type</th>
                <th>Record type</th>
                <th>Title</th>
                <th>Requested by</th>
                <th>Requested on</th>
                <th>Expiry</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="workflow in workflows" :key="workflow">
                <td>
                    <span class="text-uppercase fw-bold ps-2 fs-small-8">
                        <span v-if="workflow.type.name =='publishNationalRecord'" class="text-secondary">
                            {{t('publish')}}
                        </span>
                        <span v-if="workflow.type.name=='deleteRecord'" class="text-danger">
                            {{t('delete')}} </span>
                    </span>
                </td>
                <td>
                    <schema-title :schema="workflow.data.metadata.schema"></schema-title>
                </td>
                <td>{{lstring(workflow.data.title, locale)}}</td>
                <td>
                    <a rel="noopener" class="text-secondary fs-small-8" :href="`mailto:${workflow?.createdBy_info?.email}`">
                        {{workflow?.createdBy_info?.firstName + ' ' + workflow?.createdBy_info?.lastName }}
                        ({{workflow.createdBy_info.email}})
                    </a>
                </td>
                <td class="text-lowercase fw-bold fs-small-8">
                    {{formatDate(workflow.createdOn)}}
                </td>
                <td>{{ formatDate(workflow.workflowExpiryDate) }}</td>
                <td>
                    <km-link class="btn btn-success" 
                        :to="`${resolveSchemaViewRoute(workflow.data.metadata.schema, workflow.data.identifier)}?draft=true&workflowId=${workflow._id}`">
                        View request
                    </km-link>
                </td>
            </tr>
        </tbody>
    </table>   
</template>

<script setup lang="ts">
    import moment from 'moment';
    
    const emit = defineEmits(['onLoad']);

    const {$api}   = useNuxtApp();
    const realm    = useRealm();
    const { user } = useAuth();
    const {t, locale} = useI18n();

    const workflows = ref([]);
    
    async function loadWorkflows(schemas:string[]){

        const expired = moment.utc(new Date()).subtract("12", "weeks");
        const query = {
            $and : [
                // { "activities.assignedTo"  : user.value.userID } ,
                {
                    $or:[
                            {"createdBy": user.value.userID}, 
                            {"activities.assignedTo": user.value.userID},
                            {"data.metadata.government": user.value.government}
                        ] 
                },
                { "closedOn"               : { $exists : false } },
                { "batchId"                : { $exists : false } },                
                { "data.realm"             : realm.realm },
                { activities    : { $gt: []  }},
                { "state": 'running', "createdOn": {"$gte": expired }}
            ]
        };

        if(schemas?.length)
            query.$and.push({ "data.metadata.schema": { $in: schemas }});
            
        const data = await $api.kmWorkflows.getWorkflows(query, {length:20});

        workflows.value = data?.map(workflow=>{
            workflow.workflowExpiryDate = moment.utc(workflow.createdOn)
                                    .add(workflow.workflowAge.age, workflow.workflowAge.type);
            return workflow;
        });

        emit('onLoad', workflows.value);
    }

    onMounted(()=>{
        loadWorkflows([]);
    });
</script>

<style scoped>


</style>