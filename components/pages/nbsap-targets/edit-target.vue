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
                                    :disabled="!isAdmin"
                                    @input="$emit('change', $event)">
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
                                    @input="$emit('change', $event)"
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
                                    @input="$emit('change', $event)"
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
                                                @input="$emit('change', $event)"
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
                                    @input="$emit('change', $event)"
                                >
                                </km-select>
                                <small id="emailHelp" class="form-text text-muted">High = covers all elements of the global target; Medium = covers most elements of the global target; Low = covers at least one element of the global target</small>
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
                                    @input="$emit('change', $event)"
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
                                    @input="$emit('change', $event)"
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
                                    @input="$emit('change', $event)"
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
                            
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Means of implementation and barriers to implementation
                        </div>
                        <div class="card-body">
                            
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Elements of the global targets
                        </div>
                        <div class="card-body">
                            
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <div class="form-group">
                <label for="exampleInputEmail1">Does the national target meet the global target?</label>                            
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck1">
                    <label class="form-check-label" for="exampleCheck1">My country’s national target exceeds the ambition of this global target</label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck2">
                    <label class="form-check-label" for="exampleCheck2">My country can provide implementation support to other Parties for this global target</label>
                  </div>
                  <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck3">
                    <label class="form-check-label" for="exampleCheck3">My country requires international support to achieve this global target nationally. </label>
                  </div>          
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
                <div class="form-group">
                  <label for="223">Is this target (or a part thereof) directly related to a national target or other national commitment already made by your national government in the context of another process?</label>
                  </br>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="isRelatedToOtherProcess1" value="true" v-model="document.isRelatedToOtherProcess">
                    <label class="form-check-label" for="isRelatedToOtherProcess1">Yes</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="isRelatedToOtherProcess2" value="false" v-model="document.isRelatedToOtherProcess">
                    <label class="form-check-label" for="isRelatedToOtherProcess2">No</label>
                  </div>
                </div>
                <div class="form-group" v-if="document.isRelatedToOtherProcess=='true'">
                  <label for="relatedOtherProcesses">Names of other processes including other environmental conventions (MEAs),  </label>
                  <select class="form-control" id="relatedOtherProcesses" v-model="document.relatedOtherProcesses">                  
                    <option>The Rio conventions </option>
                    <option>The SDGs</option>
                    <option>Nationally Determined Contribution under the Paris Agreement </option>
                    <option>One or more Land Degradation Neutrality targets </option>
                    <option>One or more national ecosystem restoration targets </option>
                    <option>The Leaders’ Pledge for Nature </option>
                    <option>The Action Agenda for Nature and People </option>
                    <option>Regions/Cities with Nature Commitment Platforms </option>
                    <option>Other</option>
                  </select>
              </div>
              <div class="form-group" v-if="document.isRelatedToOtherProcess=='true' && document.relatedOtherProcesses=='Other'">
                <label for="exampleInputEmail1">Specify the other process</label>
                <input type="text" class="form-control" id="targetTitle" placeholder="Enter the other process">
              </div>
              <div class="form-group" >
                <label for="exampleInputEmail1">Name(s)/Number(s)/Ref.(s) of existing commitment(s):</label>
                <input type="text" class="form-control" id="targetTitle" placeholder="Name(s)/Number(s)/Ref.(s) of existing commitment(s)">
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-body">
                <div class="form-group">
                  <label for="223">Is this national target also contributing to an international commitment relevant at the transboundary/region level?</label>
                  <div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="hasInternationalCommitment1" id="hasInternationalCommitment1" value="true" v-model="document.hasInternationalCommitment">
                    <label class="form-check-label" for="hasInternationalCommitment1">Yes</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="hasInternationalCommitment1" id="hasInternationalCommitment2" value="false" v-model="document.hasInternationalCommitment">
                    <label class="form-check-label" for="hasInternationalCommitment2">No</label>
                  </div></div>
                </div>
              <div class="form-group" v-if="document.hasInternationalCommitment=='true'">
                <label for="exampleInputEmail1">Indicate which commitment that is</label>
                <input type="text" class="form-control" id="targetTitle" placeholder="Indicate which commitment that is">
              </div>
            </div>
          </div>
         
          <div class="card">
            <div class="card-body">
                <div class="form-group">
                  <label for="223">Are there any overlaps or links with targets or commitments submitted separately by subnational governments, or other actors beyond national governments?</label>
                  <br/>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="hasOverlaps" id="hasOverlaps1" value="true" v-model="document.hasOverlaps">
                    <label class="form-check-label" for="hasOverlaps1">Yes</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="hasOverlaps" id="hasOverlaps2" value="false" v-model="document.hasOverlaps">
                    <label class="form-check-label" for="hasOverlaps2">No</label>
                  </div>
                </div>
                <div class="form-group" v-if="document.hasOverlaps=='true'">
                  <label for="exampleInputEmail1">Full text of /target commitment submitted by other actor(s) (if different to national biodiversity target):</label>
                  <!-- <ckeditor></ckeditor> -->
                </div>
                <div class="form-group" v-if="document.hasOverlaps=='true'">
                  <label for="exampleInputEmail1">Actor(s) which submitted it</label>
                  <input type="text" class="form-control" id="targetTitle">
                </div>
                <div class="form-group" v-if="document.hasOverlaps=='true'">
                  <label for="exampleInputEmail1">Context in which it has been submitted:</label>
                  <input type="text" class="form-control" id="targetTitle">
                </div>
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">National Biodiversity Targets - beyond GBF alignment</h5>
              <div class="form-group">
                <label for="sdf">Please indicate any national biodiversity target which is not already reflected in the table above</label>
                <!-- <ckeditor></ckeditor> -->
              </div>
              <div class="form-group">
                <label for="sdf">Please indicate which indicators will be used to measure progress towards its achievement.</label>
                <!-- <ckeditor></ckeditor> -->
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              Targets and actions for achieving enabling conditions and other non-target elements of the GBF
            </div>
            <div class="card-body">
                <div class="form-group">
                  <label for="sdf">Please indicate the targets and/or actions that your country is taking to put in place the enabling conditions and/or other cross-cutting elements not in the targets of the GBF (Human rights based approach, respect for human rights, IPLC rights, gender equality, intergenerational equity, etc. Please also include here any national targets/actions directly related to the post 2020 Gender Plan of Action)</label>
                  <!-- <ckeditor></ckeditor> -->
                </div>
                <div class="form-group">
                  <label for="sdf">Please indicate which non-target element of the GBF or of the post 2020 Gender Plan of Action this national target or action aims to fulfil. </label>
                  <!-- <ckeditor></ckeditor> -->
                </div>
                <div class="form-group">
                  <label for="sdf">Please indicate which indicators will be used to measure progress towards the achievement or implementation of these targets/actions.</label>
                  <!-- <ckeditor></ckeditor> -->
                </div>
            </div>
          </div>
  
         
        </form>
          <button @click="submitDocument()" class="btn btn-primary">Submit</button>
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
            }
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