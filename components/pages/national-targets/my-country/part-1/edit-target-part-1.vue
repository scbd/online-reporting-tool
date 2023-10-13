<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> National Target</slot>
      </CCardHeader>
      <CCardBody>
        
            <km-form-workflow :focused-tab="props.workflowActiveTab" :get-document="onGetDocument"  
            :container="container"  :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft">
                <template v-slot:submission>   
                    <form name="editForm">    
                        <km-form-group>
                            <CAccordion :active-item-key="1" always-open>
                                <CAccordionItem :item-key="1">
                                    <CAccordionHeader>
                                        Government and Language(s)                       
                                    </CAccordionHeader>
                                    <CAccordionBody> 
                                        <km-form-group name="government" caption="Government" required>
                                            <km-government v-model="document.government" ></km-government>                           
                                        </km-form-group>   

                                        <km-form-group name="languages" caption="Please select in which language(s) you wish to submit this record" required>
                                            <km-languages v-model="document.header.languages"></km-languages>
                                        </km-form-group>   
                                    </CAccordionBody>
                                </CAccordionItem>
                                </CAccordion>
                        </km-form-group>         
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    General
                                </div>
                                <div class="card-body">  
                                    <km-form-group name="title" caption="Full name/title of national target" required data-content="Provide a nice title for your national target">
                                        <km-input-lstring  id="title" placeholder="Enter national target title" v-model="document.title" :locales="document.header.languages"></km-input-lstring>
                                    </km-form-group>
                                    <km-form-group name="description" 
                                        caption="Description">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.description" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="mainPolicyOfMeasureOrActionInfo" 
                                        caption="Please outline the main policy measures or actions that will be taken to achieve this national target.">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.mainPolicyOfMeasureOrActionInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Alignment
                                </div>
                                <div class="card-body">
                                    
                                    <km-form-group caption="Contribution to global Goals" name="globalGoalAlignment">                                     
                                            <km-select
                                                v-model="document.globalGoalAlignment"
                                                class="validationClass"
                                                label="title"
                                                track-by="identifier"
                                                value-key="identifier"
                                                placeholder="Global Goals"
                                                :options="globalGoals"
                                                :multiple="true"
                                                :close-on-select="false"
                                                @update:modelValue="onGoalsAndTargetSelected($event, 'goals')"
                                                :custom-label="customLabel"
                                                :custom-selected-item="customSelectedItem"
                                            >
                                            </km-select>
                                    </km-form-group>
                                    <km-form-group caption="Alignment with global targets" required name="globalTargetAlignment">
                                        <div class="row">
                                            <div class="col-11">
                                                <km-select
                                                    v-model="selectedGlobalTargets"
                                                    class="validationClass"
                                                    label="title"
                                                    track-by="identifier"
                                                    value-key="identifier"
                                                    placeholder="Global Targets"
                                                    :options="globalTargets"
                                                    :multiple="true"
                                                    :close-on-select="false"
                                                    @update:modelValue="onGoalsAndTargetSelected($event, 'targets')"
                                                    :custom-label="customLabel"
                                                    :custom-selected-item="customSelectedItem"
                                                >
                                                </km-select>
                                            </div>
                                            <div class="col-1">                                                
                                                <button type="button" class="btn btn-secondary btn-xs" @click="showAllTargets">List Targets</button>
                                            </div>
                                        </div>
                                        <small id="emailHelp" class="form-text text-muted">Please check all relevant national targets and indicate their degree of alignment with the global targets.</small>

                                    </km-form-group>
                                    
                                    <km-form-group required caption="Degree of alignment" name="degreeOfAlignment" v-if="globallyAlignedTargets?.length">                                        
                                        
                                        <table class="table table-bordered">                                            
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td class="w-25 fw-bold">Degree of <km-help content="Indicate their degree of alignment with the global targets.">Alignment </km-help></td>
                                                </tr>
                                                <tr v-for="target in globallyAlignedTargets" :key="target.identifier">
                                                    <td>
                                                        <km-form-group required :name="target.identifier+'_degreeOfAlignment'">
                                                            <label class="control-label" :for="target.identifier+'_degreeOfAlignment'">
                                                                <span class="visually-hidden">{{ t('degreeOfAlignment') }} - </span>
                                                                {{ lstring(globalTargets.find(e=>e.identifier == target.identifier).title) }}
                                                            </label>
                                                        </km-form-group>
                                                    </td>
                                                    <td>
                                                        <km-form-check-group v-if="target.degreeOfAlignment" class="mb-0">
                                                            <km-form-check-item v-for="degree in formattedDegreeOfAlignments" :key="degree" inline type="radio" 
                                                            :name="target.identifier+'_degreeOfAlignment'"  :for="target.identifier+'_degreeOfAlignment'" 
                                                            :id="target.identifier+'_degreeOfAlignment'+degree.identifier" :value="degree.identifier"  
                                                            v-model="target.degreeOfAlignment.identifier" :label="lstring(degree.title)" />
                                                        </km-form-check-group>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <small id="emailHelp" class="form-text text-muted">
                                            <span :class="{'text-success font-weight-bold': (document.degreeOfAlignment||{}).identifier=='AABF237C-F906-40D2-9595-5226C8B18A58'}">High = covers all elements of the global target; </span>
                                            <span :class="{'text-warning font-weight-bold': (document.degreeOfAlignment||{}).identifier=='68197B76-67B4-40AD-BB14-A8C340E1320B'}">Medium = covers most elements of the global target; </span>
                                            <span :class="{'text-danger font-weight-bold': (document.degreeOfAlignment||{}).identifier=='9668759B-3653-4994-A917-3F039B0BAA5C'}">Low = covers at least one element of the global target</span>
                                        </small>
                                    </km-form-group>    
                                    
                                    <km-form-group name="implementingConsiderationsInfo" 
                                        caption="Explanation, including which aspects of the goal or target are covered">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.degreeOfAlignmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="relatedOtherProcesses" caption="Which of the “considerations for implementation” in Section C of the GBF have been taken into account in developing this national target, and the actions to implement it">
                                        <km-multi-checkbox v-model="document.implementingConsiderations" :options="gbfTargetConsideration">
                                        </km-multi-checkbox>
                                        <small id="emailHelp" class="form-text text-muted">Please check all relevant considerations for implementation.</small>
                                    </km-form-group>
                                    <km-form-group name="implementingConsiderationsInfo" caption="Please explain how these considerations have been taken into account">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.implementingConsiderationsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>

                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group v-if="headlineIndicators.length">
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Indicators to be used to monitor this national target
                                </div>
                                <div class="card-body">
                                    <km-form-group caption="Headline indicators" name="headlineIndicators">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>This National Target will be linked to the following Headline Indicators</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="indicator in headlineIndicators" :key="indicator.identifier">
                                                    <td>{{ lstring(indicator.title) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </km-form-group>
                                    <km-form-group caption="Binary indicators" name="binaryIndicators" v-if="binaryIndicatorsRef && binaryIndicatorsRef.length">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>This National Target will be linked to the following Binary Indicators</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="indicator in binaryIndicatorsRef" :key="indicator.identifier">
                                                    <td>{{ lstring(indicator.title) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </km-form-group>
                                    
                                    <km-form-group name="componentIndicators" caption="Component indicators">
                                        <km-select
                                            v-model="document.componentIndicators"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            placeholder="Component indicators"
                                            :options="componentIndicators"
                                            :multiple="true"
                                            :disabled="false"
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"
                                        >
                                        </km-select>
                                    </km-form-group>
                                    <km-form-group name="complementaryIndicators" caption="Complementary indicators">
                                        <km-select
                                            v-model="document.complementaryIndicators"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            placeholder="Complementary indicators"
                                            :options="complementaryIndicators"
                                            :multiple="true"
                                            :disabled="false"
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"
                                        >
                                        </km-select>
                                    </km-form-group>
                                    <km-form-group name="otherNationalIndicators"  caption="Other national indicators">
                                        <km-input-lstring-ml v-model="document.otherNationalIndicators" :locales="document.header.languages"></km-input-lstring-ml>
                                        <small id="emailHelp" class="form-text text-muted">Add your own indicators</small>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Non-State actor commitments
                                </div>
                                <div class="card-body">
                                    <km-form-group name="nonStateActorCommitmentInfo" caption="List the non-state commitments towards this national Target">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.nonStateActorCommitmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="hasNonStateActors"  caption="Are there any overlaps or links between this national target and targets or commitments submitted as non-State actor commitments to the Kunming-Montreal Global Biodiversity Framework?">
                                        
                                        <km-form-check-group>
                                            <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsYes" :value="true"  v-model="document.hasNonStateActors" label="Yes"/>
                                            <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsNo"  :value="false" v-model="document.hasNonStateActors" label="No"/>
                                        </km-form-check-group>
                                    </km-form-group> 
                                    <km-form-group v-if="document.hasNonStateActors==true" 
                                    name="nonStateActorsInfo" caption="please indicate which commitment(s) and which actor(s)">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.nonStateActorsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Means to implementation and barriers to implementation
                                </div>
                                <div class="card-body">
                                    <km-form-group name="additionalImplementation" 
                                        caption="Please indicate if additional means of implementation are needed for the attainment of this national target.">
                                       
                                        <km-form-check-group>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationRequired"   value="additionalImplementationRequired"  v-model="document.additionalImplementation.identifier" label="Yes (Additional means of implementation are needed for the attainment of this national target)"/>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationAvailable"  value="additionalImplementationAvailable" v-model="document.additionalImplementation.identifier" label="No (Means of implementation available)"/>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationOther"      value="additionalImplementationOther"     v-model="document.additionalImplementation.identifier" label="Other"/>
                                        </km-form-check-group>                                    
                                    </km-form-group> 
                                    <km-form-group for="additionalImplementationCustomValue"
                                        caption="Please explain (Additional means of implementation are needed for the attainment of this national target)" required
                                        v-if="document.additionalImplementation.identifier=='additionalImplementationRequired' || document.additionalImplementation.identifier=='additionalImplementationOther'">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.additionalImplementation.customValue" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="additionalImplementationInfo" caption="Additional explanation">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.additionalImplementationInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Additional information
                                </div>
                                <div class="card-body">
                                    <km-form-group name="additionalInformation" caption="Any other relevant information">
                                        <km-input-rich-lstring  :identifier="document.header.identifier" v-model="document.additionalInformation" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                    </form>
                </template>
                <template v-slot:review>
                    <view-target :identifier="document.header.identifier" :document="cleanDocument"></view-target>
                </template>
                <template #publish>                                          
                    <CAlert color="info" class="d-flex align-items-center">
                        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                        <div class="p-2">
                            please use the Overview menu to publish this information
                        </div>
                    </CAlert>       
                </template>
            </km-form-workflow>
            <km-modal-spinner :visible="kmDocumentDraftStore.isBusy" v-if="kmDocumentDraftStore.isBusy"></km-modal-spinner>
 
      </CCardBody>
    </CCard>
    <CModal class="show d-block global-target-modal" :size="container? 'lg' : 'xl'" scrollable="true" alignment="center" 
        :visible="showGlobalTargetsModal"  @close="() => { showGlobalTargetsModal = false }">
        <CModalHeader>
            <CModalTitle>Global Goals/Targets</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <km-multi-checkbox v-model="selectedGlobalTargets" :options="globalTargets" @update:modelValue="onGoalsAndTargetSelected(selectedGlobalTargets, 'targets')">
            </km-multi-checkbox>
        </CModalBody>   
        <CModalFooter>
            <CButton color="secondary" @click="closeDialog">{{t('close')}}</CButton>
        </CModalFooter>
    </CModal>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-1/edit-target-part-1.json"></i18n>
<script setup>
  
    import { KmInputRichLstring, KmSelect, KmFormGroup, KmInputLstringMl, KmMultiCheckbox,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmFormWorkflow,
        KmValueTerm, KmGovernment, KmLanguages, KmHelp
    } from "~/components/controls";
    import viewTarget               from  "./view-target-part-1.vue";
    import { mapStores }            from 'pinia'
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 
    import {useToast} from 'vue-toast-notification';
    import { useStorage } from '@vueuse/core'
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { EditFormUtility } from "@/services/edit-form-utility";
    import {uniqBy} from 'lodash'

    const props = defineProps({
        identifier  : {type: String },
        rawDocument : {type: Object },
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    })
    const refProps                  = toRefs(props);
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const { user }                  = useAuth();
    const security                  = useSecurity();
    const route                     = useRoute();    
    const {t, locale }              = useI18n();
    const thesaurusStore            = useThesaurusStore ();
    const realmConfStore            = useRealmConfStore();
    const kmDocumentDraftStore      = useKmDocumentDraftsStore();
    const $toast                    = useToast();      
    const container                 = useAttrs().container;
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });
    const showGlobalTargetsModal    = ref(false);

    const headlineIndicatorsRef      = ref(null);
    const componentIndicatorsRef     = ref(null);
    const complementaryIndicatorsRef = ref(null);
    const binaryIndicatorsRef        = ref(null);
    const selectedGlobalTargets      = ref([]);
        
    const showSpinnerModal = ref(false);

    await Promise.all([
        GbfGoalsAndTargets.loadGbfGoalsAndTargets(),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_HEADLINE_INDICATORS),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPONENT_INDICATORS    ),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPLEMENTARY_INDICATORS),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS  ),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_DEGREE_OF_ALIGNMENT  ),
    ]);
    
    const document =  ref(emptyDocument());

    if(refProps.rawDocument.value){
        document.value = {...refProps.rawDocument.value};
    }
    else if(refProps.identifier.value || route?.params?.identifier){        
        document.value = await EditFormUtility.load(refProps.identifier.value||route.params.identifier);
    }

    if(document.value.globalTargetAlignment?.length){
        selectedGlobalTargets.value = document.value.globalTargetAlignment?.filter(e=>e.identifier.startsWith('GBF-T'))?.map(e=>{return { identifier : e.identifier }});        
    }
    
    //initialize for local use
    document.value.government = document.value?.government || {};
    document.value.additionalImplementation = document.value?.additionalImplementation || {};

    const globalTargets = computed(()=>{
        return (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS)||[]).sort((a,b)=>a.name.localeCompare(b.name))
    })
    const globalGoals   = computed(()=>{
        return ((thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS)||[]).sort((a,b)=>a.name.localeCompare(b.name)));
    })
    const gbfTargetConsideration = computed(()=>{
        return (thesaurusStore.getDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS)||[]).sort((a,b)=>a.name.localeCompare(b.name))
    })
    const formattedDegreeOfAlignments = computed(()=>{
        return thesaurusStore.getDomainTerms(THESAURUS.GBF_DEGREE_OF_ALIGNMENT)||[]
    })
    const globallyAlignedTargets  = computed(()=>document.value.globalTargetAlignment?.filter(e=>e.identifier.startsWith('GBF-T')))
    const headlineIndicators      = computed(()=>headlineIndicatorsRef.value||[]);
    const componentIndicators     = computed(()=>componentIndicatorsRef.value||[]);
    const complementaryIndicators = computed(()=>complementaryIndicatorsRef.value||[]);

    const selectedLocale = ref(locale.value);
    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
       
        clean.gbfGoalsAndTargetAlignment = undefined;
        clean.headlineIndicators =undefined
        clean.degreeOfAlignment=undefined

        return clean
    })
    
    onMounted(() => {
        if(user?.value?.isAuthenticated){
            document.value.government.identifier = document.value?.government?.identifier || user.value.government

            if(document.value?.globalTargetAlignment)
                onGoalsAndTargetSelected(document.value?.globalTargetAlignment, 'targets');

            if(document.value?.globalGoalAlignment)
                onGoalsAndTargetSelected(document.value?.globalGoalAlignment);
        }
    })  

    const onClose = async (document)=>{
        if(props.onClose)
            props.onClose(document)
        else{
            await useNavigateAppTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I);
        }
    }
    const onPostSaveDraft = async (document)=>{
        if(props.onPostSaveDraft)
            props.onPostSaveDraft(document)
    }

    const onGoalsAndTargetSelected = async (selected, type)=>{

        if(type == 'targets'){
            document.value.globalTargetAlignment = selected.map(e=>{
                const existing = document.value.globalTargetAlignment?.find(target=>target.identifier == e.identifier)
                return { identifier : e.identifier, degreeOfAlignment:{}, ...(existing||{}) }
            });
        }
        
        //show Indicators for both Global Goals and Targets
        const selectedGoalsAndTargets = [...(document.value.globalGoalAlignment||[]), ...(document.value.globalTargetAlignment||[]) ]
        const headlineRes       = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)}));
        const componentRes      = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfComponentIndicator(e.identifier)}));
        const complementaryRes  = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfComplementaryIndicator(e.identifier)}));
        const binaryRes         = await Promise.all(selectedGoalsAndTargets.map(e=>{return GbfGoalsAndTargets.loadGbfBinaryIndicator(e.identifier)}));

        headlineIndicatorsRef.value      = sortBy(uniqBy([...(headlineRes?.flat()||[])], 'identifier'), 'title')
        componentIndicatorsRef.value     = sortBy(uniqBy([...(componentRes?.flat()||[])], 'identifier'), 'title')
        complementaryIndicatorsRef.value = sortBy(uniqBy([...(complementaryRes?.flat()||[])], 'identifier'), 'title')
        binaryIndicatorsRef.value        = sortBy(uniqBy([...(binaryRes?.flat()||[])], 'identifier'), 'title')
        
        if(document.value?.componentIndicators?.length){
            document.value.componentIndicators = document.value?.componentIndicators.filter(selected=>{
                return componentIndicatorsRef.value.find(e=>e.identifier == selected.identifier)
            })
        }
        if(document.value?.complementaryIndicators?.length){
            document.value.complementaryIndicators = document.value?.complementaryIndicators.filter(selected=>{
                return complementaryIndicatorsRef.value.find(e=>e.identifier == selected.identifier)
            })
        }

    }

    function onGetDocument(){
        return cleanDocument;
    }

    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }

    function emptyDocument(){
        const emptyDoc = {
            header : {
                schema : SCHEMAS.NATIONAL_TARGET_7,
                identifier : useGenerateUUID(),
                languages  : EditFormUtility.getPreferredEditLanguages()
            },        
            government : {
                identifier : undefined
            },
            additionalImplementation : {}
            
        }
        if(route?.query?.globalTarget){
           emptyDoc.globalTargetAlignment = [{ identifier : route.query.globalTarget }];
        }

        return emptyDoc
    }

    function showAllTargets(){
        showGlobalTargetsModal.value = true;
    }
    function closeDialog(){
        showGlobalTargetsModal.value = false;
    }

</script>
<style>
    .global-target-modal .km-multi-checkbox .form-check{
        border: 1px solid #eee;
        margin: 5px;
        padding: 15px;
    }
    /* .global-target-modal .km-multi-checkbox .form-check input[type="checkbox"]{
        margin-left: -0.5em;
        margin-right: 5px;
    } */
</style>