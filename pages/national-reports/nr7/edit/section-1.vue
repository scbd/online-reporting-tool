<template>
  <span>Test section</span>
  <!-- <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid" /> Section I : Executive summary of the report
      </slot>
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
          Please provide an executive summary of the report by highlighting its key findings, including the main outcomes
          of implementation and key challenges encountered.
        </div>
        <div class="form-group">
          <label>
            Summary of progress towards the post-2020 global biodiversity framework, including the 2050 goals and 2030
            action targets
          </label>
          <small id="emailHelp" class="form-text text-muted">some help related to this field</small>
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label>
            Summary of the current status and trends of biodiversity in your country in particular main drivers of
            biodiversity decline or loss and changes or trends observed in the status and trends of biodiversity as a
            result of actions taken or progress made
          </label>
          <small id="emailHelp" class="form-text text-muted">some help related to this field</small>
          <ckeditor></ckeditor>
        </div>

        <div class="form-group">
          <label>
            Key challenges encountered in implementation and steps to be taken to enhance implementation of the post-2020
            GBF and NBSAP
          </label>
          <small id="emailHelp" class="form-text text-muted">some help related to this field</small>
          <ckeditor></ckeditor>
        </div>


        <div class="form-group">
          <label>Any other websites, web links and files</label></br>
          <button @click="submitDocument()" class="btn btn-secondary"><font-awesome-icon icon="fa-globe" /> Add
            Links</button>
          <button @click="submitDocument()" class="btn btn-secondary"><font-awesome-icon icon="fa-file" /> Add
            Files</button>
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
import Ckeditor from "@/components/controls/kmCkEditor";

export default defineComponent({
  components:{
    Ckeditor
  },
  setup() {
    
  },
})
</script>
<!-- <script>
import Ckeditor from '@/components/controls/kmCkEditor'
export default {
  components: {
    Ckeditor,
  },
  name: 'Nr7Section1',
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
