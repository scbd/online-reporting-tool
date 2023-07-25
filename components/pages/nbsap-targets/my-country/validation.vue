<template>
    <div class="mt-3">      
        <CCard>
        <CCardHeader>
          <slot name="header"> <CIcon name="cil-grid" /> National targets </slot>
        </CCardHeader>
        <CCardBody>
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
                    <th scope="col">Validation</th>
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
                            {{t('hasErrors')}}
                        </CBadge>
                        <CBadge color="success" v-if="!document.isValidating && !document.validationErrors">
                            {{t('passedValidation')}}
                        </CBadge>
                    </td>
                    <td>
                      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="secondary" size="sm"  @click="navigateToPage(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I_VIEW, document)">
                          <font-awesome-icon icon="fa-search" /> View target
                        </CButton>
                        <CButton color="secondary" size="sm" @click="onEditTarget(document)">
                          <CIcon icon="cil-comment-square-edit"/> Edit target
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

        <CModal  class="show d-block" size="xl" alignment="center" backdrop="static" :visible="showEditTargetModal" >
            <CModalHeader :close-button="false">
                <CModalTitle>{{lstring(editNationalTarget.title)}}</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <div id="nbsapTargetsPart2Edit">
                    <edit-target-part-1 :raw-document="editNationalTarget"
                    :identifier="editNationalTarget.header.identifier" :on-close="onEditTargetClose"
                    container="#nbsapTargetsPart1Edit"></edit-target-part-1>
                </div>
            </CModalBody>
        </CModal>
    </div>
</template>

<script setup lang="ts">
    import  { KmSpinnerSuspense, KmSpinner, KmModalSpinner, KmNavLink
            } from "@/components/controls";
    import editTargetPart1 from "./part-1/edit-target-part-1.vue";
    import missingTargetError from '../missing-target-error.vue';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { CModalFooter } from "@coreui/vue";


    const rowsPerPage = 300;
    const { $appRoutes:appRoutes } = useNuxtApp();
    const { user } = useAuth();
    const security = useSecurity();
    const route    = useRoute();
    const localePath  = useLocalePath()
    const { t }       = useI18n(); 

    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();

    const isBusy = ref(false);
    const nationalTargets = ref([]);
    const nationalMappings = ref([]);
    const editNationalTarget = ref(null);
    const editTargetMapping  = ref(null);
    const showEditTargetModal= ref(false);



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
      validateDocuments(response.Items);

    }

    async function loadTargetMappings(){

        const query = `(type eq '${SCHEMAS.NATIONAL_TARGET_7_MAPPING}')`;

        const response = await kmDocumentDraftStore.loadDraftDocuments(query,rowsPerPage, 'updatedOn desc', 0, true);

        nationalMappings.value = response.Items;
        validateDocuments(response.Items);

    }

    async function init(){
        try{
            isBusy.value = true;        
            const response = await Promise.all([
                loadNationalTargets(), 
                loadTargetMappings()
            ]);
            
        }
        catch(e){
            console.error(e)
        }
        finally{
            isBusy.value = false;
        }
        
    }

    async function validationDocument(document:any){

        
        const { $api } = useNuxtApp();
        const { data, error } = await $api.kmStorage.documents.validate(document);

        if(error?.value)
                throw error;

        return data?.errors;

    }

    async function validateDocuments(documents){

        //use foreach so that everything is validated together
        documents.forEach(async document=>{
            try{
                document.isValidating = true
                const res = await validationDocument(document.body)
                document.validationErrors = res;
            }
            catch(e){
                console.error(e);
                document.error = e;
            }
            document.isValidating = false
        });
    }

    async function onEditTarget(document){
        editNationalTarget.value  = document.body;
        showEditTargetModal.value = true;
    }

    function onEditTargetClose(document){
        console.log(document)
        editNationalTarget.value  = null;
        showEditTargetModal.value = false;

        const existingDocument = nationalTargets.value.find(e=>e.identifier == document?.header?.identifier);
        if(existingDocument){
            existingDocument.body = document;
            validationDocument(existingDocument)
        }
    }
</script>

<style scoped>

</style>