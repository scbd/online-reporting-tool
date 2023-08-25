<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> National target part I </slot>
        </CCardHeader>
        <CCardBody>
          <div class="card">
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <!-- <NuxtLink to="/national-targets/new"> -->
                  <CButton color="secondary" size="sm" @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW, {})">
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
                National targets 
            </div>
            <div class="card-body">    
                <div v-if="isLoadingRecords" class="d-flex justify-content-center m-5"><km-spinner ></km-spinner></div>       
              <table class="table" v-if="kmDocumentDraftStore.documentDrafts">
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
                  <tr v-for="(draft,  index) in nationalTargets" :key="draft.identifier">
                    <th scope="row">{{ index+1 }}</th>
                    <td>{{(draft.workingDocumentTitle||draft.title).en}}</td>
                    <td>
                      <ul v-if="draft.body.globalTargetAlignment">
                        <li v-for="target in draft.body.globalTargetAlignment" :key="target.identifier">
                          <a v-if="target.identifier.startsWith('GBF-GOAL')" href="https://www.cbd.int/gbf/goals/" target="_blank">{{ target.identifier }}</a> 
                          <a v-if="target.identifier.startsWith('GBF-TARGET')" :href="`https://www.cbd.int/gbf/targets/${getTargetNumber(target.identifier)}`" target="_blank">{{ target.identifier }}</a> 
                        </li>
                      </ul>
                    </td>
                    <td>
                        <div v-if="draft.workingDocumentBody"><CBadge color="dark">Draft</CBadge></div>
                        <div v-if="!draft.workingDocumentBody"><CBadge color="success">Published</CBadge></div>
                        <div v-if="draft.workingDocumentLock"><CBadge color="danger">{{t('locked')}}</CBadge></div>
                    </td>
                    <td>
                      {{draft.updatedOn}}<br/>
                      {{ draft.updatedBy.firstName }} {{ draft.updatedBy.lastName }}
                    </td>
                    <td>
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <km-link color="secondary"  class="btn-sm btn btn-secondary" icon="fa-search" :to="navigationUrl(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW, draft)" title="View"></km-link>
                        <CButton color="secondary" size="sm" :disabled="canEdit || draft.workingDocumentLock" @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_EDIT, draft)">
                          <font-awesome-icon icon="fa-edit" /> Edit
                        </CButton>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
        </CCardBody>
      
      </CCard> 
  </template>
  
<!-- <i18n  src="~/i18n/dist/pages/national-targets/index.json"></i18n> -->

<script setup lang="ts">
  import { KmSuspense, KmInputRichLstring, KmSelect, KmFormGroup, KmLink,KmSpinner,
             KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmNavLink
           } from "@/components/controls";
    import { useI18n } from "vue-i18n";
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import {sortBy} from 'lodash';
    import { useStorage } from '@vueuse/core'
    import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";


    const rowsPerPage              = UTILS.ROWS_PER_PAGE;
    const { t }                    = useI18n();
    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user }                 = useAuth();
    const security                 = useSecurity();
    const route                    = useRoute();
    const localePath               = useLocalePath()
    const stateTargetWorkflow      = useStorage('ort-target-workflow', { batchId : undefined });
    const realmConfStore           = useRealmConfStore();
    const kmDocumentDraftStore     = useKmDocumentDraftsStore();
    const draftNationalTargets     = ref([]);
    const publishedNationalTargets = ref([]);
    const isLoadingRecords         = ref(false);

    const canEdit = computed(()=>{
        return true
        return !!stateTargetWorkflow.value.batchId
    });

    const nationalTargets = computed(()=>{
        return [
            ...draftNationalTargets.value,
            ...publishedNationalTargets.value
        ]
    });

    const customUrl = (route:string, draft:any)=>{
      const url = route.replace(':identifier', draft?.identifier||draft?.header?.identifier)
      return localePath(url);
    }

    function navigationUrl(route, draft){
         
        const query = {};
        const path = route.replace(':identifier', draft?.identifier||draft?.header?.identifier);

        if(draft.workingDocumentBody)
            query.draft = true //open draft record view page

        return {
            path, query
        }
    }
    const navigateToPage = async (route:string, draft:any)=>{
        const {path, query} = navigationUrl(route, draft)

        await useNavigateAppTo({path, query});

        
    }

    async function loadRecords(){
        try{
            isLoadingRecords.value = true;
            const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`

            const result = await Promise.all([KmDocumentDraftsService.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true),
                                KmDocumentsService.loadDocuments(query,rowsPerPage, 'updatedOn desc', 0, true)]);  
            draftNationalTargets.value     = result[0].Items;
            publishedNationalTargets.value = result[1].Items.filter(e=>!draftNationalTargets.value.find(draft=>draft.identifier == e.identifier))
            isLoadingRecords.value = false;
        }
        catch(e){
            useLogger().error(e)
        }
    }

    loadRecords();

</script>