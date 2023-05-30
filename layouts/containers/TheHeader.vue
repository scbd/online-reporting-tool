<template>
  <CHeader fixed with-subheader light>
    <CToggler
      v-c-emit-root-event:toggle-sidebar-mobile
      in-header
      class="ml-3 d-lg-none"
    />
    <CToggler
      v-c-emit-root-event:toggle-sidebar
      in-header
      class="ml-3 d-md-down-none"
    />
    <CHeaderBrand
      class="mx-auto1 d-lg-none1"
      src="https://chm.cbd.int/app/img/cbd-logo-en.svg"
      width="190"
      height="46"
      alt="CoreUI Logo"
    />
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard"> Dashboard </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/nbsaps-targets" exact>
          NBSAP Targets
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/national-reports/nr7/edit">
          7th National Report
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink target="_blank" href="https://chm.cbd.int">
          CHM
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-1">
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open" />
        </CHeaderNavLink>
      </CHeaderNavItem>
      <TheHeaderDropdownAccnt />
    </CHeaderNav>
    <CSubheader class="px-3">
      <BreadCrumbs />
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import BreadCrumbs from './BreadCrumbs.vue';

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt,
    BreadCrumbs
  },
}
</script>
