<template>
  <CHeader position="sticky" :class="headerClassNames">
    <CContainer class="border-bottom px-4" fluid>
      <CHeaderToggler class="ps-1" @click="userPreferences.setSidebarVisible()">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-none" to="/">
        <CIcon :icon="logo" height="48" alt="Logo" />
      </CHeaderBrand>
      <CHeaderNav class="me-auto" id="topNav">
        <CNavItem class="d-none d-md-flex">
          <NuxtLink class="nav-link" :to="localePath('/dashboard')"> {{t('menuDashboard')}}</NuxtLink>
        </CNavItem>
        <CNavItem>
          <NuxtLink class="nav-link" :to="localePath('/national-targets')" exact>
            {{t('menuNationalTargets')}} 
          </NuxtLink>
        </CNavItem>
        <CNavItem>
          <NuxtLink class="nav-link" :to="localePath('/national-reports/nr7')">
          {{t('menu7Nr')}} 
          </NuxtLink>
        </CNavItem>
        <CNavItem  class="d-none d-md-flex">
          <NuxtLink class="nav-link" target="_blank" href="https://chm.cbd.int">
            {{ t('chm') }}
          </NuxtLink>
        </CNavItem>
        <CNavItem  class="d-none d-md-flex">
          <NuxtLink class="nav-link" target="_blank" href="https://chm.cbd.int/management/national-users">
            <font-awesome-icon icon="users-line" />
            {{ t('nationalUsers') }}
          </NuxtLink>
        </CNavItem>           
        <CNavItem>
          <NuxtLink class="nav-link" :to="localePath('/knowledge-base')">
            <font-awesome-icon icon="fa-solid fa-circle-question" />
          {{t('menuHelp')}} 
          </NuxtLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <!-- <CNavItem>
          <NuxtLink class="nav-link" href="#">
            <CIcon class="mx-2" icon="cil-bell" size="lg" />
          </NuxtLink>
        </CNavItem>
        <CNavItem>
          <NuxtLink class="nav-link" href="#">
            <CIcon class="mx-2" icon="cil-list" size="lg" />            
          </NuxtLink>
        </CNavItem> -->
        <CNavItem>
          <span class="nav-link" id="languages">
            <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end" class="py-0" :caret="true">
                <font-awesome-icon icon="fa-solid fa-language" /> {{languages[$i18n.locale]}} 
              </CDropdownToggle>
              <CDropdownMenu class="pt-0">
                <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
                  {{t('languages')}}
                </CDropdownHeader>
                <KmNavLink class="hand-cursor" v-for="(locale, key) in languages" v-bind:key="key"  @click="switchLocale(key)" :title="locale"></KmNavLink>
              </CDropdownMenu>
            </CDropdown>
          </span>
        </CNavItem>
        <CNavItem>
          <span class="nav-link">
            <AppHeaderDropdownAccnt />
          </span>
        </CNavItem>
        <CNavItem>
            <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle :caret="false">
                <CIcon title="Dark" v-if="colorMode === 'dark'" icon="cil-moon" size="lg" />
                <CIcon title="Light" v-else-if="colorMode === 'light'" :icon="cilSun" size="lg" />
                <CIcon title="Auto" v-else :icon="cilContrast" size="lg" />
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem
                :active="colorMode === 'light'"
                class="d-flex align-items-center"
                component="button"
                type="button"
                @click="setColorMode('light')"
                >
                <CIcon class="me-2" :icon="cilSun" size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                :active="colorMode === 'dark'"
                class="d-flex align-items-center"
                component="button"
                type="button"
                @click="setColorMode('dark')"
                >
                <CIcon class="me-2" icon="cil-moon" size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                :active="colorMode === 'auto'"
                class="d-flex align-items-center"
                component="button"
                type="button"
                @click="setColorMode('auto')"
                >
                <CIcon class="me-2" :icon="cilContrast" size="lg" /> Auto
                </CDropdownItem>
            </CDropdownMenu>
            </CDropdown>
            
        </CNavItem>
      </CHeaderNav>
    </CContainer>
    <CContainer class="px-4" fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<i18n src="@/i18n/dist/components/layout/AppHeader.json"></i18n>
<script setup lang="ts">
//@ts-nocheck

import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { logo } from '~/assets/brand/logo'
import { languages } from '@/app-data/languages'
import { useUserPreferencesStore } from '@/stores/userPreferences';
import { useColorModes } from '@coreui/vue'

import { cilSun, cilContrast } from '@coreui/icons';

    const { setLocale, } = useI18n()
    const switchLocalePath = useSwitchLocalePath();
    const { t } = useI18n()
    const userPreferences = useUserPreferencesStore();
    const headerClassNames = ref('mb-4 p-0')
    const { isColorModeSet, colorMode, setColorMode } = useColorModes('coreui-free-vue-admin-template-theme')

    async function switchLocale (locale){
      setLocale(locale);
      const newLocalePath = switchLocalePath(locale);
      // console.log(locale, newLocalePath)
      await useNavigateAppTo(newLocalePath);
    }

    onMounted(() => {
            
        document.addEventListener('scroll', () => {
            if (document.documentElement.scrollTop > 0) {
            headerClassNames.value = 'mb-4 p-0 shadow-sm'
            } else {
            headerClassNames.value = 'mb-4 p-0'
            }
        })

        if (!isColorModeSet()) {
          setColorMode('auto')
        }
    })

</script>
