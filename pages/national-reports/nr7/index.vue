<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ caption }} </slot>
      </CCardHeader>
      <CCardBody>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <NuxtLink to="/nbsap-targets/new">
            <CButton color="secondary" size="sm">
              <CIcon icon="addthis"/>NR7 All reports
            </CButton>
          </NuxtLink>
        </div>
        List of reports
      </CCardBody>
    </CCard>
  </template>
  <!-- <i18n src="../i18n/dist/pages/index.json"></i18n> -->
  <script>
  export default {
    name: 'nr7Index',
    meta:{
      schema:'nationalReport7'
    },
    auth:false,
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
    },
  }
  </script>