<template>
    <CRow>
        <CCol col="12" md="6" lg="4">
            <CCallout color="success" :title="t('published')">
                <small class="text-muted me-2">{{t('published')}}</small>
                <strong class="h4 float-end">{{publishedCount}}</strong>
            </CCallout>
            </CCol>
            <CCol col="12"  md="6" lg="4">
                <CCallout color="dark" :title="t('draft')">
                    <small class="text-muted me-2">{{t('draft')}}</small>
                    <strong class="h4 float-end">{{draftCount}}</strong>
                </CCallout>
            </CCol>
            <CCol col="12"  md="6" lg="4">
                <CCallout color="danger" :title="t('requested')">
                    <small class="text-muted me-2">{{t('requested')}}</small>
                    <strong class="h4 float-end">{{ requestCount }}</strong>
                </CCallout>
            </CCol> 
    </CRow>
</template>
<i18n src="@/i18n/dist/components/controls/common/km-document-count.json"></i18n>
<script setup lang="ts">

    defineProps({
        publishedCount  : {type:Number, default:0},
        draftCount      : {type:Number, default:0},
        requestCount    : {type:Number, default:0}
    })

    const {t} = useI18n();

</script>

<style lang="scss" scoped>

</style>