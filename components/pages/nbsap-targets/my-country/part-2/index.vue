<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> Global Goals/Targets mapping </slot>
        </CCardHeader>
        <CCardBody>
          <div class="card">
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <!-- <NuxtLink to="/nbsap-targets/new"> -->
                  <CButton color="secondary" size="sm" @click="navigateToPage(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I_NEW, {})">
                    <CIcon icon="addthis"/> Submit new target
                  </CButton>
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
              </div>
            </div>
          </div>
         
          <div class="card mt-3">
              <div class="card-header bg-secondary">
                Global Goals/Targets
              </div>
              <div class="card-body">
                <km-spinner-suspense v-if="isBusy"></km-spinner-suspense>

                <table class="table table-hover table-bordered">
                  
                  <tbody>
                    <template v-for="(target, index) in gbfGoalAndTargetList" :key="target">                        
                      <tr class="bg-secondary">
                        <td>
                            {{lstring(target.title)}}
                            <div class="d-grid justify-content-end" v-if="target.nationalTargets?.length">
                                <CButton color="primary" size="sm" @click="showEditMapping(target)" v-if="target.nationalMapping">
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
                                        <div v-html="lstring(target.elementOfGlobalTargetsinfo)"></div>
                                    </td>                                
                                </tr>
                                <tr v-if="!target.nationalTargets?.length">
                                    <td colspan="3">
                                        <missing-target-error :global-target="target.identifier"></missing-target-error>                                        
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
                                    <td>
                                        <strong>National target(s) linked to headline indicator</strong>
                                    </td>
                                    <td><strong>Reference period</strong></td>
                                </tr>
                                <tr v-for="(indicator, index) in target.headlineIndicators" :key="indicator.identifier">
                                    <td style="width: 20%;">
                                        {{lstring(indicator.title)}}
                                    </td>
                                    <td>
                                        <div v-for="target in indicator.nationalTargets">
                                            {{lstring(target.title)}}
                                        </div>
                                    </td>
                                    <td>
                                        <div v-if="indicator.referecncePeriod">
                                            <CBadge v-if="indicator.referecncePeriod.hasReferncePeriod" color="info" shape="rounded-pill">Has reference period</CBadge>
                                            <CBadge v-if="indicator.referecncePeriod.hasReferncePeriod===false" color="info" shape="rounded-pill">No reference period</CBadge>
                                            <div v-html="lstring(indicator.referecncePeriod.referencePeriodInfo)"></div>
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
              </div>
          </div>
        </CCardBody>
      
      </CCard> 
      <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showEditMappingModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>{{lstring(editMappingTarget.title)}}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div id="nbsapTargetsPart2Edit">
                <edit-target-part-2 :global-goal-or-target="editMappingTarget.identifier" 
                :identifier="editMappingTarget.nationalMapping ? editMappingTarget.nationalMapping.header.identifier : undefined"
                :headline-indicators="editMappingTarget.headlineIndicators" container="#nbsapTargetsPart2Edit"></edit-target-part-2>
            </div>
        </CModalBody>     
        <CModalFooter>
            <CButton color="secondary" size="sm" @click="closeEditMappingDialog">
                Close
            </CButton>
        </CModalFooter>      
    </CModal>

</template>
  
<!-- <i18n  src="~/i18n/dist/pages/nbsap-targets/index.json"></i18n> -->

<script setup lang="ts">
  import { KmSpinnerSuspense, KmInputRichLstring, KmSelect, KmFormGroup,
             KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmNavLink
           } from "@/components/controls";
    import missingTargetError from '../missing-target-error.vue';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { CModalFooter } from "@coreui/vue";


    const rowsPerPage = UTILS.ROWS_PER_PAGE;
    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user } = useAuth();
    const security = useSecurity();
    const route    = useRoute();
    const localePath  = useLocalePath()

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

    async function loadNationalTargets(){

      const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`

      const response = await kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true);

      return response.Items;

    }

    async function loadTargetMappings(){

        const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7_MAPPING}')`;

        const response = await kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true);

        return response.Items;

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
                loadNationalTargets(), loadTargetMappings()
            ]);

            let targets            = [...response[0]];
            const nationalTargets  = response[1]
            const nationalMappings = response[2];
        
            
            const martrix = []
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i];

                target.nationalTargets = []

                const lNationalTargets  = nationalTargets.filter (e=>e.body?.gbfGoalsAndTargetAlignment?.map(g=>g.identifier)?.includes(target.identifier));
                const lNationalMappings = nationalMappings.find(e=>e.body?.globalGoalOrTarget?.identifier  == target.identifier);

                target.elementOfGlobalTargetsinfo = lNationalMappings?.body.elementOfGlobalTargetsinfo;
                target.nationalMapping            = lNationalMappings?.body;
                target.nationalTargets = lNationalTargets.map(e=>{
                    return { identifier : e.identifier, title : e.body?.title}
                });

                target.headlineIndicators.forEach(indicator => {
                    indicator.nationalTargets = lNationalTargets.filter(e=>e.body.headlineIndicators?.find(e=>e.identifier == indicator.identifier));
                    indicator.referecncePeriod = target.nationalMapping?.referecncePeriod?.find(e=>e.headlineIndicator.identifier == indicator.identifier);
                });

                const otherIndicators = [...target.componentIndicators, ...target.complementaryIndicators];

                target.otherIndicators = otherIndicators.filter(indicator=>{
                    
                    const found = lNationalTargets.find(nationalTarget=>{
                        return  nationalTarget.body.componentIndicators?.find(e=>e.identifier == indicator.identifier)||
                                nationalTarget.body.complementaryIndicators?.find(e=>e.identifier == indicator.identifier)
                    });
                    return found;
                })

            }

            // nationalTargetMatrix.value = sortBy(martrix, 'identifier');
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