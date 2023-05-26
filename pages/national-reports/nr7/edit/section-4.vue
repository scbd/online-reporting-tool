<template>
  <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid" /> Section IV : Assessment of progress towards the 2050 goals of the post-2020 global
        biodiversity framework
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
          Please provide below an assessment of progress towards the achievement of the 2050 goals of the post-2020
          global biodiversity framework, using relevant headline and other indicators.
        </div>

        <div class="card" v-for="goal in goals" v-bind:key="goal.title">
          <div class="card-header">
            <strong>{{goal.title}}</strong>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label for="sdf">Summary of progress made in achieving the Goal</label>
              <ckeditor></ckeditor>
            </div>
            <div class="form-group">
              <label for="sdf">Relevant national target(s) contributing to this goal</label>
              <ckeditor></ckeditor>
            </div>
            <div class="form-group">
              <label for="exampleInputEmail1">Headline indicators</label>
              <div class="form-check ">
                <input class="form-check-input" type="radio" name="headlineIndicators" :id="'headlineIndicators1'"
                  :value="'headlineIndicators1'" v-model="document.headlineIndicators">
                <label class="form-check-label" :for="'headlineIndicators1'">Use national data set </label>
              </div>
              <div class="form-check ">
                <input class="form-check-input" type="radio" name="headlineIndicators" :id="'headlineIndicators2'"
                  :value="'headlineIndicators2'" v-model="document.headlineIndicators">
                <label class="form-check-label" :for="'headlineIndicators2'">Use the available data (pre-populated
                  data);</label>
              </div>
              <div class="form-check ">
                <input class="form-check-input" type="radio" name="headlineIndicators" :id="'headlineIndicators3'"
                  :value="'headlineIndicators3'" v-model="document.headlineIndicators">
                <label class="form-check-label" :for="'headlineIndicators3'">No data available</label>
              </div>
              <div class="form-check ">
                <input class="form-check-input" type="radio" name="headlineIndicators" :id="'headlineIndicators4'"
                  :value="'headlineIndicators4'" v-model="document.headlineIndicators">
                <label class="form-check-label" :for="'headlineIndicators4'">Not relevant</label>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
              <label for="sdf">Other relevant national indicators</label>
            <ckeditor></ckeditor>
          </div>

          <div class="form-group">
            <label for="sdf">Source of data for indicator(s) where needed</label>
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
  name: 'Nr7Section4',
  props: {},
  data() {
    return {
      document: {},
      goals: [
        {
          title: 'Goal A'
        },
        {
          title: 'Goal B'
        },
        {
          title: 'Goal C'
        },
        {
          title: 'Goal D'
        }
      ]
    }
  },
  methods: {},
}
</script>
