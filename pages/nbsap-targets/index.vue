<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> <CIcon name="cil-grid" /> {{ caption }} </slot>
      </CCardHeader>
      <CCardBody>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
          <NuxtLink to="/nbsap-targets/new">
            <CButton color="secondary" size="sm">
              <CIcon icon="addthis"/> Submit new target
            </CButton>
          </NuxtLink>
        </div>
        List of reports
      </CCardBody>
    </CCard>
  </template>
  
  <i18n  src="~/i18n-dist/pages/nbsap-targets/index.json"></i18n>
  <script>
  export default {
    name: 'Targets',
    meta:{
      schema:'nationalTarget7'
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
    },
  }
  </script>