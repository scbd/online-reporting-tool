<template>
   <view-target v-if="identifier" :identifier="identifier"></view-target>
</template>

<script setup lang="ts">
  import viewTarget from '@/components/pages/nbsap-targets/view-target.vue';

  const route           = useRoute();
  const identifier = route.params.identifier;


</script>

<style scoped>

</style>