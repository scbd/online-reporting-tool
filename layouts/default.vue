<template>
  <div>    
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100 bg-light">
      <AppHeader />
      <div class="body flex-grow-1 px-3">
        <CContainer fluid>
          <router-view />
        </CContainer>
      </div>
      <AppFooter />      
    </div>
  </div>
</template>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'

export default {
  name: 'DefaultLayout',
  components: {
    AppFooter,
    AppHeader,
    AppSidebar,
    CContainer,
  },
  setup(){
    const head = useLocaleHead({
      addDirAttribute: true,      // Adds dir
      addSeoAttributes: true,     // Adds lang
    })
    const { locale } = useI18n();
    useHead({
      htmlAttrs: {
        lang : locale.value,
        dir  : locale.value === 'ar' ? 'rtl' : 'ltr',
      }
    })
  }
}
</script>
