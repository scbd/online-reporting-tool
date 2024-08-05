<template>
    <km-suspense>
        <view-document :identifier="identifier" v-if="identifier"></view-document>
    </km-suspense>

</template>

<script setup lang="ts">
    import { KmSuspense } from "@/components/controls";
    import viewDocument from '@/components/pages/database/view-document.vue';
    import { useRoute } from 'vue-router';
    import { SCHEMAS, ROLES } from '@/utils';

    definePageMeta({
        auth:false,
        breadcrumbs : {
            skip : ['identifier']
        }
    })

    const route      = useRoute();
    const identifier = computed(()=>{
        
        const identifier = route.params.identifier;

        const uidRegex = /(ORT(\-DEV)?)\-([A-Z]{2,3}[0-9])\-([A-Z]{2})\-([0-9]+)(\-[0-9]+)?/i;
        const matchedUId = identifier.match(uidRegex);
        
        if(matchedUId?.length > 4){
            return matchedUId[5];
        }

        return identifier;
    });

</script>

<style scoped>

</style>