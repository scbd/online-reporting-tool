<template>
  <CCard>
    <CCardHeader>
       {{t('nr7Title')}}
    </CCardHeader>
    <CCardBody>
      <div v-if="viewDocumentInfo">
        <div class="row">
          <div class="col-2">
            <div id="nr7-view-tabs" class="list-group sticky-top" data-spy="affix" >
              <a class="list-group-item list-group-item-action" href="#section1">Section I</a>
              <a class="list-group-item list-group-item-action" href="#section2">Section II</a>
              <a class="list-group-item list-group-item-action" href="#section3">Section III</a>
              <a class="list-group-item list-group-item-action" href="#section4">Section IV</a>
              <a class="list-group-item list-group-item-action" href="#section5">Section V</a>
              <a class="list-group-item list-group-item-action" href="#sectionOtherInfo">Other information</a>
            </div>
          </div>
          <div class="col-10">
            <div v-if="viewDocument?.header?.languages?.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">      
                <km-locales v-model="selectedLocale" :locales="viewDocument.header.languages"></km-locales>
            </div>

            <div data-bs-spy="scroll" data-bs-target="#nr7-view-tabs" data-bs-offset="0" tabindex="0" class="nr7-section-view">
                <div id="section1" class="mb-3">
                  <nr7-view-section-I :identifier="viewDocumentInfo.identifier" :document="viewDocument" :document-locale="selectedLocale"></nr7-view-section-I>
                </div>
                <div id="section2" class="mb-3">
                  <nr7-view-section-II :identifier="viewDocumentInfo.identifier" :document="viewDocument" :document-locale="selectedLocale"></nr7-view-section-II>
                </div>
                <div id="section3" class="mb-3">
                  <nr7-view-section-III :identifier="viewDocumentInfo.identifier" :document="viewDocument"
                    :national-targets="nationalTargets" :indicators-data="indicatorsData" :document-locale="selectedLocale"></nr7-view-section-III>
                </div>
                <div id="section4" class="mb-3">
                  <nr7-view-section-IV :identifier="viewDocument?.header?.identifier||''" 
                          :document="viewDocument" :indicators-data="indicatorsData" :document-locale="selectedLocale"></nr7-view-section-IV>
                </div>
                <div id="section5" class="mb-3">             
                   <nr7-view-section-V :identifier="viewDocumentInfo.identifier" :document="viewDocument" :document-locale="selectedLocale"></nr7-view-section-V>
                </div>
                <div id="sectionOtherInfo" class="mb-3">          
                  <nr-7-view-section-other-information :identifier="viewDocumentInfo.identifier" :document="viewDocument" :document-locale="selectedLocale"></nr-7-view-section-other-information>
                </div>      
            </div>
          </div>
        </div>        
      </div>

      <km-document-error v-if="!viewDocumentInfo && !isLoading &&  documentLoadError" :document-error="documentLoadError"></km-document-error>        
      <km-spinner :visible="isLoading" v-if="isLoading" center></km-spinner>        
     
    </CCardBody>
  </CCard>

