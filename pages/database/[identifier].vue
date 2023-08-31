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
    const identifier = route.params.identifier;

</script>

<style scoped>

</style>