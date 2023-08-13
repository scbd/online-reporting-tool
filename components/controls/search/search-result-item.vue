<template>
    <CCard class="mb-3 border-left-3 border-left-info">
        <CCardBody>
            <CCardTitle>{{document.title_EN_s}}</CCardTitle>
            <CCardText>
                <span v-for="(target, index) in document.globalTargetAlignment_EN_ss" :key="target">
                    <strong class="text-muted">{{ target }}</strong>
                    <span class="m-2" v-if="index < document.globalTargetAlignment_EN_ss.length-1">|</span>
                </span>
            </CCardText>
            <CCardText>
                <small class="me-2 fs-6">{{document.schema_EN_s}}</small>|
                <small class="me-2 fs-6">{{document.government_EN_s}}</small>|
                <small class="me-2 fs-6">{{formatDate(document.updatedDate_dt)}}</small>
                
            </CCardText>
        </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
    const props = defineProps({
        document : {type:Object, required:true}
    })
</script>

<style scoped>

</style>