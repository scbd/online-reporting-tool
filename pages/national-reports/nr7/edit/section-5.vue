<template>
  <span>Test section</span>
  
  <!-- <CCard>
    <CCardHeader>
      <slot name="header">
        <CIcon name="cil-grid" /> Section V : Assessment of progress towards
        national targets and contributions to progress in the 2030 action
        targets</slot
      >
    </CCardHeader>
    <CCardBody>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <button @click="submitDocument()" class="btn btn-primary">Save</button> 
        <NuxtLink to="/nbsap-targets/new">
          <CButton color="success ml-1">
            <font-awesome-icon icon="fa-solid fa-plus" /> Add Global Target
          </CButton>
        </NuxtLink>
        <NuxtLink to="/national-reports/nr7/edit">
          <CButton color="success ml-1">
            <font-awesome-icon icon="fa-solid fa-book-atlas" /> Go to Overview
          </CButton>
        </NuxtLink>
      </div>
      <form>
        <div class="alert alert-warning mt-2" role="alert">
          <h4 class="alert-heading">Help!</h4>
          Please use the following template to report on progress in the
          implementation of national targets and updated NBSAPs in light of the
          post-2020 global biodiversity framework and based on that, to assess
          your national contributions to progress towards global targets of the
          post-2020 GBF. If needed, templates can be replicated for each
          national target. Headline indicators agreed in the monitoring
          framework and other indicators and forms of assessment can be used for
          assessing progress towards national targets and contributions to the
          achievement of the global targets.
        </div>
        <div class="form-group" style="display: none">
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
      </form>
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">National Target</th>
              <th scope="col">Submission Status</th>
              <th scope="col">Progress Level</th>
              <th scope="col">Updated On</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Part 1 - Coastal and marine areas.</td>
              <td>
                <CBadge color="success">Published</CBadge>
              </td>
              <td>On track to achieve target</td>
              <td>12 Oct 2022 9:22 PM</td>
              <td>
                <div class="d-grid">
                  <CButton color="secondary" size="sm">
                    <font-awesome-icon icon="fa-search" /> View Review
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    @click="onReviewTarget()"
                  >
                    <CIcon icon="cil-comment-square-edit"/> Edit Review
                  </CButton>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Part 2 - Coastal and marine areas.</td>
              <td>
                <CBadge color="success">Published</CBadge>
              </td>
              <td></td>
              <td>21 Oct 2022 9:22 PM</td>
              <td>
                <div class="d-grid">
                  <CButton color="secondary" size="sm">
                    <font-awesome-icon icon="fa-search" /> View Review
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    @click="onReviewTarget()"
                  >
                    <CIcon icon="cil-comment-square-edit"/> Edit Review
                  </CButton>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">7</th>
              <td>
                continued progress is made on the sustainable management of
                Canada's forests.
              </td>
              <td>
                <CBadge color="success">Published</CBadge>
              </td>
              <td>No significant progress</td>
              <td>12 Oct 2022 9:22 PM</td>
              <td>
                <div class="d-grid">
                  <CButton color="secondary" size="sm">
                    <font-awesome-icon icon="fa-search" /> View Review
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    @click="onReviewTarget()"
                  >
                    <CIcon icon="cil-comment-square-edit"/> Edit Review
                  </CButton>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>
                wetlands are conserved or enhanced to sustain their ecosystem
                services through retention
              </td>
              <td>
                <CBadge color="dark">Draft</CBadge>
              </td>
              <td>No significant progress</td>
              <td>22 Oct 2022 9:22 PM</td>
              <td>
                <div class="d-grid">
                  <CButton color="secondary" size="sm">
                    <font-awesome-icon icon="fa-search" /> View Review
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    @click="onReviewTarget()"
                  >
                    <CIcon icon="cil-comment-square-edit"/> Edit Review
                  </CButton>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>biodiversity considerations are integrated into municipal</td>
              <td>
                <CBadge color="dark">Draft</CBadge>
              </td>
              <td></td>
              <td>15 Oct 2022 9:22 PM</td>
              <td>
                <div class="d-grid">
                  <CButton color="secondary" size="sm">
                    <font-awesome-icon icon="fa-search" /> View Review
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    @click="onReviewTarget()"
                  >
                    <CIcon icon="cil-comment-square-edit"/> Edit Review
                  </CButton>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">6</th>
              <td>
                the ability of Canadian ecological systems to adapt to climate
                change is better understood
              </td>
              <td>
                <CBadge color="dark">Draft</CBadge>
              </td>
              <td></td>
              <td>18 Oct 2022 9:22 PM</td>
              <td>
                <div class="d-grid">
                  <CButton color="secondary" size="sm">
                    <font-awesome-icon icon="fa-search" /> View Review
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    @click="onReviewTarget()"
                  >
                    <CIcon icon="cil-comment-square-edit"/> Edit Review
                  </CButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <button @click="submitDocument()" class="btn btn-primary">Save</button>
      <button @click="submitDocument()" class="btn btn-primary">Cancel</button>
      </div>
      <CModal
        :show.sync="showTargetReviewDialog"
        :no-close-on-backdrop="true"
        :centered="true"
        title="Target Review : Global Target 1"
        size="lg"
        color="dark"
      >
        <edit-target-review></edit-target-review>
        <template #header>
          <h6 class="modal-title">Target Review : Global Target 1</h6>
          <CButtonClose class="text-white" @click="darkModal = false" />
        </template>
        <template #footer>
          <CButton color="danger" @click="darkModal = false"> Discard </CButton>
          <CButton color="success" @click="darkModal = false"> Save </CButton>
        </template>
      </CModal>
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
import EditTargetReview from '~/components/pages/nr7/edit-target-review.vue'
export default {
  components: {
    Ckeditor,
    EditTargetReview,
  },
  name: 'Nr7Section5',
  meta:{
    schema:'nationalReport7'
  },
  props: {},
  data() {
    return {
      showTargetReviewDialog: false,
    }
  },
  methods: {
    onReviewTarget() {
      this.showTargetReviewDialog = true
    },
  },
}
</script> -->
