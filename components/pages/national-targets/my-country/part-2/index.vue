<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> Global Goals/Targets mapping </slot>
        </CCardHeader>
        <CCardBody>
          <!-- <div class="card">
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end"> -->
                <!-- <NuxtLink to="/national-targets/new"> -->
                  <!-- <CButton color="secondary" size="sm" @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW, {})">
                    <CIcon icon="addthis"/> Submit new target
                  </CButton> -->
                <!-- </NuxtLink> -->
                <!-- <CButton color="secondary m-1">
                  <CIcon icon="cil-save"/> Save
                </CButton> -->
                <!-- <CButton color="success m-1">
                  <CIcon icon="cil-save"/> Publish
                </CButton>
                <CButton color="warning m-1">
                  <CIcon icon="cil-share"/> Share
                </CButton>

                <CButton color="danger m-1">
                  <CIcon icon="cil-file-pdf"/> PDF
                </CButton> -->
              <!-- </div>
            </div>
          </div> -->
         
          <div class="mt-3">
              <!-- <div class="card-header bg-secondary">
                Global Goals/Targets
              </div>
              <div class="card-body"> -->
                <km-spinner-suspense v-if="isBusy"></km-spinner-suspense>

                <table class="table table-hover table-bordered">
                  
                  <tbody>
                    <template v-for="(target, index) in gbfGoalAndTargetList" :key="target">                        
                      <tr class="bg-secondary" :id="'gbTraget_'+target.identifier">
                        <td>
                            {{lstring(target.title)}}
                            <div class="d-grid justify-content-end" v-if="target.nationalTargets?.length">
                                <CButton color="primary" size="sm" @click="showEditMapping(target)" v-if="target.nationalMapping" :disabled="target.nationalMapping && target.nationalMapping.workfinDocumentLock">
                                    Edit mapping
                                </CButton>
                                <CButton color="primary" size="sm" @click="showEditMapping(target)" v-if="!target.nationalMapping && target.nationalTargets">
                                    Add mapping
                                </CButton>
                            </div>
                        </td> 
                      </tr>
                      <tr>
                        <td>
                          <table class="table table-bordered">                            
                            <tbody>
                                <tr>
                                    <!-- <td></td> -->
                                    <td colspan="2">
                                        <strong> <span class="text">National target(s) linked to this global Goal/Target </span></strong>
                                        <!-- for <strong>{{lstring(target.title)}}</strong> -->
                                    </td>
                                    <td>
                                        <strong>Element of Global Targets information</strong>
                                    </td>
                                </tr>
                                <tr v-for="(nationalTarget, index) in target.nationalTargets" :key="nationalTarget.identifier">
                                    <!-- <td></td> -->
                                    <td colspan="2">{{lstring(nationalTarget.title)}}</td>
                                    <td :rowspan="target.nationalTargets.length" v-if="index==0">
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
                                    <td style="width: 20%;">
                                        <strong>Headline Indicators</strong>
                                    </td>
                                    <!-- <td>
                                        <strong>National target(s) linked to headline indicator</strong>
                                    </td> -->
                                    <td colspan="2"><strong>Reference period</strong></td>
                                </tr>
                                <tr v-for="(indicator, index) in target.headlineIndicators" :key="indicator.identifier">
                                    <td style="width: 20%;">
                                        {{lstring(indicator.title)}}
                                    </td>
                                    <!-- <td :colspan="indicator.nationalTargets.length ? 1 : 2">
                                        <div v-for="target in indicator.nationalTargets">
                                            {{lstring(target.title)}}
                                        </div> -->

                                        <!-- <missing-target-error  v-if="!indicator.nationalTargets.length"
                                            :query="{'globalTarget' : target.identifier, headlineIndicator:indicator.identifier}">
                                            <template #message>
                                                <span v-html="t('indicatorMissingTarget')"></span>
                                            </template>
                                        </missing-target-error>    -->
                                    <!-- </td> -->
                                    <td v-if="indicator.nationalTargets.length" colspan="2">
                                        <div v-if="indicator.referencePeriod">
                                            <CBadge v-if="indicator.referencePeriod.hasReferencePeriod" color="success" shape="rounded-pill">Has reference period</CBadge>
                                            <CBadge v-if="indicator.referencePeriod.hasReferencePeriod===false" color="danger" shape="rounded-pill">No reference period</CBadge>
                                            <km-lstring-value class="mt-2" type="html" v-if="indicator.referencePeriod.referencePeriodInfo"
                                            :value="indicator.referencePeriod.referencePeriodInfo" :locale="useI18n().locale"></km-lstring-value>
                                        </div>
                                    </td> 
                                </tr>
                                <tr v-if="target.otherIndicators.length">
                                    <td colspan="3">
                                        <strong>Other indicators linked in the national target(s) for this global Goal/Target</strong>
                                    </td>                             
                                </tr>
                                <tr v-for="(indicator, index) in target.otherIndicators" :key="indicator.identifier">
                                    <td>
                                        {{lstring(indicator.title)}}
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                          </table>
                        </td> 
                        
                      </tr>
                    </template>
                  </tbody>
                </table>
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
             KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmNavLink
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

    const EditTargetPart2 = defineAsyncComponent(() =>
        import('./edit-target-part-2.vue')
    )

    onMounted(async() => {
        await init();

        if(route?.query?.globalTarget){
            setTimeout(() => {
                scrollToElement(`#gbTraget_${route.query.globalTarget}`);
            }, 200);
            const target = gbfGoalAndTargetList.value?.find(e=>e.identifier == route.query.globalTarget);
            if(target?.nationalTargets?.length)
                showEditMapping(target)
        }
    })
    

    const navigateToPage = async (route:string, draft:any)=>{
      const url = route.replace(':identifier', draft?.identifier||draft?.header?.identifier)
      await navigateTo(url);
      await navigateTo(url);
    }

    const customUrl = (route:string, draft:any)=>{
      const url = route.replace(':identifier', draft?.identifier||draft?.header?.identifier)
      return localePath(url);
    }

    async function loadRecords(query){

        const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true),
                            KmDocumentsService.loadDocuments(query,rowsPerPage, 'updatedOn desc', 0, true)]);  

        return [...result[0].Items,
                ...result[1].Items.filter(e=>!result[0].Items?.find(draft=>draft.identifier == e.identifier))]

    }

    function addDraftToTargetGroup(target, record){
      const existingTarget = martrix.find(e=>e.identifier == target.identifier)

      if(!existingTarget){
        martrix.push({
          identifier:target.identifier,
          nationalTargets : [record]
        });
      }
      else{
        existingTarget.nationalTargets.push(record)
      }
    }

    function showEditMapping(target){
        
        editMappingTarget.value = target
        showEditMappingModal.value = true
    }

    async function closeEditMappingDialog(){

        showEditMappingModal.value = false;
        editMappingTarget.value = null
        init();
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
        }
        catch(e){
            console.error(e)
        }
        finally{
            isBusy.value = false;
        }
        
    }
</script>