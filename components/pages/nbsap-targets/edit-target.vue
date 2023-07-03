<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> NBSAP Target New</slot>
      </CCardHeader>
      <CCardBody>
        <form>
            <CCard>
                <CCardBody>
                {{ document }}
                {{ selectedGbfTargets }}
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
                                <km-form-group>
                                    <label class="form-label" for="government">Government</label>
                                    <km-select
                                        v-model="document.government.identifier"
                                        class="validationClass"
                                        label="name"
                                        track-by="code"
                                        value-key="code"
                                        placeholder="Government"
                                        :options="countryList"
                                        :disabled="!isAdmin">
                                    </km-select>                                
                                </km-form-group>   

                                <km-form-group>
                                    <label class="form-label" for="languages">Please select in which language(s) you wish to submit this record</label>
                                    <km-select
                                        v-model="document.header.languages"
                                        class="validationClass"
                                        label="title"
                                        track-by="code"
                                        value-key="code"
                                        placeholder="Language of record"
                                        :options="formatedLanguages"
                                        :multiple="true"
                                    >
                                    </km-select>
                                </km-form-group>                           
                                <km-form-group>
                                    <label class="form-label" for="targetTitle">Full name/title of national target</label>                           
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
                                <km-form-group>
                                    <label class="form-label" for="exampleFormControlSelect1">Alignment with global goals and targets</label>
                                    <km-select
                                        v-model="selectedGbfTargets"
                                        class="validationClass"
                                        label="name"
                                        track-by="identifier"
                                        value-key="identifier"
                                        placeholder="Global Goals and Targets"
                                        :options="globalGoalsAndTargets"
                                        :multiple="true"
                                        :close-on-select="false"
                                    >
                                    </km-select>
                                    <small id="emailHelp" class="form-text text-muted">Please check all relevant national targets and indicate their degree of alignment with the global targets.</small>
                                </km-form-group>
                                <km-form-group>
                                    <label  class="form-check-label" for="hasEnablingConditions">Enabling conditions and/or other non-target elements of the KunmingMontreal Global Biodiversity Framework</label>
                                    <km-form-check-group>
                                        <km-form-check-item inline type="radio" name="hasEnablingConditions"  for="hasEnablingConditions" id="hasEnablingConditionsYes" :value="true"  v-model="document.hasEnablingConditions" label="Yes"/>
                                        <km-form-check-item inline type="radio" name="hasEnablingConditions"  for="hasEnablingConditions" id="hasEnablingConditionsNo"  :value="false" v-model="document.hasEnablingConditions" label="No"/>
                                    </km-form-check-group>
                                </km-form-group> 
                                <km-form-group v-if="document.hasEnablingConditions==true">
                                    <div class="card">
                                        <div class="card-body">                                                
                                            <km-form-group >
                                                <label class="form-label" for="relatedOtherProcesses">Enabling conditions </label>
                                                <km-select
                                                    v-model="document.enablingConditions"
                                                    class="validationClass"
                                                    label="name"
                                                    track-by="identifier"
                                                    value-key="identifier"
                                                    placeholder="Enabling conditions"
                                                    :options="gbfTargetConsideration"
                                                    :multiple="true"
                                                    :close-on-select="false"
                                                >
                                                </km-select>
                                                <small id="emailHelp" class="form-text text-muted">Please check all relevant enabling conditions.</small>
                                            </km-form-group>
                                            <km-form-group>
                                                <label class="form-label" for="enablingConditionsInfo">Please provide any information if available</label>
                                                <km-input-rich-lstring v-model="document.enablingConditionsInfo" :locales="document.header.languages"></km-input-rich-lstring>
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
                                    >
                                    </km-select>
                                    <small id="emailHelp" class="form-text text-muted">
                                        <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[0].identifier}">High = covers all elements of the global target; </span>
                                        <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[1].identifier}">Medium = covers most elements of the global target; </span>
                                        <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[2].identifier}">Low = covers at least one element of the global target</span>
                                    </small>
                                </km-form-group>
                                <km-form-group>
                                    <label class="form-label" for="enablingConditionsInfo">Explanation, including which aspects of the goal or target are covered</label>
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
                                        :multiple="false"
                                        :disabled="false"
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
                                        :multiple="false"
                                        :disabled="false"
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
                                        :multiple="false"
                                        :disabled="false"
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
                                <km-form-group 
                                v-if="document.additionalImplementation.identifier=='additionalImplementationRequired' || document.additionalImplementation.identifier=='otherImplementation'">
                                    <label class="form-label" for="additionalImplementationCustomValue"> 
                                        Please explain (Additional means of implementation are needed for the attainment of this national target)
                                    </label>
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
                                Elements of the global targets
                            </div>
                            <div class="card-body">
                                
                                <km-form-group>
                                    <label class="form-label" for="elementOfGlobalTargetsinfo">Elements of the global targets addressed by national targets</label>
                                    <km-input-rich-lstring v-model="document.elementOfGlobalTargetsinfo" :locales="document.header.languages"></km-input-rich-lstring>
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
                                    <km-input-rich-lstring v-model="document.referencePeriodInfo" :locales="document.header.languages"></km-input-rich-lstring>
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
                </CCardBody>
            </CCard>
        </form>
        <button @click="submitDocument()" class="btn btn-primary">Save</button>
      </CCardBody>
    </CCard>
  
