<template>
    <CCard>
      <CCardHeader>
        <slot name="header">{{t('nationalTarget')}} </slot>
      </CCardHeader>
      <CCardBody>
            <km-form-workflow v-if="!isBusy" :focused-tab="props.workflowActiveTab" :get-document="onGetDocument"  
            :container="container"  :on-pre-close="onClose" :on-post-save-draft="onPostSaveDraft">
                <template v-slot:submission>   
                    <form name="editForm">    
                        <km-form-group>
                            <CAccordion :active-item-key="1" always-open>
                                <CAccordionItem :item-key="1">
                                    <CAccordionHeader>
                                        {{t('governmentAndLanguages')}}
                                    </CAccordionHeader>
                                    <CAccordionBody> 
                                        <km-form-group name="government" :caption="t('government')" required>
                                            <km-government v-model="document.government" ></km-government>                           
                                        </km-form-group>   

                                        <km-form-group name="languages" :caption="t('submissionLanguage')" required>
                                            <km-languages v-model="document.header.languages"></km-languages>
                                        </km-form-group>   
                                    </CAccordionBody>
                                </CAccordionItem>
                                </CAccordion>
                        </km-form-group>         
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{t('general')}}
                                </div>
                                <div class="card-body">  
                                    <km-form-group name="title" :caption="t('title')" required :data-content="t('titleHelp')">
                                        <km-input-lstring  id="title" :placeholder="t('title')" v-model="document.title" :locales="document.header.languages"></km-input-lstring>
                                    </km-form-group>
                                    <km-form-group name="description" 
                                        :caption="t('description')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.description" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="mainPolicyOfMeasureOrActionInfo" 
                                        :caption="t('mainPolicyMeasures')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.mainPolicyOfMeasureOrActionInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{t('alignment')}}
                                </div>
                                <div class="card-body">
                                    
                                    <km-form-group :caption="t('contributionToGoals')" name="globalGoalAlignment">                                     
                                            <km-select
                                                v-model="document.globalGoalAlignment"
                                                class="validationClass"
                                                label="title"
                                                track-by="identifier"
                                                value-key="identifier"
                                                :placeholder="t('globalGoals')"
                                                :options="globalGoals"
                                                :multiple="true"
                                                :close-on-select="false"
                                                @update:modelValue="onGoalsAndTargetSelected($event, 'goals')"
                                                :custom-label="customLabel"
                                                :custom-selected-item="customSelectedItem"
                                            >
                                            </km-select>
                                    </km-form-group>
                                    <km-form-group :caption="t('targetsAlignment')" required name="globalTargetAlignment">
                                        <div class="row">
                                            <div class="col-11">
                                                <km-select
                                                    v-model="selectedGlobalTargets"
                                                    class="validationClass"
                                                    label="shortTitle"
                                                    track-by="identifier"
                                                    value-key="identifier"
                                                    :placeholder="t('globalTargets')"
                                                    :options="globalTargets"
                                                    :multiple="true"
                                                    :close-on-select="false"
                                                    @update:modelValue="onGoalsAndTargetSelected($event, 'targets')"
                                                    :custom-label="customShortLabel"
                                                    :custom-selected-item="customSelectedItem"
                                                >
                                                </km-select>
                                            </div>
                                            <div class="col-1">                                                
                                                <button type="button" class="btn btn-secondary btn-xs" @click="showAllTargets">{{t('listTargets')}}</button>
                                            </div>
                                        </div>
                                        <small id="emailHelp" class="form-text text-muted">{{t('relevantDegreeOfAlignmentHelp')}}</small>

                                    </km-form-group>
                                    
                                    <km-form-group required :caption="t('degreeOfAlignment')" name="degreeOfAlignment" v-if="document?.globalTargetAlignment?.length">                                        
                                        
                                        <table class="table table-bordered">                                            
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <td class="w-25 fw-bold">{{t('degreeOf')}} 
                                                        <km-help :content="t('indicateHelp')">{{t('alignment')}}</km-help>
                                                    </td>
                                                </tr>
                                                <tr v-for="target in document.globalTargetAlignment" :key="target.identifier">
                                                    <td>
                                                        <km-form-group required :name="target.identifier+'_degreeOfAlignment'">
                                                            <label class="control-label" :for="target.identifier+'_degreeOfAlignment'">
                                                                <span class="visually-hidden">{{ t('degreeOfAlignment') }} - </span>
                                                                {{ lstring(globalTargets.find(e=>e.identifier == target.identifier).shortTitle, locale) }}
                                                                <km-help class="ms-1 me-1" 
                                                                    :title="lstring(globalTargets.find(e=>e.identifier == target.identifier).shortTitle)">
                                                                    <template #content>
                                                                        <strong>{{ lstring(globalTargets.find(e=>e.identifier == target.identifier).title)}}</strong>
                                                                        <div>
                                                                            <i>
                                                                                <small>
                                                                                {{lstring(globalTargets.find(e=>e.identifier == target.identifier).longDescription)}}
                                                                                </small>
                                                                            </i>
                                                                        </div>
                                                                    </template>
                                                                </km-help>
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
                                            <span :class="{'text-success font-weight-bold': (document.degreeOfAlignment||{}).identifier=='AABF237C-F906-40D2-9595-5226C8B18A58'}">{{t('high')}}</span>
                                            <span :class="{'text-warning font-weight-bold': (document.degreeOfAlignment||{}).identifier=='68197B76-67B4-40AD-BB14-A8C340E1320B'}">{{t('medium')}}</span>
                                            <span :class="{'text-danger font-weight-bold': (document.degreeOfAlignment||{}).identifier=='9668759B-3653-4994-A917-3F039B0BAA5C'}" >{{t('low')}}</span>
                                        </small>
                                    </km-form-group>    
                                    
                                    <km-form-group name="degreeOfAlignmentInfo" 
                                        :caption="t('explainCoveredGoals')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.degreeOfAlignmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="relatedOtherProcesses" :caption="t('considerationForImplementation')">
                                        <km-multi-checkbox v-model="document.implementingConsiderations" :options="gbfTargetConsideration">
                                        </km-multi-checkbox>
                                        <small id="emailHelp" class="form-text text-muted">{{t('relevantConsideration')}}</small>
                                    </km-form-group>
                                    <km-form-group name="implementingConsiderationsInfo" :caption="t('explainConsideration')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.implementingConsiderationsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>

                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group v-if="headlineIndicators?.length">
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{t('indicatorsUsedToMonitor')}}
                                </div>
                                <div class="card-body">
                                    <km-form-group :caption="t('headlineIndicators')" name="headlineIndicators">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>{{t('linkedHeadlineIndicator')}}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="indicator in headlineIndicators" :key="indicator.identifier">
                                                    <td>{{ lstring(indicator.title) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </km-form-group>
                                    <km-form-group :caption="t('binaryIndicators')" name="binaryIndicators" v-if="binaryIndicators && binaryIndicators.length">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>{{t('linkedBinaryIndicator')}}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="indicator in binaryIndicators" :key="indicator.identifier">
                                                    <td>{{ lstring(indicator.title) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </km-form-group>
                                    
                                    <km-form-group name="componentIndicators" :caption="t('componentIndicators')">
                                        <km-select
                                            v-model="document.componentIndicators"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            :placeholder="t('componentIndicators')"
                                            :options="componentIndicators"
                                            :multiple="true"
                                            :disabled="false"
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"
                                        >
                                        </km-select>
                                    </km-form-group>
                                    <km-form-group name="complementaryIndicators" :caption="t('complementaryIndicators')">
                                        <km-select
                                            v-model="document.complementaryIndicators"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            :placeholder="t('complementaryIndicators')"
                                            :options="complementaryIndicators"
                                            :multiple="true"
                                            :disabled="false"
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"
                                        >
                                        </km-select>
                                    </km-form-group>
                                    <km-form-group name="otherNationalIndicators"  :caption="t('nationalIndicators')">
                                        <km-input-lstring-ml v-model="document.otherNationalIndicators" :locales="document.header.languages"></km-input-lstring-ml>
                                        <small id="emailHelp" class="form-text text-muted">{{t('addOwnIndicatorsHelp')}}</small>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{t('nonStateActorCommitments')}}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="nonStateActorCommitmentInfo" :caption="t('listOfNonStateActors')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.nonStateActorCommitmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="hasNonStateActors"  :caption="t('anyOverlaps')">
                                        
                                        <km-form-check-group>
                                            <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsYes" :value="true"  v-model="document.hasNonStateActors" :label="t('yes')"/>
                                            <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsNo"  :value="false" v-model="document.hasNonStateActors" :label="t('no')"/>
                                        </km-form-check-group>
                                    </km-form-group> 
                                    <km-form-group v-if="document.hasNonStateActors==true" 
                                    name="nonStateActorsInfo" :caption="t('commitmentsAndActors')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.nonStateActorsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{t('meansToImplement')}}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="additionalImplementation" 
                                        :caption="t('additionalMeanOfImplementation')">
                                       
                                        <km-form-check-group>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationRequired"   value="additionalImplementationRequired"  v-model="document.additionalImplementation.identifier" :label="t('yesMeansOfImplementation')"/>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationAvailable"  value="additionalImplementationAvailable" v-model="document.additionalImplementation.identifier" :label="t('noMeansOfImplementation')"/>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationOther"      value="additionalImplementationOther"     v-model="document.additionalImplementation.identifier" :label="t('other')"/>
                                        </km-form-check-group>                                    
                                    </km-form-group> 
                                    <km-form-group for="additionalImplementationCustomValue"
                                        :caption="t('pleaseExplain')" required
                                        v-if="document.additionalImplementation.identifier=='additionalImplementationRequired' || document.additionalImplementation.identifier=='additionalImplementationOther'">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.additionalImplementation.customValue" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="additionalImplementationInfo" :caption="t('additionalExplanation')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.additionalImplementationInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    {{t('additionalInformation')}}
                                </div>
                                <div class="card-body">
                                    <km-form-group name="additionalInformation" :caption="t('relevantInformation')">
                                        <km-input-rich-lstring @onFileUpload="onFileUpload"  :identifier="document.header.identifier" v-model="document.additionalInformation" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                    </form>
                </template>
                <template v-slot:review>
                    <view-target :identifier="document.header.identifier" :document="cleanDocument"></view-target>
                </template>
            </km-form-workflow>
            <km-spinner center :visible="isBusy" v-if="isBusy"></km-spinner>
 
      </CCardBody>
    </CCard>
    <CModal class="show d-block global-target-modal" :size="container? 'lg' : 'xl'" scrollable="true" alignment="center" 
        :visible="showGlobalTargetsModal"  @close="() => { showGlobalTargetsModal = false }">
        <CModalHeader>
            <CModalTitle>{{t('globalGoalsAndTargets')}}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <km-multi-checkbox v-model="selectedGlobalTargets" :options="globalTargets" @update:modelValue="onGoalsAndTargetSelected(selectedGlobalTargets, 'targets')">
                <template #label="{option}">
                    {{ lstring(option.shortTitle) }}
                    <km-help class="ms-1 me-1" :title="lstring(option.shortTitle)">
                        <template #content>
                            <h5>{{ lstring(globalTargets.find(e=>e.identifier == option.identifier).title)}}</h5>
                            <div>
                                <i>
                                    <small>
                                    {{lstring(globalTargets.find(e=>e.identifier == option.identifier).longDescription)}}
                                    </small>
                                </i>
                            </div>
                        </template>
                    </km-help>
                </template>
            </km-multi-checkbox>
        </CModalBody>   
        <CModalFooter>
            <CButton color="secondary" @click="closeDialog">{{t('close')}}</CButton>
        </CModalFooter>
    </CModal>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-1/edit-target-part-1.json"></i18n>
<script setup>
  
    import viewTarget               from  "./view-target-part-1.vue";
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useRoute } from 'vue-router' 
    import { useStorage } from '@vueuse/core'
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
    import { EditFormUtility } from "@/services/edit-form-utility";
    import {uniqBy} from 'lodash'

    const props = defineProps({
        identifier         : {type: String },
        rawDocument        : {type: Object },
        workflowActiveTab  : {type:Number, default:1 },
        onClose            : {type:Function, required:false},
        onPostSaveDraft    : {type:Function, required:false},
    })
    const refProps                  = toRefs(props);
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const { user }                  = useAuth();
    const route                     = useRoute();    
    const {t, locale }              = useI18n();
    const thesaurusStore            = useThesaurusStore ();
    const container                 = useAttrs().container;
    const stateTargetWorkflow       = useStorage('ort-target-workflow', { batchId : undefined });
    const showGlobalTargetsModal    = ref(false);
    const document                  = ref(emptyDocument());
    const headlineIndicators        = ref(null);
    const componentIndicators       = ref(null);
    const complementaryIndicators   = ref(null);
    const binaryIndicators          = ref(null);
    const selectedGlobalTargets     = ref([]);      
    const isBusy                    = ref(false);

    const globalTargets               = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS)||[]).sort((a,b)=>a.name.localeCompare(b.name)));
    const globalGoals                 = computed(()=>((thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS)||[]).sort((a,b)=>a.name.localeCompare(b.name))));
    const gbfTargetConsideration      = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS)||[]).sort((a,b)=>a.name.localeCompare(b.name)));
    const formattedDegreeOfAlignments = computed(()=>thesaurusStore.getDomainTerms(THESAURUS.GBF_DEGREE_OF_ALIGNMENT)||[]);
    const cleanDocument = computed(()=>{
        const clean = useKmStorage().cleanDocument({...document.value});
        return clean
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

        headlineIndicators.value      = sortBy(uniqBy(headlineRes?.     flat()||[], 'identifier'), 'title');
        componentIndicators.value     = sortBy(uniqBy(componentRes?.    flat()||[], 'identifier'), 'title');
        complementaryIndicators.value = sortBy(uniqBy(complementaryRes?.flat()||[], 'identifier'), 'title');
        binaryIndicators.value        = sortBy(uniqBy(binaryRes?.       flat()||[], 'identifier'), 'title');
        
        document.value.headlineIndicators  = headlineIndicators.value.map(e=>customSelectedItem(e.identifier));
        document.value.binaryIndicators    = binaryIndicators  .value.map(e=>customSelectedItem(e.identifier));        
        document.value.componentIndicators = document.value?.componentIndicators?.filter(selected=>componentIndicators.value.find(e=>e.identifier == selected.identifier))
        document.value.complementaryIndicators = document.value?.complementaryIndicators?.filter(selected=>complementaryIndicators.value.find(e=>e.identifier == selected.identifier))
        if(!selectedGoalsAndTargets?.length)
            document.value.otherNationalIndicators = []
    }

    function onGetDocument(){
        return cleanDocument;
    }

    function onFileUpload({file, locale}){
        useOnFileUpload({document, file, locale});
    }

    const customLabel = ({title})=>{        
        return lstring(title, locale.value);
    }

    const customShortLabel = ({shortTitle})=>{        
        return lstring(shortTitle, locale.value);
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

    async function init(){
        isBusy.value = true;
        try{
            await Promise.all([
                GbfGoalsAndTargets.loadGbfGoalsAndTargets(),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_HEADLINE_INDICATORS),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPONENT_INDICATORS    ),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPLEMENTARY_INDICATORS),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS  ),
                thesaurusStore.loadDomainTerms(THESAURUS.GBF_DEGREE_OF_ALIGNMENT  ),
            ]);
            

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

            if(user?.value?.isAuthenticated){
                document.value.government.identifier = document.value?.government?.identifier || user.value.government

                if(document.value?.globalTargetAlignment)
                    onGoalsAndTargetSelected(document.value?.globalTargetAlignment, 'targets');

                if(document.value?.globalGoalAlignment)
                    onGoalsAndTargetSelected(document.value?.globalGoalAlignment);
            }
        }
        catch(e){
            useLogger().error(e, 'Error loading document for edit');
        }

        isBusy.value = false;
    }

    onMounted(() => {
        init();
    })  
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