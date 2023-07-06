<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> NBSAP Target view</slot>
      </CCardHeader>
      <CCardBody>
       
        <form>
            <CCard>
                <CCardBody v-if="document">
                {{ document }}
                <!-- {{ document.header }} -->
                    <div v-if="document.header.languages && document.header.languages.length > 1" 
                        class="d-grid d-md-flex justify-content-md-end mb-2">
                        <km-locales v-model="selectedLocale" :locales="document.header.languages"></km-locales>
                    </div>
                     <km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                                General
                            </div>
                            <div class="card-body">  
                                <km-form-group v-if="document.government && document.government.identifier">
                                    <label class="form-label" for="government">Government</label>
                                        <km-term v-model="document.government" :locale="selectedLocale"></km-term>
                                    
                                </km-form-group>   

                                <!--                          
                                <km-form-group>
                                    <label class="form-label" for="targetTitle">Full name/title of national target</label>                           
                                    <km-form-group> 
                                        <km-input-lstring  id="targetTitle" placeholder="Enter national target title" v-model="document.title" :locales="document.header.languages"></km-input-lstring>
                                    </km-form-group>                                    
                                </km-form-group>                             -->

                                <km-form-group v-if="document.mainPolicyOfMeasureOrActionInfo">
                                    <label class="form-label" for="mainPolicyOfMeasureOrActionInfo">Please outline the main policy measures or actions that will be taken to achieve this national target. </label>
                                    <km-lstring-value type="html"  v-model="document.mainPolicyOfMeasureOrActionInfo" :locale="selectedLocale"></km-lstring-value>
                                </km-form-group>
                            </div>
                        </div>
                    </km-form-group>
                    <!--<km-form-group>
                        <div class="card">
                            <div class="card-header bg-secondary">
                                Alignment
                            </div>
                            <div class="card-body">
                                <km-form-group>
                                    <label class="form-label" for="exampleFormControlSelect1">Alignment with global goals and targets</label>
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
                                                <km-lstring-value html  v-model="document.implementingConsiderationsInfo" :locales="document.header.languages"></km-lstring-value>
                                            </km-form-group>
                                        </div>
                                    </div>
                                </km-form-group>

                                <km-form-group>
                                    <label class="form-label" for="exampleFormControlSelect1">Degree of alignment</label>
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
                                    <km-lstring-value html  v-model="document.degreeOfAlignmentInfo" :locales="document.header.languages"></km-lstring-value>
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
                                <km-form-group>
                                    <label class="form-label" for="exampleFormControlSelect1">Headline indicators</label>
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
                                    <km-lstring-value html  v-model="document.nonStateActorCommitmentInfo" :locales="document.header.languages"></km-lstring-value>
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
                                    <km-lstring-value html  v-model="document.nonStateActorsInfo" :locales="document.header.languages"></km-lstring-value>
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
                                <km-form-group 
                                v-if="document.additionalImplementation.identifier=='additionalImplementationRequired' || document.additionalImplementation.identifier=='otherImplementation'">
                                    <label class="form-label" for="additionalImplementationCustomValue"> 
                                        Please explain (Additional means of implementation are needed for the attainment of this national target)
                                    </label>
                                    <km-lstring-value html  v-model="document.additionalImplementation.customValue" :locales="document.header.languages"></km-lstring-value>
                                </km-form-group>
                                <km-form-group>
                                    <label class="form-label" for="additionalImplementationInfo">Additional explanation</label>
                                    <km-lstring-value html  v-model="document.additionalImplementationInfo" :locales="document.header.languages"></km-lstring-value>
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
                                
                                <km-form-group>
                                    <label class="form-label" for="elementOfGlobalTargetsinfo">Elements of the global targets addressed by national targets</label>
                                    <km-lstring-value html  v-model="document.elementOfGlobalTargetsinfo" :locales="document.header.languages"></km-lstring-value>
                                </km-form-group>
                                <km-form-group>
                                    <label class="form-check-label" for="hasReferncePeriod">Is there a reference period and national target which relates to the headline indicator?</label>
                                    <km-form-check-group>
                                        <km-form-check-item inline type="radio" name="hasReferncePeriod"  for="hasReferncePeriod" id="hasReferncePeriodYes" :value="true"  v-model="document.hasReferncePeriod" label="Yes"/>
                                        <km-form-check-item inline type="radio" name="hasReferncePeriod"  for="hasReferncePeriod" id="hasReferncePeriodNo"  :value="false" v-model="document.hasReferncePeriod" label="No"/>
                                    </km-form-check-group>
                                </km-form-group> 

                                <km-form-group v-if="document.hasReferncePeriod">
                                    <label class="form-label" for="referencePeriodInfo">Please explain</label>
                                    <km-lstring-value html  v-model="document.referencePeriodInfo" :locales="document.header.languages"></km-lstring-value>
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
                                    <km-lstring-value html  v-model="document.additionalInfromation" :locales="document.header.languages"></km-lstring-value>
                                </km-form-group>
                            </div>
                        </div>
                    </km-form-group> -->
                </CCardBody>
            </CCard>

            <!-- <div class="d-grid d-md-flex justify-content-md-end mt-5">
                <CButton @click="onSubmitDocument()" color="primary" class="me-md-2">Save</CButton> 
                <CButton @click="previewDocument()" color="primary" class="me-md-2">Preview</CButton> 
                <CButton @click="shareDocument()" color="dark" class="me-md-2">Share</CButton> 
                <CButton @click="printDocument()" color="dark" class="me-md-2">Print</CButton> 
                <CButton @click="onClose()" color="danger" class="me-md-2">Close</CButton>
            </div> -->
            <km-modal-spinner :visible="kmDocumentDraftStore.isBusy" v-if="kmDocumentDraftStore.isBusy"></km-modal-spinner>
        </form>

      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import { KmFormGroup, KmModalSpinner, KmLstringValue,
        KmLocales, KmTerm
    } from "~/components/controls";
    import { mapStores }            from 'pinia'
    import { THEASURUS, ROLES, SCHEMAS } from '@/constants';
    import { languages }            from '@/app-data/languages'
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';
    import { useKmDocumentDraftsStore }    from '@/stores/kmDocumentDrafts';
    import { useRoute } from 'vue-router' 

    const { user }        = useAuth();
    const security        = useSecurity();
    const route           = useRoute();
    const {$appRoutes }   = useNuxtApp();
    const locale          = useI18n().locale
    const thesaurusStore  = useThesaurusStore ();
    const countriesStore  = useCountriesStore ();
    const realmConfStore  = useRealmConfStore();
    const kmDocumentDraftStore  = useKmDocumentDraftsStore();

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    })

    let { document, identifier } = toRefs(props)

    const showSpinnerModal = ref(false);
    const selectedLocale = ref(locale.value);

    onMounted(() => {
        console.log(document)
        if(props.identifier && !props.document){
            loadDocument(props.identifier)       
        }
        else {
            setSelectedLocale();
        }
    })
 
    const onClose = async ()=>{
        await navigateTo($appRoutes.NBSAPS_TARGETS_OVERVIEW)
    }

    async function loadDocument(identifier){

        document = await kmDocumentDraftStore.loadDraftDocument(route.params.identifier);     
        setSelectedLocale();
    }

    function setSelectedLocale(){
        if(document?.header?.languages?.length){
            if(document.header.languages.length == 1)
                selectedLocale.value = document.header.languages[0];
            else if(document.header.languages.includes(locale.value))
                selectedLocale.value = locale.value;
            else 
                selectedLocale.value = document.header.languages[0]
        }
        
    }


</script>
