<template>
  <CSidebar fixed :minimize="minimize" :show.sync="show">
    <!-- <CSidebarBrand
      :img-full="{
        width: 118,
        height: 46,
        alt: 'Logo',
        src: 'https://chm.cbd.int/app/img/cbd-logo-en.svg',
      }"
      :img-minimized="{
        width: 118,
        height: 46,
        alt: 'Logo',
        src: 'https://chm.cbd.int/app/img/cbd-logo-en.svg',
      }"
      :wrapped-in-link="{ href: 'https://chm.cbd.int', target: '_blank' }"
    /> -->
    <CSidebarBrand>
      <CIcon custom-class-name="sidebar-brand-full" :height="35" src="https://chm.cbd.int/app/img/cbd-logo-en.svg" />
      <span class="brand-name">CHM - ORT</span>
    </CSidebarBrand>


    <CSidebarNav>
      <CSidebarNavItem name="Dashboard" icon="cil-speedometer" to="/dashboard"/>
      <span>
        <CSidebarNavTitle> NBSAPS </CSidebarNavTitle>
      </span>
      <span>
        <CSidebarNavDropdown name="National Targets" route="/nbsaps-targets">  
          <CSidebarNavItem name="All Targets" icon="cil-list" to="/nbsaps-targets"/>
          <CSidebarNavItem name="My Country Targets" icon="cil-list" to="/nbsaps-targets/overview"/>
          <!-- <CSidebarNavDropdown name="My Country" icon="cil-pencil" route="/nbsaps-targets/overview">            
          <CSidebarNavItem name="Overview" icon="cil-list" to="/nbsaps-targets/overview"/>
          <CSidebarNavItem name="New" icon="cil-pencil" to="/nbsaps-targets/new"/>
          </CSidebarNavDropdown> -->
        </CSidebarNavDropdown>
        <CSidebarNavTitle> National Reports </CSidebarNavTitle>
        <CSidebarNavItem name="6th National Report" icon="cil-list" href="https://chm.cbd.int/database?schema_s=nationalReport6" />
        <CSidebarNavDropdown name="7th National Report" route="/national-reports/nr7/edit">
          <CSidebarNavItem name="Reports" icon="cil-list" to="/national-reports/nr7"/>
          <CSidebarNavDropdown name="My Country" icon="cil-pencil" route="/national-reports/nr7/edit">            
            <CSidebarNavItem name="Overview"     icon="cil-pencil" to="/national-reports/nr7/edit"/>
            <CSidebarNavItem name="Section I"    icon="cil-pencil" to="/national-reports/nr7/edit/section-1"/>
            <CSidebarNavItem name="Section II"   icon="cil-pencil" to="/national-reports/nr7/edit/section-2"/>
            <CSidebarNavItem name="Section III"  icon="cil-pencil" to="/national-reports/nr7/edit/section-3"/>
            <CSidebarNavItem name="Section IV"   icon="cil-pencil" to="/national-reports/nr7/edit/section-4"/>
            <CSidebarNavItem name="Section V"    icon="cil-pencil" to="/national-reports/nr7/edit/section-5"/>
            <CSidebarNavItem name="Section VI"   icon="cil-pencil" to="/national-reports/nr7/edit/section-6"/>
            <CSidebarNavItem name="Annex"        icon="cil-pencil" to="/national-reports/nr7/edit/section-7"/>
          </CSidebarNavDropdown>          
        </CSidebarNavDropdown>
      </span>
    </CSidebarNav>

    <CSidebarMinimizer class="d-md-down-none" @click.native="minimize = !minimize" />
  </CSidebar>
</template>

<script>
import { CSidebarNavItem } from '@coreui/vue'
import nav from './_nav'
import MRenderFunction from './MRenderFunction.vue'
export default {
  name: 'TheSidebar',
  components: { MRenderFunction, CSidebarNavItem },
  data() {
    return {
      minimize: false,
      nav,
      show: 'responsive'
    }
  },
  mounted() {
    this.$root.$on('toggle-sidebar', () => {
      const sidebarOpened = this.show === true || this.show === 'responsive'
      this.show = sidebarOpened ? false : 'responsive'
    })
    this.$root.$on('toggle-sidebar-mobile', () => {
      const sidebarClosed = this.show === 'responsive' || this.show === false
      this.show = sidebarClosed ? true : 'responsive'
    })
  }
}
</script>
<style>
.c-sidebar .c-sidebar-nav-title {
  background: #000;
}

.c-sidebar .brand-name {
  font-size: medium;
  padding: 5px;
  margin-top: 10px;
}
</style>
