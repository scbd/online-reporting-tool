<template>
  <CCard>
    <CCardHeader>
      <slot name="header"> NBSAP Target </slot>
    </CCardHeader>
    <CCardBody>
      <form>
        <div class="card">
          <div class="card-body">
            <!-- <legend>Section 1</legend>
          <hr></hr> -->
            <div class="form-group">
              <label for="exampleFormControlSelect1">Global Target</label>
              <select class="form-control" id="exampleFormControlSelect1">
                <option>Global Target 1</option>
                <option>Global Target 2</option>
                <option>Global Target 3</option>
                <option>Global Target 4</option>
                <option>Global Target 5</option>
              </select>
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">National target title</label>
              <input type="text" class="form-control" id="targetTitle" placeholder="Enter national target title">
              <!-- <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small> -->
            </div>
            <div class="form-group">
              <div class="card">
                <div class="card-header bg-secondary">
                  For Developing countries
                </div>
                <div class="card-body">
                  Are there elements of this target that are conditional (dependent on the provision of means of
                  implementation) versus unconditional (to be implemented with national resources)?
                  <ckeditor></ckeditor>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Please explain briefly how this target aligns with and will contribute to
                the attainment of the global target(s):</label>
              <ckeditor></ckeditor>
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">Headline indicators, and, if applicable, component, complementary and
                other national indicators) by which this national target will be monitored. </label>
              <ckeditor></ckeditor>
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">Baseline against which progress will be measured</label>
              <ckeditor></ckeditor>
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">Please summarize the main policy measures or actions that will be taken in
                order to achieve this (optional) </label>
              <ckeditor></ckeditor>
            </div>
            <div class="form-group">
              <label for="exampleFormControlSelect1">Other global targets to which this national target also
                contributes. Please check one or more from the drop-down menu </label>
              <select class="form-control" id="exampleFormControlSelect1">
                <option>Global Target 1</option>
                <option>Global Target 2</option>
                <option>Global Target 3</option>
                <option>Global Target 4</option>
                <option>Global Target 5</option>
              </select>
            </div>

            <div class="form-group">
              <label for="exampleInputEmail1">Please indicate whether any other national targets also contribute to this
                global target, please provide texts of related national targets here: </label>
              <ckeditor></ckeditor>
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

        <!-- <div class="form-group">
          <label for="sdf"></label>
          <ckeditor></ckeditor>
        </div>
        <div class="form-group">
          <label for="223"></label>
        </div>

        <div class="form-group">
              <label for="sdf"></label>
              <ckeditor></ckeditor>
            </div>
        <div class="form-check">
          <input type="checkbox" class="form-check-input" id="exampleCheck1">
          <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div> -->
      </form>
        <button @click="submitDocument()" class="btn btn-primary">Submit</button>
    </CCardBody>
  </CCard>

</template>

<script>

import Ckeditor from "@/components/controls/ck-editor";
export default {
  components: {
    Ckeditor
  },
  name: 'TargetNew',
  data(){
    return {
      document : {}
    }
  },
  methods :{
    submitDocument (){
      this.$router.push('/nbsaps-targets')
    }
  }
}
</script>
