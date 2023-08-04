<template>
    <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> National target part I </slot>
        </CCardHeader>
        <CCardBody>
          <div class="card">
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <!-- <NuxtLink to="/nbsap-targets/new"> -->
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
                  
                  <tr v-for="(draft,  index) in kmDocumentDraftStore.documentDrafts.Items" :key="draft.identifier">
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
                      <CBadge color="dark">Draft</CBadge>
                    </td>
                    <td>
                      {{draft.updatedOn}}<br/>
                      {{ draft.updatedBy.firstName }} {{ draft.updatedBy.lastName }}
                    </td>
                    <td>
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="secondary" size="sm"  @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW, draft)">
                          <font-awesome-icon icon="fa-search" /> View target
                        </CButton>
                        <CButton color="secondary" size="sm" @click="navigateToPage(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_EDIT, draft)">
                          <font-awesome-icon icon="fa-edit" /> Edit target
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
  
<!-- <i18n  src="~/i18n/dist/pages/nbsap-targets/index.json"></i18n> -->

<script setup lang="ts">
  import { KmSuspense, KmInputRichLstring, KmSelect, KmFormGroup,
             KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmNavLink
           } from "@/components/controls";
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import {sortBy} from 'lodash';


    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user } = useAuth();
    const security = useSecurity();
    const route    = useRoute();
    const localePath  = useLocalePath()

    const rowsPerPage = UTILS.ROWS_PER_PAGE;

    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();

    const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`

    await kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true);
    if(!kmDocumentDraftStore.documentDrafts){
    }

    const navigateToPage = async (route:string, draft:any)=>{
      const url = route.replace(':identifier', draft?.identifier||draft?.header?.identifier)
      await navigateTo(url);
      await navigateTo(url);
    }

    const customUrl = (route:string, draft:any)=>{
      const url = route.replace(':identifier', draft?.identifier||draft?.header?.identifier)
      return localePath(url);
    }
</script>