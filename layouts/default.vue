<template>
    <TheContainer />
</template>

<script>
import TheContainer from './containers/TheContainer'
import { mapActions } from 'vuex';

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
    ...mapActions({
      initRealmConf : 'realmConf/initialize'
    })
  },
  async fetch(){
    await this.initRealmConf();
  }
}
</script>
