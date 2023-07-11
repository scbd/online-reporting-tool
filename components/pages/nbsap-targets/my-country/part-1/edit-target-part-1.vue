<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> NBSAP Target</slot>
      </CCardHeader>
      <CCardBody>
       
        <form>
                <!-- {{ document }} -->

            <km-form-workflow :current-tab="1">
                <template #submission>
                <!-- <div>
                    <div class="card">
                    <div class="card-header bg-secondary">
                        
                    </div>
                    <div class="card-body">
                        
                    </div>
                    </div>
                </div> -->
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
                                <km-form-group name="targetTitle" caption="Full name/title of national target" required>
                                    <km-form-group> 
                                        <km-input-lstring  id="targetTitle" placeholder="Enter national target title" v-model="document.title" :locales="document.header.languages"></km-input-lstring>
                                    </km-form-group>                                    
                                </km-form-group>                            

                                <km-form-group>
                                    <label class="form-label" for="mainPolicyOfMeasureOrActionInfo">Please outline the main policy measures or actions that will be taken to achieve this national target. </label>
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
                                <km-form-group caption="Alignment with global goals and targets" required>
                                    <!-- <label class="form-label" for="exampleFormControlSelect1"></label> -->
                                    <km-select
                                        v-model="selectedGbfTargets"
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

                                    <!-- <km-term v-model="document.gbfGoalsAlignment[0]" :locale="document.header.languages[0]"></km-term> -->
                                </km-form-group>
                                <km-form-group>
                                    <label  class="form-check-label" for="hasImplementingConsiderations">Considerations for implementation of other non-target elements of the Kunming Montreal Global Biodiversity Framework</label>
                                    <km-form-check-group>
                                        <km-form-check-item inline type="radio" name="hasImplementingConsiderations"  for="hasImplementingConsiderations" id="hasImplementingConsiderationsYes" :value="true"  v-model="document.hasImplementingConsiderations" label="Yes"/>
                                        <km-form-check-item inline type="radio" name="hasImplementingConsiderations"  for="hasImplementingConsiderations" id="hasImplementingConsiderationsNo"  :value="false" v-model="document.hasImplementingConsiderations" label="No"/>
                                    </km-form-check-group>
                                </km-form-group>
                                <km-form-group v-if="document.hasImplementingConsiderations==true">
                                    <div class="card">
                                        <div class="card-body">                                                
                                            <km-form-group >
                                                <label class="form-label" for="relatedOtherProcesses">Which of the “considerations for implementation” in Section C of the GBF have been taken into account in developing this national target, and the actions to implement it </label>
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
                                            <km-form-group>
                                                <label class="form-label" for="implementingConsiderationsInfo">Please explain how these considerations have been taken into account</label>
                                                <km-input-rich-lstring v-model="document.implementingConsiderationsInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                            </km-form-group>
                                        </div>
                                    </div>
                                </km-form-group>

                                <km-form-group required caption="Degree of alignment">
                                    <label class="form-label" for="exampleFormControlSelect1" ></label>
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
                                <km-form-group>
                                    <label class="form-label" for="implementingConsiderationsInfo">Explanation, including which aspects of the goal or target are covered</label>
                                    <km-input-rich-lstring v-model="document.degreeOfAlignmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
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
                                <km-form-group caption="Headline indicators" required>
                                    <label class="form-label" for="exampleFormControlSelect1"></label>
                                    <km-select
                                        v-model="document.headlineIndicators"
                                        class="validationClass"
                                        label="title"
                                        track-by="identifier"
                                        value-key="identifier"
                                        placeholder="Headline indicators"
                                        :options="headlineIndicators"
                                        :multiple="true"
                                        :disabled="false"
                                        :custom-label="customLabel"
                                        :custom-selected-item="customSelectedItem"
                                    >
                                    </km-select>
                                    <small id="emailHelp" class="form-text text-muted">help!!!!</small>
                                </km-form-group>
                                <km-form-group>
                                    <label class="form-label" for="componentIndicators">Component indicators</label>
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
                                    <small id="emailHelp" class="form-text text-muted">help!!!!</small>
                                </km-form-group>
                                <km-form-group>
                                    <label class="form-label" for="complementaryIndicators">Complementary indicators</label>
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
                                    <small id="emailHelp" class="form-text text-muted">help!!!!</small>
                                </km-form-group>
                                <km-form-group>
                                    <label class="form-label" for="otherNationalIndicators">Other national indicators</label>
                                    
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
                                <km-form-group>
                                    <label class="form-label" for="nonStateActorCommitmentInfo">List the non-state commitments towards this national Target</label>
                                    <km-input-rich-lstring v-model="document.nonStateActorCommitmentInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                </km-form-group>
                                <km-form-group>
                                    
                                    <label class="form-check-label" for="hasNonStateActors">
                                        Are there any overlaps or links between this national target and targets or commitments submitted as non-State actor commitments to the Kunming-Montreal Global Biodiversity Framework?</label>
                                    <km-form-check-group>
                                        <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsYes" :value="true"  v-model="document.hasNonStateActors" label="Yes"/>
                                        <km-form-check-item inline type="radio" name="hasNonStateActors"  for="hasNonStateActors" id="hasNonStateActorsNo"  :value="false" v-model="document.hasNonStateActors" label="No"/>
                                    </km-form-check-group>
                                </km-form-group> 
                                <km-form-group v-if="document.hasNonStateActors==true">
                                    <label class="form-label" for="nonStateActorsInfo"> please indicate which commitment(s) and which actor(s)</label>
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
                                <km-form-group>
                                    <label class="form-check-label" for="additionalImplementation">
                                    Please indicate if additional means of implementation are needed for the attainment of this national target.</label>
                                    <km-form-check-group>
                                        <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationRequire"    value="additionalImplementationRequired"  v-model="document.additionalImplementation.identifier" label="Additional means of implementation are needed for the attainment of this national target"/>
                                        <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationAvailable"  value="additionalImplementationAvailable" v-model="document.additionalImplementation.identifier" label="Means of implementation available"/>
                                        <km-form-check-item type="radio" name="additionalImplementation"  for="additionalImplementation" id="additionalImplementationOther"      value="other"                             v-model="document.additionalImplementation.identifier" label="Other"/>
                                    </km-form-check-group>                                    
                                </km-form-group> 
                                <km-form-group for="additionalImplementationCustomValue"
                                    caption="Please explain (Additional means of implementation are needed for the attainment of this national target)" required
                                    v-if="document.additionalImplementation.identifier=='additionalImplementationRequired' || document.additionalImplementation.identifier=='otherImplementation'">
                                    <km-input-rich-lstring v-model="document.additionalImplementation.customValue" :locales="document.header.languages"></km-input-rich-lstring>
                                </km-form-group>
                                <km-form-group>
                                    <label class="form-label" for="additionalImplementationInfo">Additional explanation</label>
                                    <km-input-rich-lstring v-model="document.additionalImplementationInfo" :locales="document.header.languages"></km-input-rich-lstring>
                                </km-form-group>
                            </div>
                        </div>
                    </km-form-group>
                    
                    <km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                                Additional infromation
                            </div>
                            <div class="card-body">
                                <km-form-group>
                                    <label class="form-label" for="referencePeriodInfo">Any other relevant infromation</label>
                                    <km-input-rich-lstring v-model="document.additionalInfromation" :locales="document.header.languages"></km-input-rich-lstring>
                                </km-form-group>
                            </div>
                        </div>
                    </km-form-group>
                </template>
                <template #review>
                    <view-target :identifier="document.header.identifier" :document="cleanDocument"></view-target>
                </template>
            </km-form-workflow>

            <div class="d-grid d-md-flex justify-content-md-end mt-5">
                <CButton @click="onSubmitDocument()" color="primary" class="me-md-2">Save</CButton> 
                <CButton @click="previewDocument()" color="primary" class="me-md-2">Preview</CButton> 
                <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton> 
                <CButton @click="onClose()" color="danger" class="me-md-2">Close</CButton>
            </div>
            <km-modal-spinner :visible="kmDocumentDraftStore.isBusy" v-if="kmDocumentDraftStore.isBusy"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import { KmInputRichLstring, KmSelect, KmFormGroup,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring,KmModalSpinner, KmFormWorkflow
    } from "~/components/controls";
    import viewTarget               from  "./view-target-part-1.vue";
    import { mapStores }            from 'pinia'
    import { THEASURUS, ROLES, SCHEMAS } from '@/constants';
    import { languages }            from '@/app-data/languages'
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 
    import {useToast} from 'vue-toast-notification';
    import {lstring } from '@/util/filter'

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const locale          = useI18n().locale
    const thesaurusStore  = useThesaurusStore ();
    const countriesStore  = useCountriesStore ();
    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();
    const $toast                = useToast();
        
    const showSpinnerModal = ref(false);
    const selectedGbfTargets = ref([]);

    await Promise.all([
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_GOALS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_HEADLINE_INDICATORS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_COMPONENT_INDICATORS    ),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_COMPLEMENTARY_INDICATORS),
        thesaurusStore.loadDomainTerms(THEASURUS.GBF_TARGETS_CONSIDERATIONS  ),
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

    selectedGbfTargets.value =  [   ...(document.value?.gbfGoalsAlignment||[]),
                                    ...(document.value?.gbfTargetsAlignment||[])
                                ]; 

    const formatedLanguages     = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));
    const globalGoalsAndTargets = computed(()=>{
        const goalsAndTargets = [
            ...((thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_GOALS)||[]).sort((a,b)=>a.name.localeCompare(b.name))),
            ...((thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS)||[]).sort((a,b)=>a.name.localeCompare(b.name))), 
        ]
        console.log(goalsAndTargets);
        return goalsAndTargets;
    })
    const gbfTargetConsideration = computed(()=>{
        return (thesaurusStore.getDomainTerms(THEASURUS.GBF_TARGETS_CONSIDERATIONS)||[]).sort((a,b)=>a.name.localeCompare(b.name))
    })
    const formatedDegreeOfAlignments = computed(()=>{return degreeOfAlignments })
    const countryList                = computed(()=>{
        if(!countriesStore?.countries?.length)
            return [];

        const mapCountries = countriesStore.countries.map(e=>{
            return { name : e.name[useI18n().locale.value], code : e.code?.toLowerCase()}
        })

        return mapCountries;
    })
    const headlineIndicators      = computed(()=>{ return (thesaurusStore.getDomainTerms(THEASURUS.GBF_HEADLINE_INDICATORS)||[]).sort((a,b)=>a.name.localeCompare(b.name)) });
    const componentIndicators     = computed(()=>{ return (thesaurusStore.getDomainTerms(THEASURUS.GBF_COMPONENT_INDICATORS)||[]).sort((a,b)=>a.name.localeCompare(b.name)) });
    const complementaryIndicators = computed(()=>{ return (thesaurusStore.getDomainTerms(THEASURUS.GBF_COMPLEMENTARY_INDICATORS)||[]).sort((a,b)=>a.name.localeCompare(b.name)) });

    const selectedLocale = ref(locale.value);
    const cleanDocument = computed(()=>{
        const clean = useStorage().cleanDocument({...document.value});
        return clean
    })
    onMounted(() => {
        if(user?.value?.isAuthenticated){
            document.value.government.identifier = document.value?.government?.identifier || user.value.government
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
    const onGoalsAndTargetSelected = (selected)=>{
        document.value.gbfGoalsAlignment = selected?.filter(e=>e.identifier.startsWith('GBF-GOAL')).map(e=>customSelectedItem(e.identifier))
        document.value.gbfTargetsAlignment = selected?.filter(e=>e.identifier.startsWith('GBF-TARGET')).map(e=>customSelectedItem(e.identifier))
    }
    const customLabel = ({title})=>{        
        return lstring(title, useI18n().locale.value);
    }
    const customSelectedItem = (item)=>{
        return { identifier : item };
    }
    function emptyDocument(){
        return {
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
    }


</script>
