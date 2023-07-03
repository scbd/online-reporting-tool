<template>
    <div>
     Welcome to ORT
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'Home',
    components: {
    },
    async setup() {
      const localePath = useLocalePath()
      await navigateTo(localePath('/dashboard'))
    },
  }
  </script>
  