<template>
  <cbd-footer></cbd-footer>
  <CFooter>
    <div>
      <a href="https://ort.cbd.int" target="_blank">ORT</a>
       &nbsp;      
      <a href="https://chm.cbd.int" target="_blank">CHM</a>
    </div>
    <div>
      <span class="ms-1">&copy; {{ new Date().getFullYear() }} <a href="https://cbd.int" target="_blank">SCBD</a>.</span>
    </div>
  </CFooter>
</template>

<script>
import cbdFooter from './cbd/footer.vue'

export default {
  name: 'AppFooter',
  components: {cbdFooter}
}
</script>
