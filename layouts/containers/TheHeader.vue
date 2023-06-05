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
        <CHeaderNavLink :to="localePath('/dashboard')"> {{$t('header.menuDashboard')}} </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink :to="localePath('/nbsaps-targets')" exact>
          {{$t('header.menuNbsapTargets')}} 
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink :to="localePath('/national-reports/nr7/edit')">
          {{$t('header.menu7Nr')}} 
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink target="_blank" href="https://chm.cbd.int">
          CHM
        </CHeaderNavLink>
      </CHeaderNavItem>
    </CHeaderNav>
    <CHeaderNav class="mr-1">
      <!-- <CHeaderNavItem class="d-md-down-none mx-2">
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
      </CHeaderNavItem> -->
      <TheHeaderDropdownAccnt />
      <CDropdown
        in-nav
        class="c-header-nav-items"
        placement="bottom-end"
        add-menu-classes="pt-0"
      >
        <template #toggler>
          <CHeaderNavLink>
            <div><CIcon name="cil-globe-alt" /> {{languages[$i18n.locale]}}</div>
          </CHeaderNavLink>
        </template>
        <CDropdownHeader tag="div" class="text-center" color="light">
          <strong>{{$t('header.languages')}}</strong>
        </CDropdownHeader>

        <CDropdownItem v-for="(locale, key) in languages" v-bind:key="key"  @click="switchLocale(key)"> {{locale}} </CDropdownItem>        

      </CDropdown>
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
  data(){
    return {
      languages : {
            "ar" : "العربية",
            "zh" : "中文",
            "en" : "English",
            "es" : "Español",
            "fr" : "Françai",
            "ru" : "Русский"
        }
    }
  },
  async fetch () { //Nuxt event to load async data at initial step
    await this.$loadLocaleFile(this.$i18n.locale, `layouts/containers/TheHeader.json`);  
  },
  mounted(){
   
    let dir = 'ltr';      
    if(this.$i18n.locale == 'ar'){
      dir="rtl"
    }
    document.querySelector('html').setAttribute('lang', this.$i18n.locale)
    document.querySelector('html').setAttribute('dir' , dir)  
  },
  methods : {
    switchLocale(locale){

      this.$i18n.setLocale(locale);
      // let dir = 'ltr';
      
      // if(locale == 'ar'){
      //   dir="rtl"
      // }

      // document.querySelector('html').setAttribute('lang', locale)
      // document.querySelector('html').setAttribute('dir' , dir)
      
      // Get path to switch current route for selected locale
      const switchLocalePath = this.switchLocalePath(locale);
      this.$router.push(switchLocalePath);
      setTimeout(()=>window.location.reload(), 50);
    }
  },
  // i18n: { messages:{ [this.$i18n.locale]: i18n }} 
}
</script>
