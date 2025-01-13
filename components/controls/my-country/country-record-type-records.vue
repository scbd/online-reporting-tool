<template>
    <button class="btn btn-danger btn-sm float-end" v-if="hasFilters" @click="clearFilters">{{ t('clearFilters') }}</button>
    <div id="filters" class="row">
        <div class="col-md-4"  v-if="recordTitles?.length">
            <km-form-group :caption="t('filterByTitle')">
                <km-select
                    v-model="selectedTitles"
                    class="validationClass"
                    label="title"
                    track-by="identifier"
                    value-key="identifier"
                    :options="recordTitles"
                    :multiple="true"
                    :close-on-select="false"
                    :custom-label="customLabel"
                    :custom-selected-item="customSelectedItem">
                </km-select>
            </km-form-group>
        </div>
        <div class="col-md-4" v-if="hasGbfObjectives">
            <km-form-group :caption="t('filterByGlobalTargets')">
                <gbf-targets v-model="selectedGlobalTargets" :multiple="true"></gbf-targets>
            </km-form-group>
        </div>
        <div class="col-md-4" v-if="hasGbfObjectives">
            <km-form-group :caption="t('filterByGlobalGoals')">
                <gbf-goals v-model="selectedGlobalGoals" :multiple="true"></gbf-goals>
            </km-form-group>
        </div>
    </div>
    <div class="table-responsive">       
        <table class="table" v-if="nationalRecords?.length">
            <thead>
                <tr>
                    <th scope="col">{{t('title')}}</th>
                    <th scope="col" v-if="hasGbfObjectives">{{t('gbfGoals')}}</th>
                    <th scope="col">{{t('status')}}</th>
                    <th scope="col">{{t('updatedOn')}}</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(document,  index) in nationalRecordsFiltered" :key="document.identifier" :class="{'table-danger':document.errors}">
                    <td class="w-50">
                        <slot name="recordTitle" :document="document">
                            {{lstring(document.workingDocumentTitle||document.title, locale)}}
                        </slot>
                    </td>                                
                    <td class="w-15" id="linkedGbfTour" v-if="hasGbfObjectives">
                        <goal-target-list :goal-targets="getAlignedGoalsOrTargets(document.workingDocumentBody||document.body)"></goal-target-list>   
                    </td>                   
                    <td id="recordStatusTour">
                        <km-spinner message=" " color="info"  v-if="document.isValidating"></km-spinner>
                        <CBadge color="info" v-if="document.isValidating">{{ t('validating') }}</CBadge>
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

<i18n src="@/i18n/dist/components/controls/my-country/country-record-type-records.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    import { getAlignedGoalsOrTargets } from '@/components/pages/national-targets/my-country/part-2/util';  
    
    const props = defineProps({
        nationalRecords: { type: Array<EDocumentInfo>, required: true },
        viewRoute      : { type:String, require:true },
        hasGbfObjectives : { type:Boolean, require:false, default:true }
    });

    const emit = defineEmits(['onEditRecord', 'onDeleteRecord', 'onRecordStatusChange'])

    const { t, locale } = useI18n();
    const selectedGlobalTargets = ref([]);
    const selectedGlobalGoals   = ref([]);
    const selectedTitles        = ref([]);

    const hasFilters   = computed(()=>selectedTitles.value?.length||selectedGlobalTargets.value?.length||selectedGlobalGoals.value?.length)
    const recordTitles = computed(()=>{
        const list     = props.nationalRecords?.map(e=>{
                            return { title : e.workingDocumentTitle||e.title, identifier: e.identifier }
                        })
        if(list?.length)
            return sortBy(list, 'title')
    })

    const nationalRecordsFiltered = computed(()=>{
        return props.nationalRecords
                ?.filter(e=>{
                    if(selectedTitles.value?.length){
                        return selectedTitles.value.find(s=>s.identifier == e.identifier)
                    }
                    return e;
                })
                ?.filter(e=>{ 
                    if(selectedGlobalTargets.value?.length){
                        let targets = (e.workingDocumentBody||e.body)
                        targets = targets?.globalTargetAlignment || [targets.globalGoalOrTarget] ||[];
                        return targets.find(t=>selectedGlobalTargets.value.find(s=>s.identifier == t?.identifier))
                    }
                    return e;                    
                })
                ?.filter(e=>{ 
                    if(selectedGlobalGoals.value?.length){
                        let goals = (e.workingDocumentBody||e.body)
                        goals     = goals?.globalGoalAlignment || [goals.globalGoalOrTarget] ||[];
                        return goals.find(t=>selectedGlobalGoals.value.find(s=>s.identifier == t?.identifier))
                    }
                    return e;                    
                })
    })

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

    const clearFilters = ()=>{
        selectedGlobalTargets.value = [];
        selectedTitles       .value = [];
        selectedGlobalGoals.value   = [];
    }
</script>

<style scoped></style>