</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view.json"></i18n>
<script setup lang="ts">

  import { useRoute } from 'vue-router' 
  import { KmDocumentDraftsService}from "@/services/kmDocumentDrafts";
  import { KmDocumentsService } from "@/services/kmDocuments";
  import { defineProps, defineEmits } from 'vue';
  import type { Schemas,  EDocumentInfo } from '~/types/schemas/base/EDocumentInfo';
  import { GbfGoalsAndTargets } from '~/services/gbfGoalsAndTargets';
  import type { ENationalReport7 } from '~/types/schemas/ENationalReport7';
  import * as bootstrap from 'bootstrap';
  import type { ETerm } from '~/types/schemas/base/ETerm';

  const emit                    = defineEmits(['onDocumentLoad']);
  const route                   = useRoute();
  const {t, locale}             = useI18n();
  const {$appRoutes:appRoutes } = useNuxtApp();
  const { user }                = useAuth();    

  const props = defineProps({
      documentInfo: { type:Object as PropType<EDocumentInfo>, default : undefined},
      identifier  : { type:String, required:true},
      publicData  : { type:Boolean, default : false},
  })

  const { documentInfo, identifier } = toRefs(props);
  const lDocumentInfo = ref<EDocumentInfo|undefined>(undefined);
  const isLoading = ref(false);
  const documentLoadError = ref(null);
  const selectedLocale = ref(locale.value);
  const nationalTargets = ref<Record<string, Object>>({});
  const nationalData = ref<Record<string, Object>>({});
  const indicatorsData = ref<EDocumentInfo[]>([]);
  const globalGoals = ref<Array<ETerm>>([]);

  const viewDocumentInfo:ComputedRef<EDocumentInfo|undefined> = computed(()=>{
      return documentInfo?.value||lDocumentInfo?.value;
  })

  const viewDocument:ComputedRef<ENationalReport7> = computed(()=>{
   const document = viewDocumentInfo.value;
    if(document){
      return document?.body as ENationalReport7;
    }
    return {} as ENationalReport7;
  })

  async function init(){     
      if(identifier.value && !documentInfo?.value){
        await loadDocument(identifier.value)       
      }

      //this can be long call, so don't await here
      const initIndicatorDataLoad = loadNationalIndicatorData();

      const [lNationalTargets, globalTargets] = await Promise.all([ 
              KmDocumentsService.loadSchemaDocuments(SCHEMAS.NATIONAL_TARGET_7, viewDocument.value?.government?.identifier, {body:false, collection: 'all', }),
              GbfGoalsAndTargets.loadGbfTargets()]);

      nationalTargets.value = arrayToObject([...(lNationalTargets||[]), ...globalTargets]) || {}; 
            
      indicatorsData.value = await initIndicatorDataLoad;

      setTimeout(() => {        
        var scrollSpy = new bootstrap.ScrollSpy(window.document.body, {
          target: '#nr7-view-tabs'
        })
      }, 1000);
  }

  async function loadDocument(identifier:string){
      isLoading.value = true;
      try{
          if(route.query?.draft == 'true' || route.query?.draft === null){
              const draftRecord = await KmDocumentDraftsService.loadDraftDocument(route.params.identifier as string);
              if(draftRecord?.body){
                lDocumentInfo.value = draftRecord as EDocumentInfo;
                emit('onDocumentLoad', draftRecord as  EDocumentInfo);
              }
          }
          else{
              const record = await KmDocumentsService.loadDocument(route.params.identifier as string);
              if(record?.body){
                lDocumentInfo.value = record as EDocumentInfo;
                emit('onDocumentLoad', record as EDocumentInfo);
              }
          }
      }
      catch(e:object|any){
          if([404, 401, 403].includes(e.status)){
              documentLoadError.value = e.status;
              useLogger().error(e, `${t(e.status==404 ? 'notFound' : 'notAuthorized')} ` + route.params.identifier);
          }
          else
              useLogger().error(e, `${t('errorLoading')} ` + route.params.identifier);
      }
      isLoading.value = false;
      
  }

  async function loadNationalIndicatorData():Promise<EDocumentInfo[]>{
      
      const schemas = [SCHEMAS.NATIONAL_REPORT_7_INDICATOR_DATA, SCHEMAS.NATIONAL_REPORT_7_BINARY_INDICATOR_DATA];
      
      if(props.publicData === true)
        return await KmDocumentsService.loadSchemaDocuments(schemas, viewDocument.value?.government?.identifier, {collection:'all'});
      
      const result = await Promise.all([
        KmDocumentDraftsService.loadSchemaDrafts(schemas, viewDocument.value?.government?.identifier),
        KmDocumentsService.loadSchemaDocuments(schemas, viewDocument.value?.government?.identifier)
      ]);  

      return [...result[0],
              ...result[1].filter(e=>!result[0]?.find((draft:EDocumentInfo)=>draft.identifier == e.identifier))]

  }


  onMounted(() => {      
      init()
  })
</script>
<style scoped>
  .sticky-top{
    top: 120px;
  }
</style>