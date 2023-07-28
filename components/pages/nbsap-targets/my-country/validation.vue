<template>
    <div class="mt-3">      
        <!-- <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> National records </slot>
        </CCardHeader>
        <CCardBody> -->
          <!-- <div class="card">
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton color="secondary" size="sm" @click="navigateToPage(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I_NEW, {})">
                    <CIcon icon="addthis"/> Submit new target
                  </CButton>
              </div>
            </div>
          </div> -->
          <div class="card mt-3">
            <div class="card-header bg-secondary">
                National targets 
            </div>
            <div class="card-body">            
              <table class="table" v-if="nationalTargets">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  
                  <tr v-for="(document,  index) in nationalTargets" :key="document.identifier">
                    <th scope="row">{{ index+1 }}</th>
                    <td>{{(document.workingDocumentTitle||document.title).en}}</td>                    
                    <td>
                        <CBadge color="info" v-if="document.isValidating">
                                <km-spinner :message="t('validating')+ '...'"></km-spinner>
                        </CBadge>
                        <CBadge color="danger" v-if="!document.isValidating && document.validationErrors">
                            {{t('hasErrors')}} ({{ document.validationErrors.length }})
                        </CBadge>
                        <CBadge color="success" v-if="document.validated && !document.isValidating && !document.validationErrors">
                            {{t('passedValidation')}}
                        </CBadge>
                    </td>
                    <td>
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="secondary" size="sm"  @click="navigateToPage(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I_VIEW, document)">
                          <font-awesome-icon icon="fa-search" /> View
                        </CButton>
                        <CButton color="secondary" size="sm" @click="onEditTarget(document)">
                          <font-awesome-icon icon="fa-edit" /> Edit
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
                Global Goal/Targets mapping
            </div>
            <div class="card-body">            
              <table class="table" v-if="nationalMappings">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">State</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  
                  <tr v-for="(document,  index) in nationalMappings" :key="document.identifier">
                    <th scope="row">{{ index+1 }}</th>
                    <td>
                        <km-term :value="document.body.globalGoalOrTarget" :locale="locale"></km-term>                        
                    </td>                    
                    <td>
                        <CBadge color="info" v-if="document.isValidating">
                                <km-spinner :message="t('validating')+ '...'"></km-spinner>
                        </CBadge>
                        <CBadge color="danger" v-if="!document.isValidating && document.validationErrors">
                            {{t('hasErrors')}} ({{ document.validationErrors.length }})
                        </CBadge>
                        <CBadge color="success" v-if="document.validated && !document.isValidating && !document.validationErrors">
                            {{t('passedValidation')}}
                        </CBadge>
                    </td>
                    <td>
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="secondary" size="sm"  @click="navigateToPage(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I_VIEW, document)">
                            <font-awesome-icon icon="fa-search" /> View
                        </CButton>
                        <CButton color="secondary" size="sm" @click="onEditTarget(document)">
                            <font-awesome-icon icon="fa-edit" /> Edit
                        </CButton>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        <!-- </CCardBody>
        
      </CCard>  -->

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showEditDocumentModal" >
            <CModalHeader :close-button="false">
                <CModalTitle>
                    <span v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7">{{lstring(editDocument.title)}}</span>
                    <span v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">{{lstring(getGlobalTarget(editDocument.globalGoalOrTarget.identifier).title)}}</span>
                </CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div id="nationalTargetsValidationEdit">
                    <div v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7">
                        <edit-target-part-1 :raw-document="editDocument" :workflow-active-tab="2"
                            :identifier="editDocument.header.identifier"
                            :on-close="onEditTargetClose"  :on-post-save-draft="onPostSaveDraft"
                            container="#nationalTargetsValidationEdit">
                        </edit-target-part-1>
                    </div>
                    <div v-if="editDocument.header.schema==SCHEMAS.NATIONAL_TARGET_7_MAPPING">
                        <edit-target-part-2 :raw-document="editDocument" :workflow-active-tab="2"
                            :global-goal-or-target="editDocument.globalGoalOrTarget.identifier" 
                            :headline-indicators="getGlobalTarget(editDocument.globalGoalOrTarget.identifier).headlineIndicators"
                            :identifier="editDocument.header.identifier" :on-close="onEditTargetClose"  :on-post-save-draft="onPostSaveDraft"
                            container="#nationalTargetsValidationEdit">
                        </edit-target-part-2>
                    </div>
                </div>
            </CModalBody>
        </CModal>

    </div>
</template>

