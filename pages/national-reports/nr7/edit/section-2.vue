<template>
  <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid" /> Section II : Brief overview of the process of
        preparation of the report</slot
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
          Some help will appear here          
        </div>
        
        <div class="form-group">
              <label for="exampleInputEmail1">Please briefly describe the process undertaken for the preparation of this report (responses may include the following)</label>
              <div class="form-check ">
                <input class="form-check-input" type="radio" name="headlineIndicators" :id="'headlineIndicators1'"
                  :value="'headlineIndicators1'" v-model="document.headlineIndicators">
                <label class="form-check-label" :for="'headlineIndicators1'">Coordination mechanisms and methodology for data collection and validation employed (if applicable) as well as key challenges encountered; </label>
              </div>
              <div class="form-check ">
                <input class="form-check-input" type="radio" name="headlineIndicators" :id="'headlineIndicators2'"
                  :value="'headlineIndicators2'" v-model="document.headlineIndicators">
                <label class="form-check-label" :for="'headlineIndicators2'">Consultations undertaken at various levels for preparing this report, by involving and engaging various stakeholders taking into account national circumstances.</label>
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
        <!-- <button @click="submitDocument()" class="btn btn-primary">Cancel</button> -->
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import Ckeditor from '@/components/controls/ck-editor'
export default {
  components: {
    Ckeditor,
  },
  name: 'Nr7Section2',
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
</script>
