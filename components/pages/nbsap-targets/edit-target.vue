<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> NBSAP Target New</slot>
      </CCardHeader>
      <CCardBody>
        <form>
          <div class="card">
            <div class="card-body">
              {{ document }}
                <!-- <div class="form-group">
                    <div class="card">
                    <div class="card-header bg-secondary">
                        
                    </div>
                    <div class="card-body">
                        
                    </div>
                    </div>
                </div> -->
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            General
                        </div>
                        <div class="card-body"> 
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Government</label>
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
                            </div>   

                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Please select in which language(s) you wish to submit this record</label>
                                <km-select
                                    v-model="document.header.languages"
                                    class="validationClass"
                                    label="title"
                                    track-by="code"
                                    value-key="code"
                                    placeholder="Language of record"
                                    :options="options.languages"
                                    :multiple="true"
                                >
                                </km-select>
                            </div>                           
                            <div class="form-group">
                                <label for="exampleInputEmail1">Full name/title of national target</label>
                                <input type="text" class="form-control" v-model="document.title" id="targetTitle" placeholder="Enter national target title">                                
                            </div>                            

                            <div class="form-group">
                                <label for="enablingConditionsInfo">Please outline the main policy measures or actions that will be taken to achieve this national target. </label>
                                <KmRichLstring v-model="document.mainPolicyOfMeasureOrActionInfo" :locales="document.header.languages"></KmRichLstring>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Alignment
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Alignment with global goals and targets</label>
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
                            </div>
                            <div class="form-group">
                                <!-- <div class="form-check"> -->
                                    <!-- <input type="checkbox" class="form-check-input" id="hasEnablingConditions" :value="true" v-model="document.hasEnablingConditions"> -->
                                    <label class="form-check-label" for="hasEnablingConditions">Enabling conditions and/or other non-target elements of the KunmingMontreal Global Biodiversity Framework</label>
                                    <br/>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="hasEnablingConditions" :value="true" v-model="document.hasEnablingConditions">
                                        <label class="form-check-label" for="hasEnablingConditions">Yes</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="inlineRadioOptions" id="hasEnablingConditions" :value="false" v-model="document.hasEnablingConditions">
                                        <label class="form-check-label" for="hasEnablingConditions">No</label>
                                    </div>
                                <!-- </div>   -->
                            </div> 
                            <div class="form-group" v-if="document.hasEnablingConditions">
                                <div class="card">
                                    <div class="card-body">                                                
                                        <div class="form-group" >
                                            <label for="relatedOtherProcesses">Enabling conditions </label>
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
                                                <template slot="clear">
                                                    <div v-if="document.enablingConditions && document.enablingConditions.length"
                                                        class="km-select__clear" @mousedown.prevent.stop="document.enablingConditions = undefined; $emit('change', null)" ></div>
                                                </template>
                                            </km-select>
                                            <small id="emailHelp" class="form-text text-muted">Please check all relevant enabling conditions.</small>
                                        </div>
                                        <div class="form-group">
                                            <label for="enablingConditionsInfo">Please provide any information if available</label>
                                            <KmRichLstring v-model="document.enablingConditionsInfo" :locales="document.header.languages"></KmRichLstring>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Degree of alignment</label>
                                <km-select
                                    v-model="document.degreeOfAlignment"
                                    class="validationClass"
                                    label="title"
                                    track-by="identifier"
                                    value-key="identifier"
                                    placeholder="Degree of alignment"
                                    :options="degreeOfAlignments"
                                    :multiple="false"
                                    :disabled="false"
                                >
                                </km-select>
                                <small id="emailHelp" class="form-text text-muted">
                                    <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[0].identifier}">High = covers all elements of the global target; </span>
                                    <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[1].identifier}">Medium = covers most elements of the global target; </span>
                                    <span :class="{'text-success font-weight-bold': document.degreeOfAlignment==degreeOfAlignments[2].identifier}">Low = covers at least one element of the global target</span>
                                </small>
                            </div>
                            <div class="form-group">
                                <label for="enablingConditionsInfo">Explanation, including which aspects of the goal or target are covered</label>
                                <KmRichLstring v-model="document.degreeOfAlignmentInfo" :locales="document.header.languages"></KmRichLstring>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Indicators to be used to monitor this national target
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Headline indicators</label>
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
                            </div>
                            <div class="form-group">
                                <label for="componentIndicators">Component indicators</label>
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
                            </div>
                            <div class="form-group">
                                <label for="complementaryIndicators">Complementary indicators</label>
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
                            </div>
                            <div class="form-group">
                                <label for="otherNationalIndicators">Other national indicators</label>
                                
                                <small id="emailHelp" class="form-text text-muted">Add your own indicators</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Non-State actor commitments
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label for="nonStateActorCommitmentInfo">List the non-state commitments towards this national Target</label>
                                <KmRichLstring v-model="document.nonStateActorCommitmentInfo" :locales="document.header.languages"></KmRichLstring>
                            </div>
                            <div class="form-group">
                                <label class="form-check-label" for="hasNonStateActors">
                                    Are there any overlaps or links between this national target and targets or commitments submitted as non-State actor commitments to the Kunming-Montreal Global Biodiversity Framework?</label>
                                <br/>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="hasNonStateActors" 
                                    :value="true" v-model="document.hasNonStateActors">
                                    <label class="form-check-label" for="hasNonStateActors">Yes</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="hasNonStateActors" 
                                    :value="false" v-model="document.hasNonStateActors">
                                    <label class="form-check-label" for="hasNonStateActors">No</label>
                                </div>
                            </div> 
                            <div class="form-group" v-if="document.hasNonStateActors">
                                <label for="nonStateActorsInfo"> please indicate which commitment(s) and which actor(s)</label>
                                <KmRichLstring v-model="document.nonStateActorsInfo" :locales="document.header.languages"></KmRichLstring>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Means of implementation and barriers to implementation
                        </div>
                        <div class="card-body">
                            <div class="form-group">
                                <label class="form-check-label" for="additionalImplementation">
                                   Please indicate if additional means of implementation are needed for the attainment of this national target.</label>
                                <br/>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="additionalImplementation" id="additionalImplementation" 
                                    value="additionalImplementationRequired" v-model="document.additionalImplementation.identifier">
                                    <label class="form-check-label" for="additionalImplementation">
                                        Additional means of implementation are needed for the attainment of this national target</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="additionalImplementation" id="additionalImplementation" 
                                    value="additionalImplementationAvailable" v-model="document.additionalImplementation.identifier">
                                    <label class="form-check-label" for="additionalImplementation">Means of implementation availabl</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="additionalImplementation" id="additionalImplementation" 
                                    value="otherImplementation" v-model="document.additionalImplementation.identifier">
                                    <label class="form-check-label" for="additionalImplementation">Other</label>
                                </div>
                            </div> 
                            <div class="form-group" 
                            v-if="document.additionalImplementation.identifier=='additionalImplementationRequired' || document.additionalImplementation.identifier=='otherImplementation'">
                                <label for="additionalImplementationCustomValue"> Please explain</label>
                                <KmRichLstring v-model="document.additionalImplementation.customValue" :locales="document.header.languages"></KmRichLstring>
                            </div>
                            <div class="form-group">
                                <label for="additionalImplementationInfo">Additional explanation</label>
                                <KmRichLstring v-model="document.additionalImplementationInfo" :locales="document.header.languages"></KmRichLstring>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Elements of the global targets
                        </div>
                        <div class="card-body">
                            
                            <div class="form-group">
                                <label for="elementOfGlobalTargetsinfo">Elements of the global targets addressed by national targets</label>
                                <KmRichLstring v-model="document.elementOfGlobalTargetsinfo" :locales="document.header.languages"></KmRichLstring>
                            </div>
                            <div class="form-group">
                                <label class="form-check-label" for="hasReferncePeriod">Is there a reference period and national target which relates to the headline indicator?</label>
                                <br/>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="hasReferncePeriod" :value="true" v-model="document.hasReferncePeriod">
                                    <label class="form-check-label" for="hasReferncePeriod">Yes</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="hasReferncePeriod" :value="false" v-model="document.hasReferncePeriod">
                                    <label class="form-check-label" for="hasReferncePeriod">No</label>
                                </div>
                            </div> 

                            <div class="form-group" v-if="document.hasReferncePeriod">
                                <label for="referencePeriodInfo">Please explain</label>
                                <KmRichLstring v-model="document.referencePeriodInfo" :locales="document.header.languages"></KmRichLstring>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>          
        </form>
        <button @click="submitDocument()" class="btn btn-primary">Save</button>
      </CCardBody>
    </CCard>
  
  </template>
  
  <script>
  
