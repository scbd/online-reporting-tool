<template>
  <CRow>
    <template>
      <CCol md="12">
        <div class="alert alert-success" role="alert">
          <h4 class="alert-heading">Recent Publish!</h4>
          <p>
            <strong>Gambia</strong> recently published their 7th National
            Report.
          </p>
          <hr />
          <p class="mb-0">
            Are you are country representative responsible for 7NR submission,
            <a href="#">click here</a> to begin
          </p>
        </div>
      </CCol>
      <CCol md="3" sm="6">
        <div class="card">
          <div class="card-header content-center text-white p-0 bg-facebook">
            <span height="52" class="my-4">7th National Reports</span>
          </div>
          <div class="card-body row text-center">
            <div class="col">
              <div class="text-value-lg">63</div>
              <div class="text-uppercase text-muted small">
                7th National Reports
              </div>
            </div>
            <div
              class="c-vr text-value-lg"
              style="width: unset; background-color: unset"
            >
              By
            </div>
            <div class="col">
              <div class="text-value-lg">63</div>
              <div class="text-uppercase text-muted small">Countries</div>
            </div>
          </div>
        </div>
      </CCol>
      <CCol md="3" sm="6">
        <div class="card">
          <div class="card-header content-center text-white p-0 bg-linkedin">
            <span height="52" class="my-4">NBSAP targets</span>
          </div>
          <div class="card-body row text-center">
            <div class="col">
              <div class="text-value-lg">765</div>
              <div class="text-uppercase text-muted small">
                National Targets
              </div>
            </div>
            <div
              class="c-vr text-value-lg"
              style="width: unset; background-color: unset"
            >
              By
            </div>
            <div class="col">
              <div class="text-value-lg">63</div>
              <div class="text-uppercase text-muted small">Countries</div>
            </div>
          </div>
        </div>
      </CCol>
      <CCol md="3" sm="6">
        <div class="card">
          <div class="card-header content-center text-white p-0 bg-warning">
            <span height="52" class="my-4">Targets Review</span>
          </div>
          <div class="card-body row text-center">
            <div class="col">
              <div class="text-value-lg">452</div>
              <div class="text-uppercase text-muted small">
                National Reviewed
              </div>
            </div>
            <div
              class="c-vr text-value-lg"
              style="width: unset; background-color: unset"
            >
              By
            </div>
            <div class="col">
              <div class="text-value-lg">45</div>
              <div class="text-uppercase text-muted small">Countries</div>
            </div>
          </div>
        </div>
      </CCol>
      <CCol md="3" sm="6">
        <div class="card">
          <div class="card-header content-center text-white p-0 bg-success">
            <span height="52" class="my-4">Some other Number</span>
          </div>
          <div class="card-body row text-center">
            <div class="col">
              <div class="text-value-lg">25</div>
              <div class="text-uppercase text-muted small">test</div>
            </div>
            <div
              class="c-vr text-value-lg"
              style="width: unset; background-color: unset"
            >
              By
            </div>
            <div class="col">
              <div class="text-value-lg">3</div>
              <div class="text-uppercase text-muted small">Countries</div>
            </div>
          </div>
        </div>
      </CCol>
    </template>
  </CRow>
</template>

<script>
export default {
  name: 'WidgetsBrand',
  components: {},
  props: {
    noCharts: Boolean,
  },
}
</script>

<style scoped>
.c-chart-brand {
  position: absolute;
  width: 100%;
  height: 100px;
}
</style>
