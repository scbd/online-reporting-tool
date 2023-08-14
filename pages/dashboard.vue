<template>
  <div>
    <user-profile-info class="mb-2"></user-profile-info>
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
              Are you a country representative responsible for 7NR submission,
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
              <span height="52" class="my-4">Assessed Targets</span>
            </div>
            <div class="card-body row text-center">
              <div class="col">
                <div class="text-value-lg">452</div>
                <div class="text-uppercase text-muted small">
                  Targets reviewed
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
    <CRow>
      <CCol md="12">
        <CCard>
          <CCardHeader> Latest records </CCardHeader>
          <CCardBody>
            <CDataTable
              class="mb-0 table-outline"
              hover
              :items="tableItems"
              :fields="tableFields"
              head-color="light"
              no-sorting
            >
            </CDataTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import UserProfileInfo  from "@/components/common/user-profile-info.vue"

      definePageMeta({
        auth:false
      })
      const gbfTargets=null
      const selected = 'Month'
      const tableItems = [
        {
          country: 'Canada',
          type: '7th National Report',
          title: 'Canada : 7th National Report',
          publishedOn: randomDate(
            new Date(2022, 0, 10),
            new Date()
          ).toLocaleString(),
        },
        {
          country: 'Canada',
          type: 'NBSAP Target',
          title: 'National Target 1',
          publishedOn: randomDate(
            new Date(2022, 0, 10),
            new Date()
          ).toLocaleString(),
        },
        {
          country: 'Germany',
          type: 'NBSAP Target',
          title: 'National Target 1',
          publishedOn: randomDate(
            new Date(2022, 0, 10),
            new Date()
          ).toLocaleString(),
        },
        {
          country: 'Ghana',
          type: 'NBSAP Target',
          title: 'National Target 1',
          publishedOn: randomDate(
            new Date(2022, 0, 10),
            new Date()
          ).toLocaleString(),
        }
      ]
      const tableFields = [
        { key: 'country', label: 'Country', _classes: '' },
        { key: 'type', label: 'Record Type', _classes: '' },
        { key: 'title', label: 'Title', _classes: '' },
        { key: 'publishedOn', label: 'Published on' },
      ]

    function color(value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color
    }
    function randomDate(start, end) {
      return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      )
    }
</script>
