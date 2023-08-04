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
           
            <km-form-workflow :focused-tab="props.workflowActiveTab" :get-document="onGetDocument" :validation-report="validationReport" 
                :container="container" :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft">
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
                                            :options="formattedLanguages"
                                            :multiple="true"
                                            :allow-empty="false"
                                        >
                                        </km-select>
                                        <small v-if="document.header.languages && document.header.languages.length == 1" class="text-danger form-text">
                                            Minimum of one language is mandatory, please select another language to remove the default language.
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
                                    <CCard class="mb-2" v-for="(indicator, index) in document.referencePeriod" :key="indicator.identifier">
                                        <CCardBody>
                                            <CCardTitle>{{lstring(getIndicator(indicator.headlineIndicator).title)}}</CCardTitle>
                                            <hr/>
                                            <CCardText>
                                                <table class="table" v-if="(getIndicator(indicator.headlineIndicator).nationalTargets||[]).length">
                                                    <tr>
                                                        <td>   
                                                            <km-form-group caption="National target(s) linked to headline indicator">
                                                                <div  class="ps-2" v-for="(target, index) in getIndicator(indicator.headlineIndicator).nationalTargets" :key="target.identifier">
                                                                    {{index+1}}. {{lstring(target.title)}}
                                                                </div>
                                                            </km-form-group>
                                                            <km-form-group name="hasReferencePeriod" required caption="Is there a reference period for above national target(s) which relates to the headline indicator? (rephrase?)">
                                                                <km-form-check-group>
                                                                    <km-form-check-item inline type="radio" :name="'hasReferencePeriod' + indicator.headlineIndicator.identifier"  for="hasReferencePeriod" :id="'hasReferencePeriodYes'+ indicator.headlineIndicator.identifier"  :value="true"  v-model="indicator.hasReferencePeriod" label="Yes"/>
                                                                    <km-form-check-item inline type="radio" :name="'hasReferencePeriod' + indicator.headlineIndicator.identifier"  for="hasReferencePeriod" :id="'hasReferencePeriodNo' + indicator.headlineIndicator.identifier"  :value="false" v-model="indicator.hasReferencePeriod" label="No"/>
                                                                </km-form-check-group>
                                                            </km-form-group> 

                                                            <km-form-group v-if="indicator.hasReferencePeriod" name="referencePeriodInfo" caption="Please explain" required>
                                                                <km-input-rich-lstring v-model="indicator.referencePeriodInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                                            </km-form-group>                                     
                                                        </td>
                                                    </tr> 
                                                </table>
                                                <CAlert color="danger" class="d-flex align-items-center"  v-if="!(getIndicator(indicator.headlineIndicator).nationalTargets||[]).length">
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
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";

    const props = defineProps({
        identifier         : {type:String, required:false},
        rawDocument        : {type: Object },
        globalGoalOrTarget : {type:String, required:true},
        headlineIndicators : {type:Array, required:true},
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
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
  
    watchEffect(()=>{

        if(props.headlineIndicators?.length){
            return headlineIndicators.value = [...props.headlineIndicators].map(e=>{
                e.hasReferencePeriod = false;
                return e;
            })
        }
        else{
            loadHeadlineIndicators(props.globalGoalOrTarget)
        }
    })

    await Promise.all([
        countriesStore.loadCountries()
    ]);

    let document = ref({});
    let isLoading = ref(false);

    if(props.rawDocument){
        document.value = {...props.rawDocument};
    }
    else if(props.identifier || route?.params?.identifier){
        const req = useAsyncState(KmDocumentDraftsService.loadDraftDocument(props.identifier || route?.params?.identifier)
                                                                .then(e=>e?.body?? emptyDocument()));        
        if(req.error?.value)
            throw new Error(req.error.value);

        document = req.state
        isLoading = req.isLoading;
    }
    else{
        document.value = emptyDocument();
        //validate if there is a mapping record for the given target and load it instead
    }

    
    const formattedLanguages     = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));    
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

        // incase if national target record was modified and global target was removed after 
        // the mapping was submitted then filter such reference period
        if(clean.referencePeriod && headlineIndicators.value?.length){            
            const referencePeriod = clean.referencePeriod.filter(e=>{
                return headlineIndicators.value.find(indicator=>indicator.identifier == e.headlineIndicator.identifier);
            })
            clean.referencePeriod = referencePeriod.length ? referencePeriod : undefined;
        }
        else{
            clean.referencePeriod = []
            headlineIndicators.value.forEach(indicator => {
                clean.referencePeriod.push({
                    headlineIndicator   : { identifier : indicator.identifier},
                    hasReferencePeriod : false
                })
            });  
        }
        return clean
    })

    onMounted(() => {
        
    })

    function onGetDocument(){
        return cleanDocument;
    }

    const onClose = async (document)=>{
        if(props.onClose)
            props.onClose(document)
    }
    const onPostSaveDraft = async (document)=>{
        if(props.onPostSaveDraft)
            props.onPostSaveDraft(document)
    }
    function emptyDocument(){
        const referencePeriod = [];
        if(headlineIndicators.value?.length){            

            headlineIndicators.value.forEach(indicator => {
                referencePeriod.push({
                    headlineIndicator   : { identifier : indicator.identifier},
                    hasReferencePeriod : false
                })
            });            
        }

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
            },
            referencePeriod
        }
    }

    async function loadHeadlineIndicators(globalTarget){

        const indicators = await GbfGoalsAndTargets.loadGbfHeadlineIndicator(globalTarget.identifier);
        headlineIndicators.value = sortBy([...(indicators?.flat()||[])], 'title')
    }

    function getIndicator(indicator){
        return headlineIndicators.value?.find(e=>e.identifier == indicator?.identifier)
    }
</script>
