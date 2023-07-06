<template>
  <div>
    This is target view


    <km-locales :locales="document.header.languages" v-model="selectedLocale"></km-locales>
    <km-lstring-value v-model="document.title" :locale="selectedLocale"></km-lstring-value>
    <km-lstring-value type="html" v-model="document.mainPolicyOfMeasureOrActionInfo" :locale="selectedLocale"></km-lstring-value>

  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>