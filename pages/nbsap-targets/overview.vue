<template>
  <CCard>
   
    <CCardHeader>
      <slot name="header"> <CIcon name="cil-grid" /> {{ caption }} </slot>
    </CCardHeader>
    <CCardBody>
      <CRow >
        <CCol md="12">
          <div class="card">
            <div class="card-body">
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <NuxtLink to="/nbsap-targets/new">
                  <CButton class="secondary  m-1">
                    <font-awesome-icon icon="fa-plus" /> Submit new target
                  </CButton>
                </NuxtLink>
                <!-- <CButton color="secondary m-1">
                  <font-awesome-icon icon="fa-save" /> Save
                </CButton> -->
                <CButton color="success m-1">
                  <font-awesome-icon icon="fa-save" /> Publish
                </CButton>
                <CButton color="warning m-1">
                  <font-awesome-icon icon="fa-share" /> Share
                </CButton>

                <CButton color="danger m-1">
                  <font-awesome-icon icon="fa-file-pdf" /> PDF
                </CButton>
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Country</th>
            <th scope="col">Title</th>
            <th scope="col">Global Target</th>
            <th scope="col">Submission Status</th>
            <th scope="col">Updated On</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Canada</td>
            <td>Part 1 - Coastal and marine areas.</td>
            <td>Global Target 1</td>
            <td>
              <CBadge color="success">Published</CBadge>
            </td>
            <td>12 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Canada</td>
            <td>Part 2 - Coastal and marine areas.</td>
            <td>Global Target 2</td>
            <td>
              <CBadge color="success">Published</CBadge>
            </td>
            <td>21 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Canada</td>
            <td>species that are secure remain secure,</td>
            <td>Global Target 1</td>
            <td>
              <CBadge color="dark">Draft</CBadge>
            </td>
            <td>22 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">4</th>
            <td>Canada</td>
            <td>
              wetlands are conserved or enhanced to sustain their ecosystem
              services through retention
            </td>
            <td>Global Target 6</td>
            <td>
              <CBadge color="dark">Draft</CBadge>
            </td>
            <td>22 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">5</th>
            <td>Canada</td>
            <td>biodiversity considerations are integrated into municipal</td>
            <td>Global Target 12</td>
            <td>
              <CBadge color="dark">Draft</CBadge>
            </td>
            <td>15 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">6</th>
            <td>Canada</td>
            <td>
              the ability of Canadian ecological systems to adapt to climate
              change is better understood
            </td>
            <td>Global Target 2</td>
            <td>
              <CBadge color="dark">Draft</CBadge>
            </td>
            <td>18 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">7</th>
            <td>Canada</td>
            <td>
              continued progress is made on the sustainable management of
              Canada's forests.
            </td>
            <td>Global Target 9</td>
            <td>
              <CBadge color="success">Published</CBadge>
            </td>
            <td>12 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">8</th>
            <td>Canada</td>
            <td>
              agricultural working landscapes provide a stable or improved level
              of biodiversity and habitat capacity.
            </td>
            <td>Global Target 4</td>
            <td>
              <CBadge color="dark">Draft</CBadge>
            </td>
            <td>1 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">9</th>
            <td>Canada</td>
            <td>all aquaculture in Canada is managed</td>
            <td>Global Target 6</td>
            <td>
              <CBadge color="dark">Draft</CBadge>
            </td>
            <td>13 Oct 2022 9:22 PM</td>
            <td>
              <div class="d-grid">
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-search" /> View target
                </CButton>
                <CButton color="secondary" size="sm">
                  <font-awesome-icon icon="fa-edit" /> Edit target
                </CButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </CCardBody>
  </CCard>
</template>

<script>
export default {
  name: 'TargetOverview',
  meta:{
    schema:'nationalTarget7'
  },
  roles:['publishingAuthority', 'nationalAuthorizedUser'],
  props: {
    items: Array,
    fields: {
      type: Array,
      default() {
        return ['username', 'registered', 'role', 'status']
      },
    },
    caption: {
      type: String,
      default: 'Table',
    },
    hover: Boolean,
    striped: Boolean,
    bordered: Boolean,
    small: Boolean,
    fixed: Boolean,
    dark: Boolean,
  },
  methods: {
    getBadge(status) {
      return status === 'Active'
        ? 'success'
        : status === 'Inactive'
        ? 'secondary'
        : status === 'Pending'
        ? 'warning'
        : status === 'Banned'
        ? 'danger'
        : 'primary'
    },
  }
}
</script>