</template>

<script setup>
  
    import { KmInputRichLstring, KmSelect, KmFormGroup,
        KmFormCheckGroup, KmFormCheckItem, KmInputLstring
    } from "~/components/controls";
    import { mapStores }            from 'pinia'
    import { THEASURUS, ROLES } from '~/constants';
    import { languages }            from '@/app-data/languages'
    import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
    import { useThesaurusStore }    from '@/stores/thesaurus';
    import { useCountriesStore }    from '@/stores/countries';
    import { useRealmConfStore }    from '@/stores/realmConf';

    const $auth = useAuth();
    const security = useSecurity();

    const thesaurusStore  = useThesaurusStore ();
    const countriesStore  = useCountriesStore ();
    const realmConfStore  = useRealmConfStore();

    const data = await Promise.all([
            thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS),
            thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_GOALS),
            thesaurusStore.loadDomainTerms(THEASURUS.GBF_HEADLINE_INDICATORS),
            thesaurusStore.loadDomainTerms(THEASURUS.GBF_COMPONENT_INDICATORS    ),
            thesaurusStore.loadDomainTerms(THEASURUS.GBF_COMPLEMENTARY_INDICATORS),
            thesaurusStore.loadDomainTerms(THEASURUS.GBF_TARGETS_CONSIDERATIONS  ),
            countriesStore.loadCountries()
        ]);

    const document = ref({
        header : {
            languages : ['en', 'ar', 'zh']
        },
        mainPolicyOfMeasureOrActionInfo : {
            zh : 'Chine'
        },
        government : {
            identifier : undefined
        },
        additionalImplementation : {}
    })
    const selectedGbfTargets = ref([]);

    const formatedLanguages     = computed(()=>Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}));
    const globalGoalsAndTargets = computed(()=>{
        const goalsAndTargets = [
            ...((thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_GOALS)||[]).sort((a,b)=>a.name.localeCompare(b.name))),
            ...((thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS)||[]).sort((a,b)=>a.name.localeCompare(b.name))), 
        ]
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
            return { name : e.name[useI18n().locale], code : e.code?.toLowerCase()}
        })

        return mapCountries;
    })
    const headlineIndicators      = computed(()=>{ return (thesaurusStore.getDomainTerms(THEASURUS.GBF_HEADLINE_INDICATORS)||[]).sort((a,b)=>a.name.localeCompare(b.name)) });
    const componentIndicators     = computed(()=>{ return (thesaurusStore.getDomainTerms(THEASURUS.GBF_COMPONENT_INDICATORS)||[]).sort((a,b)=>a.name.localeCompare(b.name)) });
    const complementaryIndicators = computed(()=>{ return (thesaurusStore.getDomainTerms(THEASURUS.GBF_COMPLEMENTARY_INDICATORS)||[]).sort((a,b)=>a.name.localeCompare(b.name)) });
    

    onMounted(() => {
        if($auth?.user?.isAuthenticated){
            console.log($auth.user)
            if(!$auth.user.government){
                const adminRoles = realmConfStore.getRole(ROLES.ADMINSTARATOR)
                if($security.isInRoles(adminRoles)){
                    isAdmin = true
                }
            }
            else{
                document.government.identifier = $auth.user.government
            }
        }
    }),

    async function submitDocument(){
        await navigateTo('/nbsap-targets')
    }
</script>

 <style>
    .form-group label{
        font-weight: 700;
    }    
</style>