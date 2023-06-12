<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> Annex : Information as requested in related decisions adopted by the Conference of the Parties at its fifteenth meeting</slot>
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
        <!-- <form> -->
            <div class="alert alert-warning mt-2" role="alert">
              <h4 class="alert-heading">Help!</h4>
              It is suggested that in this annex, Parties focus on the implementation of the following decisions  of COP 15 adopted as part of the post-2020 global biodiversity framework:
                <ul>                  
                  <li>Strategy for capacity building/development;</li>
                  <li>Long-term approach to mainstreaming biodiversity;</li>
                  <li>Gender plan of action;</li>
                  <li>Strategy for resource mobilization.</li>
                </ul>
            </div>
            <div class="form-group">
              <label>Some label for this field</label>
              <small id="emailHelp" class="form-text text-muted">some help related to this field</small>
              <ckeditor></ckeditor>
            </div>

            <div class="form-group">
              <label>Any other websites, web links and files</label></br>
              <button @click="submitDocument()" class="btn btn-secondary"><font-awesome-icon icon="fa-globe" /> Add Links</button>
              <button @click="submitDocument()" class="btn btn-secondary"><font-awesome-icon icon="fa-file" /> Add Files</button>
            </div>
            <div class="form-group">
              
              <div class="form-group">
                <label>Any other information</label>
                <ckeditor></ckeditor>
                
                <button @click="AddAdditionalBlocks()" class="btn btn-primary">Add Other information block</button><br></br>
                <div v-for="(additional, index) in additionalBlocks" :key="index">
                  <ckeditor v-model="additional.additionalInfo"></ckeditor>
                </div>

                <!-- <button @click="AddAdditionalBlocks()" class="btn btn-primary">Add Other information block</button> -->
              </div>
            </div>

        <!-- </form> -->
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <button @click="submitDocument()" class="btn btn-primary">Save</button>
          <!-- <button @click="submitDocument()" class="btn btn-primary">Cancel</button> -->
        </div>
      </CCardBody>
    </CCard>
  </template>
  
  <script>
import Ckeditor from "@/components/controls/ck-editor";
export default {
    components: {
      Ckeditor
    },
    name: 'Nr7Section7',
    meta:{
      schema:'nationalReport7'
    },
    props: {
      
    },
    methods: {
      AddAdditionalBlocks(){
        this.additionalBlocks.push(
          { additionalInfo : ''}
        )
      }
    },
    data(){
      return {
        additionalBlocks : []
      }
    }
}
</script>
  