<i18n src="@/i18n/dist/pages/national-reports/nbsap-targets/my-country/validation.json"></i18n>

<script setup lang="ts">
    import  { KmSpinnerSuspense, KmSpinner, KmModalSpinner, KmNavLink, KmTerm
            } from "@/components/controls";
    import missingTargetError from '../missing-target-error.vue';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { CModalFooter } from "@coreui/vue";
    import { computedAsync } from '@vueuse/core'
    import { useThesaurusStore } from "@/stores/thesaurus";
    import { buildTargetMatrix } from "./part-2/util";

    defineExpose({
        validatePartI,
        validatePartII
    });

    const EditTargetPart1 = defineAsyncComponent(()=>import("./part-1/edit-target-part-1.vue"));
    const EditTargetPart2 = defineAsyncComponent(()=>import('./part-2/edit-target-part-2.vue'));

    let   targetMapping = undefined;
    const rowsPerPage = 300;
    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user } = useAuth();
    const security = useSecurity();
    const route    = useRoute();
    const localePath  = useLocalePath()
    const { t, locale }       = useI18n(); 

    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();
    const thesaurusStore  = useThesaurusStore();

    const isBusy = ref(false);
    const nationalTargets = ref([]);
    const nationalMappings = ref([]);
    const editDocument = ref(null);
    const editTargetMapping  = ref(null);
    const showEditDocumentModal= ref(false);

    onMounted(async() => {
        await init();
    })
    

    const navigateToPage = async (route:string, document:any)=>{
      const url = route.replace(':identifier', document?.identifier||document?.header?.identifier)
      await navigateTo(url);
      await navigateTo(url);
    }

    const customUrl = (route:string, document:any)=>{
      const url = route.replace(':identifier', document?.identifier||document?.header?.identifier)
      return localePath(url);
    }

    async function loadNationalTargets(){

      const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7}')`

      const response = await kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true);

      nationalTargets.value = response.Items;
    //   validateDocuments(response.Items);

    }

    async function loadTargetMappings(){

        const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7_MAPPING}')`;

        const response = await kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true);

        nationalMappings.value = response.Items;

    }

    async function init(){
        try{
            isBusy.value = true;        
            const response = await Promise.all([
                GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators(), 
                loadNationalTargets(), 
                loadTargetMappings()
            ]);
            targetMapping = buildTargetMatrix(response[0], nationalTargets.value, nationalMappings.value)
            
        }
        catch(e){
            console.error(e)
        }
        finally{
            isBusy.value = false;
        }
        
    }

    async function validatePartI(){
        validateDocuments(nationalTargets.value);
    }

    async function validatePartII(){
        validateDocuments(nationalMappings.value);
    }

    async function validateDocument(document:any){
        
        const { $api } = useNuxtApp();
        const data     = await $api.kmStorage.documents.validate(document);
 
        return data?.errors;

    }

    async function validateDocuments(documents){

        //use foreach so that everything is validated together
        documents.forEach(async document=>{
            try{
                document.isValidating = true
                document.validated    = false;
                document.validationErrors = undefined;
                const validationErrors = await validateDocument(document.body)
                if(validationErrors)
                    document.validationErrors = [...validationErrors];
                
            }
            catch(e){
                console.error(e);
                document.error = e;
            }
            document.validated = true;
            document.isValidating = false
        });
    }

    function getGlobalTarget(identifier: string){
        return targetMapping.find(e=>e.identifier == identifier)
    }

    async function onEditTarget(document:Object){
        editDocument.value  = document.body;
        showEditDocumentModal.value = true;
    }

    function onEditTargetClose(newDocument:Object){
        editDocument.value  = null;
        showEditDocumentModal.value = false;

        if(newDocument){
            const list:Array<Object> =  newDocument.header.schema == SCHEMAS.NATIONAL_TARGET_7 ? nationalTargets :  nationalMappings;
            const existingDocument   = list.value.find(e=>e.identifier == newDocument.header.identifier);
            validateDocuments([existingDocument])
        }
    }

    function onPostSaveDraft(newDocument:Object){

        const list:Array<Object> =  newDocument.type == SCHEMAS.NATIONAL_TARGET_7 ? nationalTargets :  nationalMappings;

        const index            = list.value.findIndex(e=>e.identifier == newDocument.identifier);
        const existingDocument = list.value.find     (e=>e.identifier == newDocument.identifier);
        if(existingDocument){
            Object.assign(existingDocument, newDocument);
            list[index] = existingDocument;
        }      
    }

</script>

<style scoped>

</style>