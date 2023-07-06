<template>
  <CCard>
   
    <CCardHeader>
      <slot name="header"> <CIcon name="cil-grid" /> Welcome </slot>
    </CCardHeader>
    <CCardBody>
      <div class="card">
        <div class="card-body">
          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <NuxtLink to="/nbsap-targets/new">
              <CButton class="dark  m-1">
                <CIcon icon="addthis"/> Submit new target
              </CButton>
            </NuxtLink>
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
            National targets 
        </div>
        <div class="card-body">            
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">GBF goals and targets</th>
                <th scope="col">Status</th>
                <th scope="col">Updated on</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              
              <tr v-for="(draft,  index) in kmDocumentDraftStore.documentDrafts.Items" :key="draft.identifier">
                <th scope="row">{{ index+1 }}</th>
                <td>{{(draft.workingDocumentTitle||draft.title).en}}</td>
                <td>
                  <ul v-if="draft.body.gbfGoalsAlignment || draft.body.gbfTargetsAlignment">
                    <li v-for="target in draft.body.gbfGoalsAlignment" :key="target.identifier">
                      <a href="https://www.cbd.int/gbf/goals/" target="_blank">{{ target.identifier }}</a> 
                    </li>
                    <li v-for="target in draft.body.gbfTargetsAlignment" :key="target.identifier">
                      <a :href="`https://www.cbd.int/gbf/targets/${getTargetNumber(target.identifier)}`" target="_blank">{{ target.identifier }}</a> 
                    </li>
                  </ul>
                </td>
                <td>
                  <CBadge color="dark">Draft</CBadge>
                </td>
                <td>
                  {{draft.updatedOn}}<br/>
                  {{ draft.updatedBy.firstName }} {{ draft.updatedBy.lastName }}
                </td>
                <td>
                  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton color="secondary" size="sm"  @click="navigateToPage($appRoutes.NBSAPS_TARGETS_VIEW, draft)">
                      <font-awesome-icon icon="fa-search" /> View target
                    </CButton>
                    <CButton color="secondary" size="sm" @click="navigateToPage($appRoutes.NBSAPS_TARGETS_EDIT, draft)">
                      <CIcon icon="cil-comment-square-edit"/> Edit target
                    </CButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card mt-3">
          <div class="card-header bg-secondary">
            Global Goals/Targets
          </div>
          <div class="card-body">
            <table class="table table-hover">
              <!-- <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">GBF goals and targets</th>
                  <th scope="col"></th>
                </tr>
              </thead> -->
              <tbody>
                <template v-for="(target, index) in nationalTargetMatrix" :key="target">
                  <tr class="bg-secondary">
                    <th scope="row">{{ index+1 }}</th>
                    <td>{{target.identifier}}</td> 
                    <!-- <td></td>                   -->
                  </tr>
                  <tr>
                    <td></td>
                    <!-- <td></td> -->
                    <td>
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">National Target(s)</th>
                            <th scope="col">Element of targets</th>
                            <th scope="col">Indicators</th>
                            <th scope="col">Reference period</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(nationalTarget, index) in target.nationalTargets" :key="nationalTarget.identifier">
                            <td>{{ index+1 }}</td>
                            <td>{{(nationalTarget.title).en}}</td>
                            <td>
                              <div v-html="(nationalTarget.elementOfGlobalTargetsinfo||{}).en"></div>
                            </td>
                            <td>
                              <ul v-if="nationalTarget.headlineIndicators||nationalTarget.componentIndicators||nationalTarget.complementaryIndicators">
                                <li v-for="indicator in nationalTarget.headlineIndicators" :key="indicator.identifier">
                                  {{ indicator.identifier }}
                                </li>
                                <li v-for="indicator in nationalTarget.componentIndicators" :key="indicator.identifier">
                                  {{ indicator.identifier }}
                                </li>
                                <li v-for="indicator in nationalTarget.complementaryIndicators" :key="indicator.identifier">
                                  {{ indicator.identifier }}
                                </li>
                              </ul>
                            </td>
                            <td>
                              <CBadge v-if="nationalTarget.hasReferncePeriod" color="info" shape="rounded-pill">Has reference period</CBadge>
                              <div v-html="(nationalTarget.referencePeriodInfo||{}).en"></div>
                            </td>
                            <td>
                              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <CButton color="secondary" size="sm"  @click="navigateToPage($appRoutes.NBSAPS_TARGETS_VIEW, nationalTarget)">
                                  <font-awesome-icon icon="fa-search" /> View target
                                </CButton>
                                <CButton color="secondary" size="sm" @click="navigateToPage($appRoutes.NBSAPS_TARGETS_EDIT, nationalTarget)">
                                  <CIcon icon="cil-comment-square-edit"/> Edit target
                                </CButton>
                              </div>
                            </td>
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
</template>

<script setup lang="ts">
    import { KmInputRichLstring, KmSelect, KmFormGroup,
             KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner
           } from "~/components/controls";
    import { mapStores }            from 'pinia'
    import { UTILS, ROLES, SCHEMAS } from '@/constants';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import {getTargetNumber} from '@/util';
    import {sortBy} from 'lodash';

    const { user } = useAuth();
    const security = useSecurity();
    const route    = useRoute();
    const nationalTargetMatrix = ref([]);

    const rowsPerPage = UTILS.ROWS_PER_PAGE;

    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();

    const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`

    await kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true);
    if(!kmDocumentDraftStore.documentDrafts){
    }
    const matrixRecords = [...(kmDocumentDraftStore.documentDrafts?.Items||[])]
    const martrix = []
    for (let i = 0; i < matrixRecords.length; i++) {
      const element = matrixRecords[i].body;
      element.gbfGoalsAlignment?.forEach(target => addDraftToTargetGroup(target, element));
      element.gbfTargetsAlignment?.forEach(target => addDraftToTargetGroup(target, element));
    }

    nationalTargetMatrix.value = sortBy(martrix, 'identifier');

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

    const navigateToPage = async (route:string, draft:any)=>{
      console .log(draft)
      const { $appRoutes } = useNuxtApp();
      const url = route.replace(':identifier', draft.identifier||draft.header.identifier)
      await navigateTo(url);
    }
</script>