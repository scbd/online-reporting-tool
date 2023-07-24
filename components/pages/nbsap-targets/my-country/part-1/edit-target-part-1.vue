<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> NBSAP Target</slot>
      </CCardHeader>
      <CCardBody>
       
        
                <!-- {{ document }} -->

            <km-form-workflow :focused-tab="1" :get-document="onGetDocment" >
                <template v-slot:submission>   
                    <form name="editForm">             
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

                                    <km-form-group name="title" caption="Full name/title of national target" required>
                                        <km-input-lstring  id="title" placeholder="Enter national target title" v-model="document.title" :locales="document.header.languages"></km-input-lstring>
                                    </km-form-group>

                                    <km-form-group name="mainPolicyOfMeasureOrActionInfo" 
                                        caption="Please outline the main policy measures or actions that will be taken to achieve this national target.">
                                        <km-input-rich-lstring v-model="document.mainPolicyOfMeasureOrActionInfo" :locales="document.header.languages"></km-input-rich-lstring>
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
                                    <km-form-group caption="Alignment with global goals and targets" required name="gbfGoalsAndTargetAlignment">
                                        <km-select
                                            v-model="document.gbfGoalsAndTargetAlignment"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            placeholder="Global Goals and Targets"
                                            :options="globalGoalsAndTargets"
                                            :multiple="true"
                                            :close-on-select="false"
                                            @change="onGoalsAndTargetSelected"
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"
                                        >
                                        </km-select>
                                        <small id="emailHelp" class="form-text text-muted">Please check all relevant national targets and indicate their degree of alignment with the global targets.</small>

                                    </km-form-group>
                                    
                                    <km-form-group required caption="Degree of alignment" name="degreeOfAlignment">                                        
                                        <km-select
                                            v-model="document.degreeOfAlignment"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            placeholder="Degree of alignment"
                                            :options="formatedDegreeOfAlignments"
                                            :multiple="false"
                                            :disabled="false"
                                            :custom-selected-item="customSelectedItem"
                                        >
                                        </km-select>
                                        <small id="emailHelp" class="form-text text-muted">
                                            <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[0].identifier}">High = covers all elements of the global target; </span>
                                            <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[1].identifier}">Medium = covers most elements of the global target; </span>
                                            <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[2].identifier}">Low = covers at least one element of the global target</span>
                                        </small>
                                    </km-form-group>
                                    <km-form-group name="implementingConsiderationsInfo" 
                                        caption="Explanation, including which aspects of the goal or target are covered">
                                        <km-input-rich-lstring v-model="document.degreeOfAlignmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>

                                    <km-form-group>
                                        <div class="card">
                                            <div class="card-body">                                                
                                                <km-form-group name="relatedOtherProcesses" caption="Which of the “considerations for implementation” in Section C of the GBF have been taken into account in developing this national target, and the actions to implement it">
                                                    <km-select
                                                        v-model="document.implementingConsiderations"
                                                        class="validationClass"
                                                        label="title"
                                                        track-by="identifier"
                                                        value-key="identifier"
                                                        placeholder="Considerations for implementation"
                                                        :options="gbfTargetConsideration"
                                                        :multiple="true"
                                                        :close-on-select="false"
                                                        :custom-label="customLabel"
                                                        :custom-selected-item="customSelectedItem"
                                                    >
                                                    </km-select>
                                                    <small id="emailHelp" class="form-text text-muted">Please check all relevant considerations for implementation.</small>
                                                </km-form-group>
                                                <km-form-group name="implementingConsiderationsInfo" caption="Please explain how these considerations have been taken into account">
                                                    <km-input-rich-lstring v-model="document.implementingConsiderationsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                                </km-form-group>
                                            </div>
                                        </div>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Indicators to be used to monitor this national target
                                </div>
                                <div class="card-body">
                                    <km-form-group caption="Headline and Binary indicators" required name="headlineIndicators">
                                        <km-select
                                            v-model="document.headlineIndicators"
                                            class="validationClass"
                                            label="title"
                                            track-by="identifier"
                                            value-key="identifier"
                                            placeholder="Headline and Binary indicators"
                                            :options="headlineIndicators"
                                            :multiple="true"
                                            :disabled="false"
                                            :custom-label="customLabel"
                                            :custom-selected-item="customSelectedItem"
                                        >
                                        </km-select>
                                        <!-- <small id="emailHelp" class="form-text text-muted">help!!!!</small> -->
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
                                        <!-- <small id="emailHelp" class="form-text text-muted">help!!!!</small> -->
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
                                        <!-- <small id="emailHelp" class="form-text text-muted">help!!!!</small> -->
                                    </km-form-group>
                                    <km-form-group name="otherNationalIndicators"  caption="Other national indicators">
                                        
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
                                        <km-input-rich-lstring v-model="document.nonStateActorCommitmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="hasNonStateActors"  caption="Are there any overlaps or links between this national target and targets or commitments submitted as non-State actor commitments to the Kunming-Montreal Global Biodiversity Framework?">
                                        
                                        <km-form-check-group>
                                            <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsYes" :value="true"  v-model="document.hasNonStateActors" label="Yes"/>
                                            <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsNo"  :value="false" v-model="document.hasNonStateActors" label="No"/>
                                        </km-form-check-group>
                                    </km-form-group> 
                                    <km-form-group v-if="document.hasNonStateActors==true" 
                                    name="nonStateActorsInfo" caption="please indicate which commitment(s) and which actor(s)">
                                        <km-input-rich-lstring v-model="document.nonStateActorsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                </div>
                            </div>
                        </km-form-group>
                        <km-form-group>
                            <div class="card">
                                <div class="card-header bg-secondary">
                                    Means of implementation and barriers to implementation
                                </div>
                                <div class="card-body">
                                    <km-form-group name="additionalImplementation" 
                                        caption="Please indicate if additional means of implementation are needed for the attainment of this national target.">
                                       
                                        <km-form-check-group>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationRequire"    value="additionalImplementationRequired"  v-model="document.additionalImplementation.identifier" label="Yes (Additional means of implementation are needed for the attainment of this national target)"/>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationAvailable"  value="additionalImplementationAvailable" v-model="document.additionalImplementation.identifier" label="No (Means of implementation available)"/>
                                            <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationOther"      value="additionalImplementationOther"                             v-model="document.additionalImplementation.identifier" label="Other"/>
                                        </km-form-check-group>                                    
                                    </km-form-group> 
                                    <km-form-group for="additionalImplementationCustomValue"
                                        caption="Please explain (Additional means of implementation are needed for the attainment of this national target)" required
                                        v-if="document.additionalImplementation.identifier=='additionalImplementationRequired' || document.additionalImplementation.identifier=='additionalImplementationOther'">
                                        <km-input-rich-lstring v-model="document.additionalImplementation.customValue" :locales="document.header.languages"></km-input-rich-lstring>
                                    </km-form-group>
                                    <km-form-group name="additionalImplementationInfo" caption="Additional explanation">
                                        <km-input-rich-lstring v-model="document.additionalImplementationInfo" :locales="document.header.languages"></km-input-rich-lstring>
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
                                    <km-form-group name="referencePeriodInfo" caption="Any other relevant information">
                                        <km-input-rich-lstring v-model="document.additionalinformation" :locales="document.header.languages"></km-input-rich-lstring>
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

            <km-modal-spinner :visible="kmDocumentDraftStore.isBusy" v-if="kmDocumentDraftStore.isBusy"></km-modal-spinner>
 

      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import { KmInputRichLstring, KmSelect, KmFormGroup,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmFormWorkflow
    } from "~/components/controls";
    import viewTarget               from  "./view-target-part-1.vue";
    import { mapStores }            from 'pinia'
    import { languages }            from '@/app-data/languages'
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 
    import {useToast} from 'vue-toast-notification';
    import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";

    const {$appRoutes:appRoutes }   = useNuxtApp();
    const { user }                  = useAuth();
    const security                  = useSecurity();
    const route                     = useRoute();    
    const {t, locale }              = useI18n();
    const thesaurusStore            = useThesaurusStore ();
    const countriesStore            = useCountriesStore ();
    const realmConfStore            = useRealmConfStore();
    const kmDocumentDraftStore      = useKmDocumentDraftsStore();
    const $toast                    = useToast();

    const headlineIndicatorsRef      = ref(null);
    const componentIndicatorsRef     = ref(null);
    const complementaryIndicatorsRef = ref(null);
        
    const showSpinnerModal = ref(false);

    await Promise.all([
        // thesaurusStore.loadDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS),
        // thesaurusStore.loadDomainTerms(THESAURUS.GBF_GLOBAL_GOALS),
        GbfGoalsAndTargets.loadGbfGoalsAndTargets(),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_HEADLINE_INDICATORS),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPONENT_INDICATORS    ),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_COMPLEMENTARY_INDICATORS),
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS  ),
        countriesStore.loadCountries()
    ]);

    if(route?.params?.identifier){
        await kmDocumentDraftStore.loadDraftDocument(route.params.identifier);
        if(!kmDocumentDraftStore.draftRecord){
            //TODO: show error that the record does not exists.
            await navigateTo(appRoutes.NBSAPS_TARGETS_NEW);
            // return;
        }        
    }

    const document =  ref(route?.params?.identifier ? kmDocumentDraftStore.draftRecord.body : emptyDocument() );
    //initilize for local use
    document.value.additionalImplementation = document.value.additionalImplementation || {};

    const formatedLanguages     = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));
    const globalGoalsAndTargets = computed(()=>{
        const goalsAndTargets = [
            ...((thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS)||[]).sort((a,b)=>a.name.localeCompare(b.name))),
            ...((thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS)||[]).sort((a,b)=>a.name.localeCompare(b.name))), 
        ]
        return goalsAndTargets;
    })
    const gbfTargetConsideration = computed(()=>{
        return (thesaurusStore.getDomainTerms(THESAURUS.GBF_TARGETS_CONSIDERATIONS)||[]).sort((a,b)=>a.name.localeCompare(b.name))
    })
    const formatedDegreeOfAlignments = computed(()=>{return degreeOfAlignments })
    const countryList                = computed(()=>{
        if(!countriesStore?.countries?.length)
            return [];

        const mapCountries = countriesStore.countries.map(e=>{
            return { name : e.name[locale.value], code : e.code?.toLowerCase()}
        })

        return mapCountries;
    })
    const headlineIndicators      = computed(()=>headlineIndicatorsRef.value||[]);
    const componentIndicators     = computed(()=>componentIndicatorsRef.value||[]);
    const complementaryIndicators = computed(()=>complementaryIndicatorsRef.value||[]);

    const selectedLocale = ref(locale.value);
    const cleanDocument = computed(()=>{
        const clean = useStorage().cleanDocument({...document.value});
        return clean
    })
    
    onMounted(() => {
        if(user?.value?.isAuthenticated){
            document.value.government.identifier = document.value?.government?.identifier || user.value.government
            if(document.value?.gbfGoalsAndTargetAlignment)
                onGoalsAndTargetSelected(document.value?.gbfGoalsAndTargetAlignment);
        }
    })

    const onSubmitDocument = async ()=>{
        try{
            showSpinnerModal.value = true;            
            // await navigateTo('/nbsap-targets')

            const lDocument = useStorage().cleanDocument({...document.value})

            await kmDocumentDraftStore.saveDraft(lDocument.header.identifier, lDocument);
            if(kmDocumentDraftStore.error?.length)
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

    const onClose = async ()=>{
        await navigateTo(appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I)
    }
    const onGoalsAndTargetSelected = async (selected)=>{
        
        const headlineRes       = await Promise.all(selected.map(e=>{return GbfGoalsAndTargets.loadGbfHeadlineIndicator(e.identifier)}));
        const componentRes      = await Promise.all(selected.map(e=>{return GbfGoalsAndTargets.loadGbfComponentIndicator(e.identifier)}));
        const complementaryRes  = await Promise.all(selected.map(e=>{return GbfGoalsAndTargets.loadGbfComplementaryIndicator(e.identifier)}));

        headlineIndicatorsRef.value      = sortBy([...(headlineRes?.flat()||[])], 'title')
        componentIndicatorsRef.value     = sortBy([...(componentRes?.flat()||[])], 'title')
        complementaryIndicatorsRef.value = sortBy([...(complementaryRes?.flat()||[])], 'title')

        if(document.value?.headlineIndicators?.length){
            document.value.headlineIndicators = document.value?.headlineIndicators.filter(selected=>{
                return headlineIndicatorsRef.value.find(e=>e.identifier == selected.identifier)
            })
        }
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

    function onGetDocment(){
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
                languages  : ['en']
            },        
            government : {
                identifier : undefined
            },
            additionalImplementation : {}
            
        }
        if(route?.query?.globalTarget){
           emptyDoc.gbfGoalsAndTargetAlignment = [{ identifier : route.query.globalTarget }];
        }
        if(route?.query?.headlineIndicator){
           emptyDoc.headlineIndicators = [{ identifier : route.query.headlineIndicator }];
        }
        return emptyDoc
    }

</script>
