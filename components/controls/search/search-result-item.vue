<template>
    <km-link :to="viewUrl(document)" :target="linkTarget" class="unset-anchor search-item" title="">
        <CCard class="mb-3 border-left-3 border-left-info">
            <CCardBody>
                <CCardTitle>{{document.recTitle}}</CCardTitle>
                <CCardText>
                    <div class="limited-text">{{ document.recSummary }}</div>
                    <div class="mt-2">
                        <span v-for="(target, index) in document.globalTargetAlignment_ss" :key="target">
                            <strong class="text-muted">{{ target }}</strong>
                            <span class="m-2" v-if="index < document.globalTargetAlignment_ss.length-1">|</span>
                        </span>
                        <span v-for="(target, index) in document.globalGoalAlignment_ss" :key="target">
                            <span class="m-2" v-if="document.globalTargetAlignment_ss.length">|</span>
                            <strong class="text-muted">{{ target }}</strong>
                            <span class="m-2" v-if="index < document.globalGoalAlignment_ss.length-1">|</span>
                        </span>
                        <span v-if="document.globalGoalOrTarget_s">
                            <strong class="text-muted">{{ document.globalGoalOrTarget_s }}</strong>
                        </span>
                    </div>
                </CCardText>
                <CCardText>
                    <small class="me-2 fs-6">{{document.schema_EN_s}}</small>|
                    <small class="me-2 fs-6">{{document.government_EN_s}}</small>|
                    <small class="me-2 fs-6">{{formatDate(document.recDate)}}</small>
                    
                </CCardText>
            </CCardBody>
        </CCard>
    </km-link>
</template>

<script setup lang="ts">
//@ts-nocheck
    import KmLink from '../KmLink.vue';
    import { SCHEMAS } from '@/utils';
    const props = defineProps({
        document : {type:Object, required:true},
        linkTarget : {type:String, default:'_blank'}
    });

    const { $appRoutes:appRoutes } = useNuxtApp();

    const viewUrl = (document:Object)=>{
        let url = ''
        if(document.schema_s == SCHEMAS.NATIONAL_TARGET_7)
            url = appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_VIEW;
        else if(document.schema_s == SCHEMAS.NATIONAL_TARGET_7_MAPPING)
            url = appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II_VIEW;
        else if(document.schema_s == SCHEMAS.NATIONAL_NBSAP)
            url = appRoutes.NATIONAL_REPORTS_NBSAP_MY_COUNTRY_VIEW;
        else if(document.schema_s == SCHEMAS.NATIONAL_REPORT_7)
            url = appRoutes.NATIONAL_REPORTS_NR7_VIEW;
            
        const path = url.replace(':identifier', document.identifier_s);

        return path;
    }
</script>

<style scoped>
    
    .limited-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;  /* Number of lines displayed before it truncate */
        overflow: hidden;
    }
</style>