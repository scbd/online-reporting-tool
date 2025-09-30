<template>
  <CSidebar
    class="border-end"
    colorScheme="dark"
    position="fixed"
    :unfoldable="userPreferences.sidebarUnfoldable"
    :visible="userPreferences.sidebarVisible"
    @visible-change="(value) => userPreferences.setSidebarVisible(value)"
  >
    <CSidebarHeader class="border-bottom">
        <img src="https://chm.cbd.int/app/img/cbd-logo-en.svg" role="img" custom-class-name="sidebar-brand-full" height="35">
        <CTooltip content="On-line Reporting Tool for NBSAPS and National Reports" placement="bottom" trigger="hover">
            <template #toggler="{ on }">
                <span class="brand-name" v-on="on">CHM - ORT</span>
            </template>
        </CTooltip>
      <CCloseButton class="d-lg-none" dark @click="userPreferences.setSidebarVisible()" />
    </CSidebarHeader>

    <CSidebarNav>
      <KmNavLink :to="localePath('/dashboard')" icon="cil-speedometer" :title="t('menuDashboard')"></KmNavLink>      
      <!-- <li class="nav-title" v-if="menuAccess[appRoutes.NATIONAL_TARGETS]">
        {{t('menuNbsaps')}}
      </li> -->
      <CNavGroup :visible="isChildRouteActive(appRoutes.NATIONAL_REPORTS_NBSAP)">
        <template #togglerContent>
            {{ t('menuNbsaps') }}
        </template>
        <KmNavLink  icon="cil-list" :to="appRoutes.NATIONAL_REPORTS_NBSAP" :title="t('menuNbsapsAll')"></KmNavLink>
        <KmNavLink  :to="appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_LIST" :title="t('menuNbsapsMyCountry')">
          <template #icon>
            <font-awesome-icon class="nav-icon" icon="fa-solid fa-flag" />
          </template>
        </KmNavLink>
      </CNavGroup>
      <CNavGroup :visible="isChildRouteActive(appRoutes.NATIONAL_TARGETS)"  id="sideNav">
        <template #togglerContent>
            {{ t('menuNationalTargets') }}
        </template>
        <KmNavLink v-if="menuAccess[appRoutes.NATIONAL_TARGETS]" :to="appRoutes.NATIONAL_TARGETS" icon="cil-list" :title="t('menuAllTargets')"></KmNavLink>        
        <!--<KmNavLink v-if="menuAccess[appRoutes.NATIONAL_TARGETS_ANALYZER]" :to="appRoutes.NATIONAL_TARGETS_ANALYZER" icon="cil-speedometer" :title="t('menuAnalyzeTargets')"></KmNavLink>-->
        <CNavGroup :visible="isChildRouteActive(appRoutes.NATIONAL_TARGETS_MY_COUNTRY)">
          <template #togglerContent>
            <font-awesome-icon class="nav-icon" icon="fa-solid fa-flag" />
            {{ t('menuMyCountryTargets') }}
          </template>
          <KmNavLink v-if="menuAccess[appRoutes.NATIONAL_TARGETS_MY_COUNTRY]"  :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY"         icon="fa-wand-magic-sparkles" :title="t('overview')"></KmNavLink>
          <KmNavLink v-if="menuAccess[appRoutes.NATIONAL_TARGETS_MY_COUNTRY]"  :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I"  icon="fa-arrows-down-to-people" :title="t('menuMyCountryTargetsPart1')"></KmNavLink>
          <KmNavLink v-if="menuAccess[appRoutes.NATIONAL_TARGETS_MY_COUNTRY]"  :to="appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II"  icon="fa-layer-group" :title="t('menuMyCountryTargetsPart2')"></KmNavLink>
        </CNavGroup>
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
                <font-awesome-icon class="nav-icon" icon="fa-solid fa-flag" />
                {{ t('myCountry') }}
            </template>        
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-database"      :title="t('indicatorData')" :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_INDICATOR_DATA)" ></KmNavLink>
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-pen-to-square" :title="t('overview')"      :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_OVERVIEW      )" ></KmNavLink>
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-pen-to-square" :title="t('sectionI')"      :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_I     )" ></KmNavLink>
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-pen-to-square" :title="t('sectionII')"     :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_II    )" ></KmNavLink>
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-pen-to-square" :title="t('sectionIII')"    :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_III   )" ></KmNavLink>
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-pen-to-square" :title="t('sectionIV')"     :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_IV    )" ></KmNavLink>
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-pen-to-square" :title="t('sectionV')"      :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_V     )" ></KmNavLink>
            <KmNavLink  v-if="menuAccess[appRoutes.NATIONAL_REPORTS_NR7_EDIT]"  icon="fa-pen-to-square" :title="t('otherInformation')"         :to="localePath(appRoutes.NATIONAL_REPORTS_NR7_MY_COUNTRY_EDIT_SECTION_OTHER_INFORMATION )" ></KmNavLink>
                   
        </CNavGroup>          
        
      </CNavGroup>
      <CNavGroup :visible="isChildRouteActive(appRoutes.STAKEHOLDER)">  
        <template #togglerContent>
          {{t('stakeholders')}}
        </template>      

        <KmNavLink :to="localePath(appRoutes.STAKEHOLDER_COMMITMENTS)" icon="cil-list" :title="t('allCommitments')"></KmNavLink>
        <KmNavLink  :to="appRoutes.STAKEHOLDER_MY_COMMITMENTS" :title="t('menuMyCommitments')">
          <template #icon>
            <font-awesome-icon class="nav-icon" icon="fa-solid fa-handshake" />
          </template>
        </KmNavLink>
        <KmNavLink  v-if="menuAccess[appRoutes.STAKEHOLDER_MY_ENDORSEMENTS]"
          :to="appRoutes.STAKEHOLDER_MY_ENDORSEMENTS" :title="t('menuMyEndorsements')">
          <template #icon>
            <font-awesome-icon class="nav-icon" icon="fa-solid fa-handshake" />
          </template>
        </KmNavLink>
        <KmNavLink  :to="appRoutes.STAKEHOLDER_MY_INTENTS" :title="t('menuMyIntents')">
          <template #icon>
            <font-awesome-icon class="nav-icon" icon="fa-solid fa-flag" />
          </template>
        </KmNavLink>
      </CNavGroup>
    </CSidebarNav> 

    <CSidebarFooter class="border-top d-none d-lg-flex">
      <div class="app-version">
          Ver {{ TAG||COMMIT.substring(0, 20) }}      
          <span class="ms-3" v-if="appState.showBackupSpinner">
            <CSpinner color="success" variant="grow" class="me-1" size="sm"/>
            <CSpinner color="info" variant="grow" size="sm"/>
          </span>    
        </div> 
      <CSidebarToggler @click="userPreferences.setSidebarUnfoldable()" />
    </CSidebarFooter>
  </CSidebar>
