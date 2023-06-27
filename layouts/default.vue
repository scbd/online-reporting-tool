<template>
    <TheContainer />
</template>

<script>
import TheContainer from './containers/TheContainer'

export default {
  components: {
    TheContainer
  },
  head(){
    return {
      htmlAttrs: {
        lang : this.$i18n.locale,
        dir : this.$i18n.locale == 'ar' ? 'rtl' : 'ltr',
      }
    }
  },
  methods:{
    // ...mapActions({
    //   initRealmConf : 'realmConf/initialize'
    // })
  },
  async fetch(){
    // await this.initRealmConf();
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<!-- <style src="bootstrap/dist/css/bootstrap.css"></style> -->