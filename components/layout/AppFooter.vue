<template>
  <cbd-footer></cbd-footer>
  <CFooter>
    <div>
      <a href="https://ort.cbd.int" target="_blank">{{ t('ort') }}</a>
       &nbsp;      
      <a href="https://chm.cbd.int" target="_blank">{{ t('chm') }}</a>
    </div>
    <div>
      <span class="ms-1">&copy; {{ new Date().getFullYear() }} <a href="https://cbd.int" target="_blank">{{ t('scbd')}}</a>.</span>
    </div>
  </CFooter>
</template>
<i18n src="@/i18n/dist/components/layout/AppFooter.json"></i18n>

<script lang="ts">
import cbdFooter from './cbd/footer.vue'

export default {
  name: 'AppFooter',
  components: {cbdFooter},
  setup(){
          const { t } = useI18n();
          return { t };
  },
}
</script>
