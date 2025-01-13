<template>
    <CCard>
        <CCardHeader>{{ t('knowledgeBase') }}</CCardHeader>
        <CCardBody>
            <div class="text-center border-bottom-1">
                <h5>{{ t('welcome') }}</h5>
            </div>
           <article-list></article-list>
        </CCardBody>
   </CCard>
</template>
<i18n src="@/i18n/dist/pages/knowledge-base/index.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
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