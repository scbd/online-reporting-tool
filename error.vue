<template>
    <NuxtLayout>
      <template #error>
        <div class="nuxt-error">
            <component :is="errorPage" :error="error" />
        </div>
      </template>
    </NuxtLayout>
  </template>
  <script setup lang="ts">
//@ts-nocheck
    import error404 from '~/pages/error/404.vue';
    import error500 from '~/pages/error/500.vue';
    const props = defineProps({
        error: Object
    })
    
    const errorPage = computed(()=> {
        if (props?.error?.statusCode === 404) {
            return error404;
        }
        // catch everything else
        return error500;
    })
  </script>
  
  <style scoped>
  </style>