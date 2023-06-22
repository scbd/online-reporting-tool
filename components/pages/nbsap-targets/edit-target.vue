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
                                <label for="exampleInputEmail1">Full name/title of national target</label>
                                <input type="text" class="form-control" v-model="document.title" id="targetTitle" placeholder="Enter national target title">                                
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Alignment with global goals and targets</label>
                                <multiselect
                                    v-model="selectedGbfTargets"
                                    class="validationClass"
                                    label="name"
                                    track-by="identifier"
                                    placeholder="Global Goals and Targets"
                                    :options="globalGoalsAndTargets"
                                    :multiple="true"
                                    :searchable="true"
                                    :clear-on-select="false"
                                    :close-on-select="false"
                                    :disabled="false"
                                    @input="$emit('change', $event)"
                                >
                                    <!-- <template slot="selection" slot-scope="{ values }">
                                        <span v-if="values && values.length > 1" class="multiselect__single">
                                            {{ values.length }} targets selected
                                        </span>
                                    </template> -->
                                    <template slot="clear">
                                        <div v-if="selectedGbfTargets && selectedGbfTargets.length"
                                            class="multiselect__clear" @mousedown.prevent.stop="selectedGbfTargets = undefined; $emit('change', null)" ></div>
                                    </template>
                                </multiselect>
                                <small id="emailHelp" class="form-text text-muted">Please check all relevant national targets and indicate their degree of alignment with the global targets.</small>
                            </div>
                            <div class="form-group">
                                <label for="exampleFormControlSelect1">Degree of alignment</label>
                                <multiselect
                                    v-model="document.degreeOfAlignment"
                                    class="validationClass"
                                    label="title"
                                    track-by="identifier"
                                    placeholder="Degree of alignment"
                                    :options="degreeOfAlignments"
                                    :multiple="false"
                                    :disabled="false"
                                    @input="$emit('change', $event)"
                                >
                                </multiselect>
                                <small id="emailHelp" class="form-text text-muted">High = covers all elements of the global target; Medium = covers most elements of the global target; Low = covers at least one element of the global target</small>
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
                            
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="card">
                        <div class="card-header bg-secondary">
                            Indicators to be used to monitor this national target
                        </div>
                        <div class="card-body">
                            
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
                  <ckeditor></ckeditor>
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
                <ckeditor></ckeditor>
              </div>
              <div class="form-group">
                <label for="sdf">Please indicate which indicators will be used to measure progress towards its achievement.</label>
                <ckeditor></ckeditor>
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
                  <ckeditor></ckeditor>
                </div>
                <div class="form-group">
                  <label for="sdf">Please indicate which non-target element of the GBF or of the post 2020 Gender Plan of Action this national target or action aims to fulfil. </label>
                  <ckeditor></ckeditor>
                </div>
                <div class="form-group">
                  <label for="sdf">Please indicate which indicators will be used to measure progress towards the achievement or implementation of these targets/actions.</label>
                  <ckeditor></ckeditor>
                </div>
            </div>
          </div>
  
         
        </form>
          <button @click="submitDocument()" class="btn btn-primary">Submit</button>
      </CCardBody>
    </CCard>
  
  </template>
  
  <script>
  
import Ckeditor from "@/components/controls/ck-editor";
import Multiselect from 'vue-multiselect';
import { degreeOfAlignments } from '~/app-data/degreeOfAlignments';
import { useThesaurusStore } from '~/stores/thesaurus';
import { GBF_GLOBAL_GOALS, GBF_GLOBAL_TARGETS, GBF_TARGETS_CONSIDERATIONS } from '~/constants';

  export default {
    components: {
      Ckeditor,
      Multiselect
    },
    name: 'EditTarget',
    meta:{
      schema:'nbsapNationalTarget'
    },
    roles:['publishingAuthority', 'nationalAuthorizedUser'],
    async fetch(){
        const thesaurusStore = useThesaurusStore(this.$pinia);
        //   console.log('calling actions')
        const response = await Promise.all([
            thesaurusStore.loadDomainTerms(GBF_GLOBAL_TARGETS),
            thesaurusStore.loadDomainTerms(GBF_GLOBAL_GOALS),
            thesaurusStore.loadDomainTerms(GBF_TARGETS_CONSIDERATIONS)
        ]);
        this.gbfTargets             = response[0]
        this.gbfGoals               = response[1]
        this.gbfTargetConsideration = response[2]
        // console.log('finished actions')
    },
    fetchOnServer: false,
    data(){
      return {
        document : {},
        selectedGbfTargets : [],
        gbfTargets : null,
        gbfGoals : null,
        gbfTargetConsideration : null,
        degreeOfAlignments:degreeOfAlignments
      }
    },
    computed:{
        globalGoalsAndTargets(){
            const goalsAndTargets = [...(this.gbfGoals||[]), ...(this.gbfTargets||[])]
            return goalsAndTargets;
        }
    },
    methods :{
      submitDocument (){
        this.$router.push('/nbsap-targets')
      }
    },
    async mounted(){

        const ex = useThesaurusStore(this.$pinia);
        this.gbfTargets             = this.gbfTargets             || ex.getDomainTerms(GBF_GLOBAL_TARGETS);
        this.gbfGoals               = this.gbfGoals               || ex.getDomainTerms(GBF_GLOBAL_GOALS)
        this.gbfTargetConsideration = this.gbfTargetConsideration || ex.getDomainTerms(GBF_TARGETS_CONSIDERATIONS)

    },
  }
  </script>
  