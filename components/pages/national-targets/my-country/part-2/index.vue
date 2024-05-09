<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <font-awesome-icon icon="fa-layer-group" /> {{ t('headerTitle') }} </slot>
        </CCardHeader>
        <CCardBody>
            
            <div class="mt-1">

                <CRow class="mb-2">
                    <CCol :sm="6" class="d-grid gap-1 d-md-flex">
                        <label>{{t('filter')}} </label>
                        <select v-model="filterBy" class="form-select" style="width:30%">
                            <option disabled value="">{{t('selectOne')}}</option>
                            <option v-for="filter in filters" :value="filter.value" :key="filter.value">{{ filter.title }}</option>
                        </select>
                    </CCol>
                    <CCol :sm="6" class="float-end">
                        <div class="d-grid gap-1 d-md-flex justify-content-end mb-2">
                            <km-link :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY" :title="t('overview')" 
                                role="button" class="btn btn-sm btn-secondary" icon="fa-wand-magic-sparkles">
                            </km-link> 
                            <toggle-accordion ref="accordionToggle" selector="#mapping-accordion .accordion-header button.accordion-button" v-if="computedTargets"></toggle-accordion>
                        </div>
                    </CCol>
                </CRow>
                
                <km-spinner v-if="isBusy" center></km-spinner>

                <CAccordion always-open id="mapping-accordion">                    
                    <CAccordionItem :item-key="index+1" :visible="true" v-for="(target, index) in computedTargets" :key="target">
                        <CAccordionHeader :id="'gbfTarget'+target.identifier">
                            {{lstring(target.title)}}                           
                        </CAccordionHeader>
                        <CAccordionBody>
                            <div class="d-grid gap-1 d-md-flex justify-content-end mb-2" v-if="target.nationalTargets?.length">
                                <CButton color="primary" size="sm" @click="showEditMapping(target)" v-if="target.nationalMapping" :disabled="target.nationalMapping && target.nationalMapping.workingDocumentLock">
                                    <font-awesome-icon icon="fa-edit"></font-awesome-icon>
                                    {{ t('editMapping') }}
                                </CButton>
                                <CButton color="primary" size="sm" @click="showEditMapping(target)" v-if="!target.nationalMapping && target.nationalTargets">
                                    <font-awesome-icon icon="fa-plus"></font-awesome-icon>
                                    {{ t('addMapping') }}
                                </CButton>
                                <km-delete-record class="float-end" v-if="target.nationalMapping && target.nationalTargets" :document="target.nationalMappingInfo"  @on-delete="onRecordDelete"></km-delete-record>
                            </div>
                            <table class="table table-bordered table-hover">                            
                            <tbody>
                                <tr>
                                    <td  style="width: 40%;">
                                        <strong> <span class="text">{{ t('linkedTargetsTitle') }} </span></strong>
                                    </td>
                                    <td colspan="2">
                                        <strong>{{ t('elementsOfInfo') }}</strong>
                                        <div class="form-text text-muted">{{t('addEditMapping')}}</div>
                                    </td>
                                </tr>
                                <tr v-for="(nationalTarget, index) in target.nationalTargets" :key="nationalTarget.identifier">
                                    <td style="width: 40%;">{{lstring(nationalTarget.title)}}</td>
                                    <td colspan="2" :rowspan="target.nationalTargets.length" v-if="index==0">
                                        <label></label>
                                        <km-lstring-value class="mt-2" type="html" v-if="target.elementOfGlobalTargetsInfo"
                                            :value="target.elementOfGlobalTargetsInfo" :locale="useI18n().locale"></km-lstring-value>
                                    </td>                                
                                </tr>
                                <tr v-if="!target.nationalTargets?.length">
                                    <td colspan="3">
                                        <missing-target-error :query="{'globalTarget' : target.identifier}"></missing-target-error>                                        
                                    </td>
                                </tr>
                                <tr v-if="target.headlineIndicators.length">
                                    <td colspan="3">
                                        &nbsp;                                       
                                    </td>
                                </tr>
                                <tr v-if="target.headlineIndicators.length">
                                    <td style="width: 40%;">
                                        <strong>{{ t('headlineIndicators') }}</strong>
                                    </td>
                                    <td colspan="2">
                                        <strong>{{ t('referencePeriod') }}</strong>
                                        <div class="form-text text-muted">{{t('addEditMapping')}}</div>
                                    </td>
                                </tr>
                                <tr v-for="(indicator, index) in target.headlineIndicators" :key="indicator.identifier">
                                    <td style="width: 40%;">
                                        {{lstring(indicator.title)}}
                                    </td>
                                    <td v-if="indicator.nationalTargets.length" colspan="2">
                                        <div v-if="indicator.referencePeriod">
                                            <CBadge v-if="indicator.referencePeriod.hasReferencePeriod" color="success" shape="rounded-pill">{{ t('hasReferencePeriod') }}</CBadge>
                                            <CBadge v-if="indicator.referencePeriod.hasReferencePeriod===false" color="danger" shape="rounded-pill">
                                                {{t('noReferencePeriod')}}
                                            </CBadge>
                                            <km-lstring-value class="mt-2" type="html" v-if="indicator.referencePeriod.referencePeriodInfo"
                                            :value="indicator.referencePeriod.referencePeriodInfo" :locale="locale"></km-lstring-value>
                                        </div>
                                    </td> 
                                </tr>
                                <tr v-if="target.otherIndicators.length">
                                    <td colspan="3">
                                        <strong>{{ t('otherIndicators') }}</strong>
                                    </td>                             
                                </tr>
                                <tr v-for="(indicator, index) in target.otherIndicators" :key="indicator.identifier">
                                    <td colspan="3">
                                        {{lstring(indicator.title)}}
                                    </td>
                                </tr>
                            </tbody>
                          </table>
                        </CAccordionBody>
                    </CAccordionItem>
                </CAccordion>       
            </div>
        </CCardBody>
      
      </CCard> 
      <CModal  class="show d-block nationalTargetsPart2Edit" size="xl" alignment="center" backdrop="static" @close="() => {showEditMappingModal=false}" :visible="showEditMappingModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>{{lstring(editMappingTarget.title)}}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <edit-target-part-2 :global-goal-or-target="editMappingTarget.identifier" 
                :identifier="editMappingTarget.nationalMapping ? editMappingTarget.nationalMapping.header.identifier : undefined"
                :headline-indicators="editMappingTarget.headlineIndicators" container=".nationalTargetsPart2Edit"
                @on-close="closeEditMappingDialog">
            </edit-target-part-2>
        </CModalBody>   
    </CModal>

