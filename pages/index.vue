<template>
  <Dashboard />
</template>

<script>
import Dashboard from '~/pages/dashboard'

export default {
  components: {
    Dashboard,
  },
  auth:false,
  mounted(){
    this.$router.push('/dashboard')
  }
}
</script>
