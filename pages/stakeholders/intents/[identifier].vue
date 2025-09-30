<template>
    <km-suspense>
      <div class="print-section">
        <view-intent v-if="identifier" :identifier="identifier" ></view-intent>
      </div>
    </km-suspense>

</template>

<script setup lang="ts">

  import { useRoute } from 'vue-router';

  const route      = useRoute();
  const identifier = ref<string>(route.params.identifier as string || '');
  
  definePageMeta({
    breadcrumbs : {
      skip : ['identifier']
    }
  });

</script>

<style scoped>

</style>