</template>
  
<i18n  src="@/i18n/dist/pages/national-reports/index.json"></i18n>

<script setup lang="ts">
    import missingTargetError from '../missing-target-error.vue';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { scrollToElement } from '@/utils';
    import { useRoute } from 'vue-router' 
    import { buildTargetMatrix } from "./util";
    import { useStorage } from '@vueuse/core'
    import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";
    
    import { sortBy } from "lodash";

    const rowsPerPage = UTILS.ROWS_PER_PAGE_300;
    const { $appRoutes:appRoutes } = useNuxtApp();
    const route    = useRoute();
    const localePath  = useLocalePath()
    const { t, locale }       = useI18n(); 
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });

    const isBusy = ref(false);
    const gbfGoalAndTargetList = ref(null);
    const showEditMappingModal = ref(false);
    const editMappingTarget    = ref(null);
    const filterBy             = ref(null);
    const accordionToggle      = ref(null);

    const EditTargetPart2 = defineAsyncComponent(() =>
        import('./edit-target-part-2.vue')
    )

    const filters = [
        {value : 'all', title: 'All'},
        {value : 'missingMapping', title: 'Missing national mapping record (part II)'},
        {value : 'missingTarget', title: 'Missing national target record (part I)'},
        {value : 'hasMapping', title: 'Has national mapping record (part II)'},
        {value : 'hasTarget', title: 'Has national target record (part I)'}
    ]

    const computedTargets = computed(()=>{
        let list = gbfGoalAndTargetList.value||[];
        if(list?.length && filterBy.value){
            if(filterBy.value == 'missingMapping')
                list = list.filter(e=>!e.nationalMapping);
            else if(filterBy.value == 'missingTarget')
                list = list.filter(e=>!e.nationalTargets?.length);
            else if(filterBy.value == 'hasMapping')
                list = list.filter(e=>e.nationalMapping);
            else if(filterBy.value == 'hasTarget')
                list = list.filter(e=>e.nationalTargets?.length);
        }
        return sortBy(list, 'identifier');
    })

    onMounted(() => {

        isBusy.value = true;  
        setTimeout(()=> {
            init();            
        }, 200)
    })
        
    async function loadRecords(query){

        const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true),
                            KmDocumentsService.loadDocuments(query,rowsPerPage, 'updatedOn desc', 0, true)]);  

        return [...result[0].Items,
                ...result[1].Items.filter(e=>!result[0].Items?.find(draft=>draft.identifier == e.identifier))]

    }

    function showEditMapping(target){
        
        editMappingTarget.value = target
        showEditMappingModal.value = true;
    }

    async function closeEditMappingDialog(document:Object){
        if(document){
            editMappingTarget.value.elementOfGlobalTargetsInfo = document?.elementOfGlobalTargetsInfo;
            editMappingTarget.value.nationalMapping            = document;
            editMappingTarget.value.headlineIndicators.forEach(indicator => {
                indicator.referencePeriod = document?.referencePeriod?.find(e=>e.headlineIndicator.identifier == indicator.identifier);
            });
        }

        showEditMappingModal.value = false;
        editMappingTarget.value = null;
    }

    async function init(){
        try{
            isBusy.value = true;            

            const response = await Promise.all([
                GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators(), 
                loadRecords(`(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`), 
                loadRecords(`(type eq '${SCHEMAS.NATIONAL_TARGET_7_MAPPING}')`)
            ]);

            let targets            = [...response[0]];
            const nationalTargets  = response[1]
            const nationalMappings = response[2];
            
            targets = buildTargetMatrix(targets, nationalTargets, nationalMappings);
            gbfGoalAndTargetList.value = sortBy(targets, 'identifier');
            
            nextTick(()=>accordionToggle.value.toggle(true))

            if(route?.query?.globalTarget){
                setTimeout(() => {
                    scrollToElement(`#gbfTarget${route.query.globalTarget}`);
                }, 200);
                const target = gbfGoalAndTargetList.value?.find(e=>e.identifier == route.query.globalTarget);
                if(target?.nationalTargets?.length)
                    showEditMapping(target)
            }
        }
        catch(e){
            useLogger().error(e)
        }
        finally{
            isBusy.value = false;
        }
        
    }
    async function onRecordDelete({identifier, type}){

        // if(type != 'draft'){
        //     publishedNationalTargets.value = publishedNationalTargets.value.filter(e=>e.identifier != identifier)
        // }

        // draftNationalTargets.value     = draftNationalTargets.value.filter(e=>e.identifier != identifier)

        const globalTarget = gbfGoalAndTargetList.value?.find(e=>e.nationalMappingInfo?.identifier == identifier)
        if(type != 'draft'){ // if published version is deleted than clear everything
            globalTarget.nationalMapping = undefined;
            globalTarget.nationalMappingInfo = undefined;
        }
        else{
            globalTarget.nationalMappingInfo = await KmDocumentsService.loadDocument(identifier);
            globalTarget.nationalMapping     = globalTarget.nationalMappingInfo.body;
        }

    }

</script>