import { KmRichLstring, KmSelect } from "~/components/controls";
import { mapStores }            from 'pinia'
import Ckeditor from "@/components/controls/ck-editor";
import { THEASURUS, ROLES } from '~/constants';
import { languages }            from '@/app-data/languages'
import { degreeOfAlignments }   from '@/app-data/degreeOfAlignments';
import { useThesaurusStore }    from '@/stores/thesaurus';
import { useCountriesStore }    from '@/stores/countries';
import { useRealmConfStore }    from '@/stores/realmConf';

export default {
    components: {
      Ckeditor,
      KmRichLstring,
      KmSelect
    },
    name: 'EditTarget',
    meta:{
      schema:'nbsapNationalTarget'
    },
    roles:[...ROLES.ALL_NATIONAL_USERS],
    async fetch(){
        await Promise.all([
            this.thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS),
            this.thesaurusStore.loadDomainTerms(THEASURUS.GBF_GLOBAL_GOALS),
            this.thesaurusStore.loadDomainTerms(THEASURUS.GBF_TARGETS_CONSIDERATIONS),
            this.countriesStore.loadCountries()
        ]);
    },
    fetchOnServer: false,
    data(){
      return {
        document : {
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
        },
        selectedGbfTargets : [],        
        // degreeOfAlignments:degreeOfAlignments,
        headlineIndicators:[],
        componentIndicators:[],
        complementaryIndicators:[],
        options : {
            languages :  Object.entries(languages).map(e=>{ return { code : e[0], title : e[1]}}) 
        },
        isAdmin : false
      }
    },
    computed:{
        globalGoalsAndTargets(){
            const goalsAndTargets = [
                ...((this.thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_GOALS)||[]).sort((a,b)=>a.name.localeCompare(b.name))),
                ...((this.thesaurusStore.getDomainTerms(THEASURUS.GBF_GLOBAL_TARGETS)||[]).sort((a,b)=>a.name.localeCompare(b.name))), 
            ]
            return goalsAndTargets;
        },
        gbfTargetConsideration(){
            return (this.thesaurusStore.getDomainTerms(THEASURUS.GBF_TARGETS_CONSIDERATIONS)||[]).sort((a,b)=>a.name.localeCompare(b.name))
        },
        degreeOfAlignments(){
            return degreeOfAlignments
        },
        countryList(){
            if(!this.countriesStore?.countries?.length)
                return [];

            const mapCountries = this.countriesStore.countries.map(e=>{
                return { name : e.name[this.$i18n.locale], code : e.code?.toLowerCase()}
            })

            return mapCountries;
        },
        ...mapStores(useThesaurusStore, useCountriesStore, useRealmConfStore)
    },
    methods :{
        submitDocument (){
            this.$router.push('/nbsap-targets')
        },
        
    },
    async mounted(){

        if(this.$auth?.user?.isAuthenticated){
            console.log(this.$auth.user)
            if(!this.$auth.user.government){
                const adminRoles = this.realmConfStore.getRole(ROLES.ADMINSTARATOR)
                if(this.$security.isInRoles(adminRoles)){
                    this.isAdmin = true
                }
            }
            else{
                this.document.government.identifier = this.$auth.user.government
            }
        }

        //redirect forbidden
    },
  }
</script>
 <style>
    .form-group label{
        font-weight: 700;
    }    
</style>