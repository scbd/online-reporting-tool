<template>
  <Dashboard />
</template>

<script>
import Dashboard from './dashboard.vue'

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
