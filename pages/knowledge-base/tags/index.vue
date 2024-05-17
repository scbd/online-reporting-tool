<template>
    <CCard>
        <CCardHeader>Knowledge base</CCardHeader>
        <CCardBody>
           Welcome to ORT knowledge base!
        </CCardBody>
   </CCard>
</template>

<script setup lang="ts">
   import {useRoute } from 'vue-router';

   const {t} = useI18n();
   const route = useRoute()

   definePageMeta({
       auth:false
   })

   function articleQuery(){
       const ag = [];
       if (isObjectId(route.params?.identifier))
           ag.push({ $match: { _id: mapObjectId(route.params.identifier) } });        
       
       return {
           "ag" : JSON.stringify(ag)
       };
   }

</script>

<style lang="scss" scoped>

</style>