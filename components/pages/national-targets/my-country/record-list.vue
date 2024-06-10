<template>
    <div class="table-responsive">

    <table class="table" v-if="nationalRecords?.length">
        <thead>
            <tr>
                <th scope="col">{{t('title')}}</th>
                <th scope="col">{{t('gbfGoals')}}</th>
                <th scope="col">{{t('status')}}</th>
                <th scope="col">{{t('updatedOn')}}</th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(document,  index) in nationalRecords" :key="document.identifier" :class="{'bg-danger':document.errors}">
                <td class="w-50">
                    <slot name="recordTitle" :document="document">
                        {{lstring(document.workingDocumentTitle||document.title, locale)}}
                    </slot>
                </td>                                
                <td class="w-15" id="linkedGbfTour">
                    <goal-target-list :goal-targets="getAlignedGoalsOrTargets(document.workingDocumentBody||document.body)"></goal-target-list>   
                </td>                   
                <td id="recordStatusTour">
                    <CBadge color="info" v-if="document.isValidating">
                            <km-spinner :message="t('validating')"></km-spinner>
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
                    {{formatDate(document.updatedOn)}}<br/>
                    {{ document.updatedBy.firstName }} {{ document.updatedBy.lastName }}
                </td>
                <td>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton :disabled="document.isValidating" color="secondary" size="sm"  @click="navigateToRoute(document)">
                            <font-awesome-icon icon="fa-search" /> {{t('view')}}
                        </CButton>
                        <CButton :disabled="document.isValidating || document.disableActions || isEditAllowed(document)" color="secondary" size="sm"
                            @click="onEditRecord(document)">
                            <font-awesome-icon icon="fa-edit" /> {{t('edit')}}
                        </CButton>
                        <km-delete-record :document="document" @on-delete="onDeleteRecord"></km-delete-record>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/record-list.json"></i18n>
<script setup lang="ts">
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util';  

    const props = defineProps({
        nationalRecords: { type: Array<EDocumentInfo>, required: true },
        viewRoute      : { type:String, require:true }
    });

    const emit = defineEmits(['onEditRecord', 'onDeleteRecord', 'onRecordStatusChange'])

    const { t, locale } = useI18n();
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

        await useNavigateAppTo(path, {query});
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