<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> {{ t('headerTitle') }} </slot>
        </CCardHeader>
        <CCardBody>
            
          <div class="mt-1">

                <km-spinner-suspense v-if="isBusy"></km-spinner-suspense>
                <CRow>
                    <CCol :sm="6">
                        <label>Filter </label>
                        <select v-model="filterBy" class="form-select" style="width:30%">
                            <option disabled value="">Please select one</option>
                            <option v-for="filter in filters" :value="filter.value" :key="filter.value">{{ filter.title }}</option>
                        </select>
                    </CCol>
                    <CCol :sm="6">
                        <CButton class="float-end mr-1 mb-1 btn-xs" color="primary" size="sm" @click="toggleAccordion()" v-if="computedTargets">
                            <span v-if="!accordionOpen">{{ t('openAll') }}</span>
                            <span v-if="accordionOpen" >{{ t('closeAll') }}</span>
                        </CButton>
                    </CCol>
                </CRow>
                
                <br>
                <br>
                <CAccordion always-open id="mapping-accordion">                    
                    <CAccordionItem :item-key="index+1" :visible="true" v-for="(target, index) in computedTargets" :key="target">
                        <CAccordionHeader :id="'gbTraget_'+target.identifier">
                            {{lstring(target.title)}}                           
                        </CAccordionHeader>
                        <CAccordionBody>
                            <div class="d-grid gap-1 d-md-flex justify-content-end mb-2" v-if="target.nationalTargets?.length">
                                <CButton color="primary" size="sm" @click="showEditMapping(target)" v-if="target.nationalMapping" :disabled="target.nationalMapping && target.nationalMapping.workingDocumentLock">
                                    {{ t('editMapping') }}
                                </CButton>
                                <CButton color="primary" size="sm" @click="showEditMapping(target)" v-if="!target.nationalMapping && target.nationalTargets">
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
                                        <div class="form-text text-muted">Click the Add/Edit mapping button to edit this section</div>
                                    </td>
                                </tr>
                                <tr v-for="(nationalTarget, index) in target.nationalTargets" :key="nationalTarget.identifier">
                                    <!-- <td></td> -->
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
                                        <div class="form-text text-muted">Click the Add/Edit mapping button to edit this section</div>
                                    </td>
                                </tr>
                                <tr v-for="(indicator, index) in target.headlineIndicators" :key="indicator.identifier">
                                    <td style="width: 40%;">
                                        {{lstring(indicator.title)}}
                                    </td>
                                    <td v-if="indicator.nationalTargets.length" colspan="2">
                                        <div v-if="indicator.referencePeriod">
                                            <CBadge v-if="indicator.referencePeriod.hasReferencePeriod" color="success" shape="rounded-pill">{{ t('hasReferencePeriod') }}</CBadge>
                                            <CBadge v-if="indicator.referencePeriod.hasReferencePeriod===false" color="danger" shape="rounded-pill">{{t('noReferencePeriod')}}</CBadge>
                                            <km-lstring-value class="mt-2" type="html" v-if="indicator.referencePeriod.referencePeriodInfo"
                                            :value="indicator.referencePeriod.referencePeriodInfo" :locale="useI18n().locale"></km-lstring-value>
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
              <!-- </div> -->
          </div>
        </CCardBody>
      
      </CCard> 
      <CModal  class="show d-block nbsapTargetsPart2Edit" size="xl" alignment="center" backdrop="static" :visible="showEditMappingModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>{{lstring(editMappingTarget.title)}}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <edit-target-part-2 :global-goal-or-target="editMappingTarget.identifier" 
                :identifier="editMappingTarget.nationalMapping ? editMappingTarget.nationalMapping.header.identifier : undefined"
                :headline-indicators="editMappingTarget.headlineIndicators" container="nbsapTargetsPart2Edit"
                :on-close="closeEditMappingDialog">
            </edit-target-part-2>
        </CModalBody>   
    </CModal>

</template>
  
<i18n  src="@/i18n/dist/pages/national-reports/index.json"></i18n>

<script setup lang="ts">
  import { KmSpinnerSuspense, KmInputRichLstring, KmSelect, KmFormGroup, KmLstringValue,
             KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmNavLink, KmDeleteRecord
           } from "@/components/controls";
    import missingTargetError from '../missing-target-error.vue';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { CModalFooter } from "@coreui/vue";
    import { scrollToElement } from '@/utils';
    import { useRoute } from 'vue-router' 
    import { buildTargetMatrix } from "./util";
    import { useStorage } from '@vueuse/core'
    import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";
    import $ from 'jquery';
    import { sortBy } from "lodash";

    let   accordionOpen = ref(false);
    const rowsPerPage = 300; // UTILS.ROWS_PER_PAGE;
    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user } = useAuth();
    const security = useSecurity();
    const route    = useRoute();
    const localePath  = useLocalePath()
    const { t }       = useI18n(); 
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });

    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();

    const isBusy = ref(false);
    const gbfGoalAndTargetList = ref(null);
    const showEditMappingModal = ref(false);
    const editMappingTarget    = ref(null);
    const filterBy             = ref(null);

    const EditTargetPart2 = defineAsyncComponent(() =>
        import('./edit-target-part-2.vue')
    )

    const filters = [
        {value : 'missingMapping', title: 'Missing national mapping record'},
        {value : 'missingTarget', title: 'Missing national target record'},
        {value : 'hasMapping', title: 'Has national mapping record'},
        {value : 'hasTarget', title: 'Has national target record'}
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
        setTimeout(async () => {
            await init();
            // .then(()=>{

                if(route?.query?.globalTarget){
                    setTimeout(() => {
                        scrollToElement(`#gbTraget_${route.query.globalTarget}`);
                    }, 200);
                    const target = gbfGoalAndTargetList.value?.find(e=>e.identifier == route.query.globalTarget);
                    if(target?.nationalTargets?.length)
                        showEditMapping(target)
                }
            // });
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
        
        editMappingTarget.value.elementOfGlobalTargetsInfo = document?.elementOfGlobalTargetsInfo;
        editMappingTarget.value.nationalMapping            = document;
        editMappingTarget.value.headlineIndicators.forEach(indicator => {
            indicator.referencePeriod = document?.referencePeriod?.find(e=>e.headlineIndicator.identifier == indicator.identifier);
        });

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

            setTimeout(()=>toggleAccordion(true), 1000);
        }
        catch(e){
            useLogger().error(e)
        }
        finally{
            isBusy.value = false;
        }
        
    }

    function toggleAccordion(open){
        accordionOpen.value = open || !accordionOpen.value;
        const buttons = $('#mapping-accordion .accordion-header button.accordion-button');
        buttons.each(function(){
            const ariaExpanded = $(this)[0].ariaExpanded == "true";
            if((accordionOpen.value && ariaExpanded) || (!accordionOpen.value && !ariaExpanded))
                $(this).click();
        })
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