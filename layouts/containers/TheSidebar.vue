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
      <CSidebarNavItem v-if="$security.canAccessRoute('/dashboard')" name="Dashboard" icon="cil-speedometer" :to="localePath('/dashboard')"/>
      <span v-if="$security.canAccessRoute('/nbsaps-targets')">
        <CSidebarNavTitle> NBSAPS </CSidebarNavTitle>
      </span>
      <span>
        <CSidebarNavDropdown  name="National Targets" :route="localePath('/nbsaps-targets')">  
          <CSidebarNavItem    name="All Targets" icon="cil-list" :to="localePath('/nbsaps-targets')"/>
          <CSidebarNavItem    v-if="$security.canAccessRoute('/nbsaps-targets/overview')" name="My Country Targets" icon="cil-list" :to="localePath('/nbsaps-targets/overview')"/>          
        </CSidebarNavDropdown>
        <CSidebarNavTitle> {{$t('sidebar.nationalReports')}} </CSidebarNavTitle>
        <CSidebarNavItem        :name="$t('sidebar.6thNationalReport')" icon="cil-list" target="_blank" :href="`https://chm.cbd.int/${$i18n.locale}/database?schema_s=nationalReport6`" />
        <CSidebarNavDropdown    :name="$t('sidebar.7thNationalReport')" :route="localePath('/national-reports/nr7/edit')">
          <CSidebarNavItem      :name="$t('sidebar.reports')"    icon="cil-list" :to="localePath('/national-reports/nr7')"/>
          <CSidebarNavDropdown  v-if="$security.canAccessRoute('/national-reports/nr7/edit')" :name="$t('sidebar.myCountry')"  icon="cil-pencil" :route="localePath('/national-reports/nr7/edit')">            
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit')" :name="$t('sidebar.overview')"   icon="cil-pencil" :to="localePath('/national-reports/nr7/edit')"/>
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit/section-1')" :name="$t('sidebar.sectionI')"   icon="cil-pencil" :to="localePath('/national-reports/nr7/edit/section-1')"/>
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit/section-2')" :name="$t('sidebar.sectionII')"  icon="cil-pencil" :to="localePath('/national-reports/nr7/edit/section-2')"/>
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit/section-3')" :name="$t('sidebar.sectionIII')" icon="cil-pencil" :to="localePath('/national-reports/nr7/edit/section-3')"/>
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit/section-4')" :name="$t('sidebar.sectionIV')"  icon="cil-pencil" :to="localePath('/national-reports/nr7/edit/section-4')"/>
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit/section-5')" :name="$t('sidebar.sectionV')"   icon="cil-pencil" :to="localePath('/national-reports/nr7/edit/section-5')"/>
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit/section-6')" :name="$t('sidebar.sectionVI')"  icon="cil-pencil" :to="localePath('/national-reports/nr7/edit/section-6')"/>
            <CSidebarNavItem    v-if="$security.canAccessRoute('/national-reports/nr7/edit/section-7')" :name="$t('sidebar.annex')"      icon="cil-pencil" :to="localePath('/national-reports/nr7/edit/section-7')"/>
          </CSidebarNavDropdown>          
        </CSidebarNavDropdown>
      </span>
    </CSidebarNav>

    <CSidebarMinimizer class="d-md-down-none" @click.native="minimize = !minimize" />
  </CSidebar>
</template>

<i18n src="../../i18n/dist/layouts/containers/TheSidebar.json"></i18n>

<script>
import { CSidebarNavItem } from '@coreui/vue'
export default { 
  async fetch () { //Nuxt event to load async data at initial step
  },
  name: 'TheSidebar',
  components: { CSidebarNavItem },
  data() {
    return {
      minimize: false,
      show: 'responsive'
    }
  },
  mounted(){
    
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