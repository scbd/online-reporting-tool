import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('coreui plugin')
  nuxtApp.vueApp.use(CoreuiVue);
  nuxtApp.vueApp.component('CIcon', CIcon);
  nuxtApp.vueApp.provide('icons', icons);
})