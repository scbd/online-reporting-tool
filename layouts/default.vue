<template>
  <div>
    <authIframe></authIframe>
    <TheContainer />
  </div>  
</template>

<script>
import TheContainer from './containers/TheContainer'
import authIframe from '~/components/controls/auth-iframe.vue';

export default {
  components: {
    TheContainer,
    authIframe
  }
}
</script>
