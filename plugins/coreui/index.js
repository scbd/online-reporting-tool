import Vue from 'vue'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons/icons.js'

export default ({ app }) => {
  Vue.use(CoreuiVue)
  Vue.component('CIcon', CIcon)
  app.icons = icons
}