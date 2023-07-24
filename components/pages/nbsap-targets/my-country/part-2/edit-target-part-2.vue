<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> Global Goals/Target Mapping</slot>
      </CCardHeader>
      <CCardBody>

        <div  v-if="isLoading">
            <km-spinner></km-spinner>
        </div>
        <form v-if="!isLoading && document" name="editForm">
           
            <km-form-workflow :current-tab="1" :get-document="onGetDocment" :validation-report="validationReport" :container="container">
                <template #submission>
                     <div  >
                       <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    General
                                </div>
                                <div class="card-body">  
                                    <km-form-group name="government" caption="Government" required>
                                        <km-select
                                            v-model="document.government.identifier"
                                            class="validationClass"
                                            label="name"
                                            track-by="code"
                                            value-key="code"
                                            placeholder="Government"
                                            :options="countryList"
                                            :disabled="!security.role.isAdministrator">
                                        </km-select>                                
                                    </km-form-group>   

                                    <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                        <km-select
                                            v-model="document.header.languages"
                                            class="validationClass"
                                            label="title"
                                            track-by="code"
                                            value-key="code"
                                            placeholder="Language of record"
                                            :options="formatedLanguages"
                                            :multiple="true"
                                            :allow-empty="false"
                                        >
                                        </km-select>
                                        <small v-if="document.header.languages && document.header.languages.length == 1" class="text-danger form-text">
                                            Minimum of one language is mandatory, please select another language to remove the last language.
                                        </small>
                                    </km-form-group>  
                                </div>
                            </div>
                        </km-form-group>

                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Elements of the global targets
                                </div>
                                <div class="card-body">                                    
                                    <km-form-group required caption="Elements of the global targets addressed by national targets" name="elementOfGlobalTargetsinfo">
                                        <km-input-rich-lstring v-model="document.elementOfGlobalTargetsinfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>                                    
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Reference Period
                                </div>
                                <div class="card-body">
                                    <!-- <legend>Headline Indicators</legend> -->
                                    <CCard class="mb-2" v-for="(indicator, index) in headlineIndicators" :key="indicator.identifier">
                                        <CCardBody>
                                            <CCardTitle>{{lstring(indicator.title)}}</CCardTitle>
                                            <hr/>
                                            <CCardText>
                                                <table class="table" v-if="indicator.nationalTargets.length">
                                                    <tr>
                                                        <td>   
                                                            <km-form-group caption="National target(s) linked to headline indicator">
                                                                <div  class="ps-2" v-for="(target, index) in indicator.nationalTargets" :key="target.identifier">
                                                                    {{index+1}}. {{lstring(target.title)}}
                                                                </div>
                                                            </km-form-group>
                                                            <km-form-group name="hasReferencePeriod" required caption="Is there a reference period for above national target(s) which relates to the headline indicator? (rephrase?)">
                                                                <km-form-check-group>
                                                                    <km-form-check-item inline type="radio" :name="'hasReferencePeriod' + indicator.identifier"  for="hasReferencePeriod" :id="'hasReferencePeriodYes'+ indicator.identifier" :value="true"  v-model="indicator.hasReferencePeriod" label="Yes"/>
                                                                    <km-form-check-item inline type="radio" :name="'hasReferencePeriod' + indicator.identifier"  for="hasReferencePeriod" :id="'hasReferencePeriodNo' + indicator.identifier"  :value="false" v-model="indicator.hasReferencePeriod" label="No"/>
                                                                </km-form-check-group>
                                                            </km-form-group> 

                                                            <km-form-group v-if="indicator.hasReferencePeriod" name="referencePeriodInfo" caption="Please explain" required>
                                                                <km-input-rich-lstring v-model="indicator.referencePeriodInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                                            </km-form-group>                                     
                                                        </td>
                                                    </tr> 
                                                </table>
                                                <CAlert color="danger" class="d-flex align-items-center"  v-if="!indicator.nationalTargets.length">
                                                    <CIcon icon="cil-burn" class="flex-shrink-0 me-2" width="24" height="24" />
                                                    <div>
                                                        Your country has not submitted any national target(s) linked to this headline indicator. (rephrase?)
                                                        <!-- <br/>
                                                        <CButton color="secondary" size="sm" @click="showEditMapping(target)">
                                                            Submit new target here
                                                        </CButton> -->
                                                    </div>
                                                </CAlert>
                                            </CCardText>

                                        </CCardBody>
                                    </CCard>
                                   
                                </div>
                            </div>
                        </km-form-group>
                    </div>
                    
                </template>
                <template #review>                    
                    <view-target :identifier="document.header.identifier" :document="cleanDocument"></view-target>
                </template>
            </km-form-workflow>

            <div class="d-grid d-md-flex justify-content-md-end mt-5">
                <CButton @click="onSubmitDocument()" color="primary" class="me-md-2" :disabled="showSpinnerModal">
                    <span v-if="showSpinnerModal"><c-spinner component="span" size="sm" variant="grow" aria-hidden="true"></c-spinner> Saving</span>
                    <span v-if="!showSpinnerModal">Save</span>
                </CButton> 
                <!-- <CButton @click="previewDocument()" color="primary" class="me-md-2">Preview</CButton> 
                <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton> 
                <CButton @click="onClose()" color="danger" class="me-md-2">Close</CButton> -->
            </div>
            <km-modal-spinner :visible="showSpinnerModal" v-if="showSpinnerModal"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import { useAsyncState } from '@vueuse/core'
    import { KmInputRichLstring, KmSelect, KmFormGroup, KmValidationErrors,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmSpinner, KmFormWorkflow
    } from "~/components/controls";
    import viewTarget               from "./view-target-part-2.vue";
    import { mapStores }            from 'pinia'
    import { languages }            from '@/app-data/languages'
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 
    import { useToast } from 'vue-toast-notification';
    import { KmDocumentDraftsService } from "@/services/kmDocumentDrafts";

    const props = defineProps({
        identifier         : {type:String, required:false},
        globalGoalOrTarget : {type:String, required:true},
        headlineIndicators : {type:Array, required:true}
    }) 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const locale          = useI18n().locale
    const countriesStore  = useCountriesStore ();
    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();
    const $toast                = useToast();        
    const container = useAttrs().container;
    
    const showSpinnerModal = ref(false);
    const selectedLocale = ref(locale.value);
    const headlineIndicators = ref(null) 
    const validationReport = ref(null);
  
    watchEffect(()=>headlineIndicators.value = [...props.headlineIndicators])

    await Promise.all([
        countriesStore.loadCountries()
    ]);

    let document, state, isReady, isLoading;

    if(props?.identifier){
        ({ state:document, isReady, isLoading } = useAsyncState(KmDocumentDraftsService.loadDraftDocument(props.identifier)
                                                                .then(e=>e?.body?? emptyDocument())));        
    }
    else{
        document = toRef(emptyDocument())
        //validate if there is a mapping record for the given target and load it instead
    }

    
    // const document =  computed(()=>state ?? emptyDocument());
    const formatedLanguages     = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));    
    const countryList           = computed(()=>{
        if(!countriesStore?.countries?.length)
            return [];

        const mapCountries = countriesStore.countries.map(e=>{
            return { name : e.name[useI18n().locale.value], code : e.code?.toLowerCase()}
        })

        return mapCountries;
    });

    const cleanDocument = computed(()=>{
        const clean = useStorage().cleanDocument({...document.value});
        // clean.globalGoalOrTarget= undefined;
        // clean.referencePeriod  = undefined;
        // clean.referencePeriodInfo= undefined;
        
        if(headlineIndicators.value?.length){
            
            clean.referencePeriod = clean.referencePeriod || [];

            headlineIndicators.value.forEach(indicator => {
                clean.referencePeriod.push({
                    headlineIndicator   : { identifier : indicator.identifier},
                    // nationalTargets     : indicator?.nationalTargets?.map(e=>{return {identifier : e.identifier}}),
                    hasReferencePeriod   : indicator.hasReferencePeriod  ,
                    referencePeriodInfo : indicator.referencePeriodInfo,
                })
            });            
        }
        return clean
    })

    onMounted(() => {
        // if(user?.value?.isAuthenticated && document.value){
        //     document.value.government.identifier = document.value?.government?.identifier || user.value.government
        // }
    })

    const onSubmitDocument = async ()=>{
        try{
            showSpinnerModal.value = true;            
            const lDocument = {...cleanDocument.value}

            await kmDocumentDraftStore.saveDraft(lDocument.header.identifier, lDocument);
            if(kmDocumentDraftStore.errors?.length)
                $toast.error('Error saving draft record', {position:'top-right'});                
            else
                $toast.success('Draft record saved successfully', {position:'top-right'});
        }
        catch(e){
            console.error(e);
        }
        finally{
            showSpinnerModal.value = false;
        }
    }   

    function onGetDocment(){
        return cleanDocument;
    }
    // const onClose = async ()=>{
    //     await navigateTo(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_II)
    // }
    
    function emptyDocument(){
        return {
            header : {
                schema : SCHEMAS.NATIONAL_TARGET_7_MAPPING,
                identifier : useGenerateUUID(),
                languages  : [locale.value]
            },        
            government : {
                identifier : user.value?.government
            },
            globalGoalOrTarget : {
                identifier: props.globalGoalOrTarget
            }
        }
    }


</script>
