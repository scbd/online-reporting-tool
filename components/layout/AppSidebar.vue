<template>
  <CSidebar
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="(event) =>{}"
  >
    <CSidebarBrand>
      <img src="https://chm.cbd.int/app/img/cbd-logo-en.svg" role="img" custom-class-name="sidebar-brand-full" height="35">
      <span class="brand-name">CHM - ORT</span>
    </CSidebarBrand>     
    <CSidebarNav>
      <KmNavLink :to="localePath('/dashboard')" icon="cil-speedometer" :title="t('menuDashboard')"></KmNavLink>      
      <li class="nav-title" v-if="menuAccess[appRoutes.NBSAPS_TARGETS]">
        {{t('menuDashboardNbsaps')}}
      </li>
      <CNavGroup :visible="isChildRouteActive(appRoutes.NBSAPS_TARGETS)">
        <template #togglerContent>
          {{ t('menuNationalTargets') }}
        </template>
        <KmNavLink v-if="menuAccess[appRoutes.NBSAPS_TARGETS]" :to="localePath('/nbsap-targets')" icon="cil-list" :title="t('menuAllTargets')"></KmNavLink>
        <KmNavLink v-if="menuAccess[appRoutes.NBSAPS_TARGETS_OVERVIEW]" :to="localePath(appRoutes.NBSAPS_TARGETS_OVERVIEW)" icon="cil-list" :title="t('menuMyCountryTargets')"></KmNavLink>
      </CNavGroup>
      
      <li class="nav-title"> {{t('nationalReports')}} </li>      
      <KmNavLink  target="_blank" :to="`https://chm.cbd.int/${$i18n.locale}/database?schema_s=nationalReport6`" :title="t('6thNationalReport')"></KmNavLink>
      <CNavGroup :visible="isChildRouteActive(appRoutes.NATIONAL_REPORTS)">  
        <template #togglerContent>
          {{t('7thNationalReport')}}
        </template>      
        <KmNavLink :to="localePath('/national-reports/nr7')" icon="cil-list" :title="t('reports')"></KmNavLink>
        <CNavGroup :visible="isChildRouteActive(appRoutes.NATIONAL_REPORTS_NR7)">
          <template #togglerContent>
            <CIcon customClassName="nav-icon" icon="cil-document"/> {{t('myCountry')}}
          </template>                 
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('overview')"    :to="localePath('/national-reports/nr7/edit')"           ></KmNavLink>
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('sectionI')"    :to="localePath('/national-reports/nr7/edit/section-1')" ></KmNavLink>
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('sectionII')"   :to="localePath('/national-reports/nr7/edit/section-2')" ></KmNavLink>
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('sectionIII')"  :to="localePath('/national-reports/nr7/edit/section-3')" ></KmNavLink>
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('sectionIV')"   :to="localePath('/national-reports/nr7/edit/section-4')" ></KmNavLink>
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('sectionV')"    :to="localePath('/national-reports/nr7/edit/section-5')" ></KmNavLink>
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('sectionVI')"   :to="localePath('/national-reports/nr7/edit/section-6')" ></KmNavLink>
          <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="cil-pencil" :title="t('annex')"       :to="localePath('/national-reports/nr7/edit/section-7')" ></KmNavLink>
        </CNavGroup>          
        
      </CNavGroup>
    </CSidebarNav>
    <CSidebarToggler
      class="d-none d-lg-flex"
    />
  </CSidebar>
</template>

<i18n src="@/i18n/dist/layouts/containers/AppSidebar.json"></i18n>
<script>

import { useRealmConfStore }    from '@/stores/realmConf';
import { KmNavLink } from '@/components/controls';
import { useRoute } from 'vue-router';


export default {
  name: 'AppSidebar',
  components: {
    KmNavLink
},
  async setup() {
    const appRoutes = inject('appRoutes')
    const {locale} = useI18n()
    const localePath  = useLocalePath()
    const { loadRealmConf } = useRealmConfStore();
    const { t } = useI18n()
    const route = useRoute();
    
    await loadRealmConf();

    const menuAccess = {
      [appRoutes.DASHBOARD] : true,
      [appRoutes.NBSAPS_TARGETS]            : true,
      [appRoutes.NBSAPS_TARGETS_OVERVIEW]   : true,//false,
      [appRoutes.NATIONAL_REPORTS_NR6]      : true,
      [appRoutes.NATIONAL_REPORTS_NR7]      : true,
      [appRoutes.NATIONAL_REPORTS_NR7_EDIT] : true,//false,     
      
      
    }
    // for (const route in menuAccess) {
    //   if (Object.hasOwnProperty.call(menuAccess, route)) {
    //     if(!menuAccess[route])
    //       menuAccess[route] = await $security.canAccessRoute(route)
    //   }
    // }

    const isChildRouteActive = (path)=>{
      return route.fullPath.indexOf(path)>=0
    }
    
    return {
      sidebarUnfoldable: false,
      sidebarVisible: true,
      appRoutes,
      menuAccess,
      localePath,
      t,
      isChildRouteActive
    }
  },
}
</script>
<style scoped>
/* TODO:Temp check why its not align with parellel component */
.sidebar-nav .nav-title {
  background: #000;
}

.sidebar-brand .brand-name {
  font-size: medium;
  padding: 5px;
  margin-top: 10px;
}
</style>