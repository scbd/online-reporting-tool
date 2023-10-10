<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
        <CIcon :icon="logo" height="48" alt="Logo" />
      </CHeaderBrand>
      <CHeaderNav class="d-none d-md-flex me-auto">
        <CNavItem>
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
        <CNavItem>
          <NuxtLink class="nav-link" target="_blank" href="https://chm.cbd.int">
            CHM
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
          <span class="nav-link">
            <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end" class="py-0" :caret="true">
                <font-awesome-icon icon="fa-solid fa-language" /> {{languages[$i18n.locale]}} 
              </CDropdownToggle>
              <CDropdownMenu class="pt-0">
                <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
                  {{t('languages')}}
                </CDropdownHeader>
                <CDropdownItem v-for="(locale, key) in languages" v-bind:key="key"  @click="switchLocale(key)"> {{locale}} </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </span>
        </CNavItem>
        <CNavItem>
          <span class="nav-link">
            <AppHeaderDropdownAccnt />
          </span>
        </CNavItem>
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<i18n src="@/i18n/dist/components/layout/AppHeader.json"></i18n>
<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { logo } from '@/assets/brand/logo'
import { languages } from '@/app-data/languages'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
  },
  setup() {
    
    const { setLocale, } = useI18n()
    const switchLocalePath = useSwitchLocalePath();
    const { t } = useI18n()
    
    async function switchLocale (locale){
      setLocale(locale);
      const newLocalePath = switchLocalePath(locale);
      // console.log(locale, newLocalePath)
      await navigateTo(newLocalePath);
    }

    return { logo, t, languages, switchLocale }
  },
}
</script>