</template>

<i18n src="@/i18n/dist/components/layout/AppSidebar.json"></i18n>
<script lang="ts">
//@ts-nocheck

import { useRealmConfStore }    from '@/stores/realmConf';
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useAppStateStore } from '@/stores/appState';
import { KmNavLink } from '~/components/controls';
import { useRoute } from 'vue-router';


export default {
  name: 'AppSidebar',
  components: {
    KmNavLink
},
  async setup() {
    const { ACCOUNTS_HOST_URL, TAG, COMMIT } = useRuntimeConfig().public
    const {$appRoutes:appRoutes }   = useNuxtApp();
    const {locale} = useI18n()
    const localePath  = useLocalePath()
    const { loadRealmConf } = useRealmConfStore();
    const userPreferences = useUserPreferencesStore();
    const appState        = useAppStateStore();
    const { t } = useI18n()
    const route = useRoute();
    const { checkUserAccess } = useSecurity()
    
    await loadRealmConf();

    const menuAccess = {
      [appRoutes.DASHBOARD] : true,
      [appRoutes.NATIONAL_TARGETS]            : true,
      [appRoutes.NATIONAL_TARGETS_ANALYZER]     : true,
      [appRoutes.NATIONAL_TARGETS_MY_COUNTRY]   : true,//false,
      [appRoutes.NATIONAL_REPORTS_NR6]      : true,
      [appRoutes.NATIONAL_REPORTS_NR7]      : true,
      [appRoutes.NATIONAL_REPORTS_NR7_EDIT] : true,//false,
      [appRoutes.STAKEHOLDER_MY_ENDORSEMENTS]: true,
      
    }
    // for (const route in menuAccess) {
    //   if (Object.hasOwnProperty.call(menuAccess, route)) {
    //     if(!menuAccess[route])
    //       menuAccess[route] = await $security.canAccessRoute(route)
    //   }
    // }

    menuAccess[appRoutes.STAKEHOLDER_MY_ENDORSEMENTS] = await checkUserAccess({ roles : [ROLES.NATIONAL_FOCALPOINT]})

    const isChildRouteActive = (path)=>{
      return route.fullPath.indexOf(path)>=0
    }

    const isDevelopment = ACCOUNTS_HOST_URL.indexOf('accounts.cbddev.xyz')>=0
    
    return {
      sidebarUnfoldable: false,
      sidebarVisible: true,
      appRoutes,
      menuAccess,
      localePath,
      t,
      isChildRouteActive,
      isDevelopment,
      userPreferences, TAG, COMMIT,
      appState
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

.app-version{
    position: absolute;
    left:5px;
    bottom: 10px;
    color: #fff;
}
</style>