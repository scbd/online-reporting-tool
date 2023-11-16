<template>
    <table class="table" v-if="nationalRecords?.length">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">GBF goal(s) and target(s)</th>
                <th scope="col">Status</th>
                <th scope="col">Updated on</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(document,  index) in nationalRecords" :key="document.identifier" :class="{'bg-danger':document.errors}">
                <th scope="row">{{ index+1 }}</th>
                <td class="w-50">
                    <slot name="recordTitle" :document="document">
                        {{(document.workingDocumentTitle||document.title).en}}
                    </slot>
                </td>                                
                <td class="w-25">
                    <goal-target-list :goal-targets="getAlignedGoalsOrTargets(document.workingDocumentBody||document.body)"></goal-target-list>   
                </td>                   
                <td>
                    <CBadge color="info" v-if="document.isValidating">
                            <km-spinner :message="t('validating')+ '...'"></km-spinner>
                    </CBadge>
                    <CBadge color="warning" v-if="!document.isValidating && document.errors">
                        {{t('hasErrors')}} ({{ document.errors.length }})
                    </CBadge>
                    <CBadge color="info" v-if="document.validated && !document.isValidating && !document.errors">
                        {{t('passedValidation')}}
                    </CBadge>
                    <km-document-status :document="document" @on-status-change="onRecordStatusChange"></km-document-status>
                </td>
                <td>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton :disabled="document.isValidating" color="secondary" size="sm"  @click="navigateToRoute(document)">
                        <font-awesome-icon icon="fa-search" /> View
                    </CButton>
                    <CButton :disabled="document.isValidating || document.disableActions || isEditAllowed(document)" color="secondary" size="sm"
                         @click="onEditRecord(document)">
                        <font-awesome-icon icon="fa-edit" /> Edit
                    </CButton>
                    <km-delete-record :document="document" @on-delete="onDeleteRecord"></km-delete-record>
                </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util';  

    const props = defineProps({
        nationalRecords: { type: Array<EDocumentInfo>, required: true },
        viewRoute      : { type:String, require:true }
    });

    const emit = defineEmits(['onEditRecord', 'onDeleteRecord', 'onRecordStatusChange'])

    const { t } = useI18n();
    const { nationalRecords } = toRefs(props);


    function navigationUrl(document){
         
         const query = {};
         const path = props.viewRoute.replace(':identifier', document?.identifier||document?.header?.identifier);
 
         if(document.workingDocumentBody)
             query.draft = true //open draft record view page
 
         return {
             path, query
         }
     }

    const navigateToRoute = async (document:any)=>{
        
        const {path, query} = navigationUrl(document)

        await useNavigateAppTo({path, query}, {});
    }

    function isEditAllowed(document:EDocumentInfo){
        return !!document?.workingDocumentLock
    }

    const onEditRecord = (documentInfo:EDocumentInfo)=>{
        emit('onEditRecord', documentInfo)
    }

    const onDeleteRecord = ({identifier, type})=>{
        emit('onDeleteRecord', {identifier, type})
    }

    const onRecordStatusChange = ({workflowActivity, identifier, schema, newDocument})=>{
        emit('onRecordStatusChange', {workflowActivity, identifier, schema, newDocument})
    }
</script>

<style scoped></style>