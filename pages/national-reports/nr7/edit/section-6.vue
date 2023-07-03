<template>
  <span>Test section</span>
  
  <!-- <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid" /> Section VI : Conclusions on the implementation
        of the Convention and the post-2020 global biodiversity framework
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
          In this section, countries are encouraged to provide an in-depth
          summary of the implementation of the Convention and the post-2020
          global biodiversity framework including main outcomes achieved and
          major challenges encountered in particular the capacity, technical,
          technological, institutional and financial gaps and constraints and of
          support provided for the implementation. Countries could refer to
          cross-cutting challenges affecting the implementation of the
          Convention and the post-2020 GBF, or specific obstacles that have
          hindered progress. These challenges may include lack of adequate
          financial, human and technical resources, difficulties regarding
          inter-ministerial/interagency cooperation and coordination, lack of
          timely and reliable access to knowledge, information and data, lack of
          scientific expertise to support project development and management,
          and lack of access to relevant technologies for implementation.
          Countries should try to avoid duplications if relevant information is
          covered in the above sections.
        </div>
        <div class="form-group">
          <label
            >Please provide a summary of the implementation of the Convention
            and the post-2020 global biodiversity framework including main
            outcomes achieved and major challenges encountered in particular the
            capacity, technical, technological, institutional and financial gaps
            and constraints and of support provided for the
            implementation.</label
          >
          <small id="emailHelp" class="form-text text-muted"
            >some help related to this field</small
          >
          <ckeditor></ckeditor>
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
  name: 'Nr7Section6',
  meta:{
    schema:'nationalReport7'
  },
  props: {},
  methods: {},
}
</script> -->
