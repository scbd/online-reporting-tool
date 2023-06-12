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
  }
}
</script>
