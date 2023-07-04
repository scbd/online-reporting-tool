<template>
  <span>Test section</span>
  
  <!-- <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid" /> Section III : Status of the updated or revised
        national biodiversity strategies and action plans (NBSAPs) in the light
        of the post-2020 global biodiversity framework</slot
      >
    </CCardHeader>
    <CCardBody>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button @click="submitDocument()" class="btn btn-primary">Save</button>
        <NuxtLink to="/national-reports/nr7/edit">
          <CButton color="success ml-1">
            <font-awesome-icon icon="fa-solid fa-book-atlas" /> Go to Overview
          </CButton>
        </NuxtLink>
      </div>
      <form>
        <div class="alert alert-warning mt-2" role="alert">
          <h4 class="alert-heading">Help!</h4>
          Some help will be available here
        </div>

        <div class="form-group">
            <label for="exampleInputEmail1">Has your country updated or revised its NBSAP in the light of the post-2020 global biodiversity framework?</label>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="nbsabUpdated" :id="'nbsabUpdated1'"
                :value="'nbsabUpdated1'" v-model="document.nbsabUpdated">
              <label class="form-check-label" :for="'nbsabUpdated1'">Yes</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="nbsabUpdated" :id="'nbsabUpdated2'"
                :value="'nbsabUpdated2'" v-model="document.nbsabUpdated">
              <label class="form-check-label" :for="'nbsabUpdated2'">No</label>
            </div>

            <div class="form-check ">
              <input class="form-check-input" type="radio" name="nbsabUpdated" :id="'nbsabUpdated2'"
                :value="'nbsabUpdated3'" v-model="document.nbsabUpdated">
              <label class="form-check-label" :for="'nbsabUpdated2'">In process (please indicate the anticipated date of completion)</label>
            </div>
        </div>
        <div class="form-group" v-if="document.nbsabUpdated=='nbsabUpdated3'">
            <label for="exampleInputEmail1">please indicate the anticipated date of completion</label>
            <input type="text" class="form-control" id="targetTitle" placeholder="please indicate the anticipated date of completion">
        </div>


        <div class="form-group">
            <label for="exampleInputEmail1">If you answered above, has your country’s updated or revised NBSAP been adopted as a policy or legal instrument?</label>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="nbsabAdopted" :id="'nbsabAdopted1'"
                :value="'nbsabAdopted1'" v-model="document.nbsabAdopted">
              <label class="form-check-label" :for="'nbsabAdopted1'">Yes</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="nbsabAdopted" :id="'nbsabAdopted2'"
                :value="'nbsabAdopted2'" v-model="document.nbsabAdopted">
              <label class="form-check-label" :for="'nbsabAdopted2'">No</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="nbsabAdopted" :id="'nbsabAdopted3'"
                :value="'nbsabAdopted3'" v-model="document.nbsabAdopted">
              <label class="form-check-label" :for="'nbsabAdopted3'">In Process</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="nbsabAdopted" :id="'nbsabAdopted4'"
                :value="'nbsabAdopted4'" v-model="document.nbsabAdopted">
              <label class="form-check-label" :for="'nbsabAdopted4'">Other</label>
            </div>
        </div>
        <div class="form-group" v-if="document.nbsabAdopted=='nbsabAdopted2'">
            <label for="exampleInputEmail1">please indicate anticipated date of adoption.</label>
            <input type="text" class="form-control" id="targetTitle" placeholder="Please indicate anticipated date of adoption.">
        </div>

        <div class="form-group" v-if="document.nbsabAdopted=='nbsabAdopted4'">
            <label for="exampleInputEmail1">please provide other information</label>
            <input type="text" class="form-control" id="targetTitle" placeholder="Please provide other information">
        </div>

        <div class="form-group">
            <label for="exampleInputEmail1">If you answered “yes” above, please indicate the type of policy instrument your country’s updated NBSAP has been adopted as.</label>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="policyInstrument" :id="'policyInstrument1'"
                :value="'policyInstrument1'" v-model="document.policyInstrument">
              <label class="form-check-label" :for="'policyInstrument1'">Adopted through legislation or otherwise by parliament</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="policyInstrument" :id="'policyInstrument2'"
                :value="'policyInstrument2'" v-model="document.policyInstrument">
              <label class="form-check-label" :for="'policyInstrument2'">Adopted by Council of Ministers, Office of the President/Prime Minister or equivalent whole-of-government body.</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="policyInstrument" :id="'policyInstrument3'"
                :value="'policyInstrument3'" v-model="document.policyInstrument">
              <label class="form-check-label" :for="'policyInstrument3'">Adopted by Ministry of Environment or other sectoral ministry</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="policyInstrument" :id="'policyInstrument4'"
                :value="'policyInstrument4'" v-model="document.policyInstrument">
              <label class="form-check-label" :for="'policyInstrument4'">Integrated into the poverty reduction strategy, sustainable development strategy, national development plan, and other related strategies or plans</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="policyInstrument" :id="'policyInstrument5'"
                :value="'policyInstrument5'" v-model="document.policyInstrument">
              <label class="form-check-label" :for="'policyInstrument5'">Other</label>
            </div>
        </div>

        <div class="form-group" v-if="document.policyInstrument=='policyInstrument5'">
            <label for="exampleInputEmail1">please provide other information</label>
            <input type="text" class="form-control" id="targetTitle" placeholder="Please provide other information">
        </div>

        <div class="form-group">
            <label for="exampleInputEmail1">Please indicate the status of implementation of your NBSAP (please indicate an estimate of percentage of NBSAP activities implemented).</label>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="implementationStatus" :id="'implementationStatus1'"
                :value="'implementationStatus1'" v-model="document.implementationStatus">
              <label class="form-check-label" :for="'implementationStatus1'">NBSAP on track to be fully implemented within its timeframe (80-100%)</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="implementationStatus" :id="'implementationStatus2'"
                :value="'implementationStatus2'" v-model="document.implementationStatus">
              <label class="form-check-label" :for="'implementationStatus2'">Implementation has progressed significantly (60-80%)</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="implementationStatus" :id="'implementationStatus3'"
                :value="'implementationStatus3'" v-model="document.implementationStatus">
              <label class="form-check-label" :for="'implementationStatus3'">Implementation is well underway (20-60%)</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="implementationStatus" :id="'implementationStatus4'"
                :value="'implementationStatus4'" v-model="document.implementationStatus">
              <label class="form-check-label" :for="'implementationStatus4'">Implementation has started recently (1-20%)</label>
            </div>
            <div class="form-check ">
              <input class="form-check-input" type="radio" name="implementationStatus" :id="'implementationStatus5'"
                :value="'implementationStatus5'" v-model="document.implementationStatus">
              <label class="form-check-label" :for="'policyInstrument5'">Implementation has not yet started (0%)</label>
            </div>
        </div>


        <div class="form-group">
              <label>Any other websites, web links and files</label></br>
              <button @click="submitDocument()" class="btn btn-secondary"><font-awesome-icon icon="fa-globe" /> Add Links</button>
              <button @click="submitDocument()" class="btn btn-secondary"><font-awesome-icon icon="fa-file" /> Add Files</button>
            </div>
            <div class="form-group">
              <label>Any other information</label>
              <ckeditor></ckeditor>
            </div>
      </form>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button @click="submitDocument()" class="btn btn-primary">Save</button>
        <button @click="submitDocument()" class="btn btn-primary">Cancel</button>
      </div>
    </CCardBody>
  </CCard> -->
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  components:{
    Ckeditor
  },
  setup() {
    
  },
})
</script>
<!-- <script>
export default {
  components: {
    Ckeditor,
  },
  name: 'Nr7Section3',
  meta:{
    schema:'nationalReport7'
  },
  props: {},
  methods: {},
  data() {
    return {
      document: {},
    }
  },
}
</script> -->
