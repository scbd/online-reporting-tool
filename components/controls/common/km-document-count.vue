<template>
    <CRow>
        <CCol col="12" md="6" lg="4">
            <CCallout color="success" :title="t('published')" @click="selectedTab='published';$emit('on-published-click')" :class="{'bg-success active':selectedTab=='published'}" style="cursor: pointer;">
                <small class="text-muted me-2">{{t('published')}}</small>
                <strong class="h4 float-end">{{publishedCount}}
                <font-awesome-icon icon="fa-filter" class="ps-2 float-end" /></strong>
            </CCallout>
            </CCol>
            <CCol col="12"  md="6" lg="4">
                <CCallout color="secondary" :title="t('draft')" @click="selectedTab='draft';$emit('on-draft-click')" :class="{'bg-secondary active':selectedTab=='draft'}" style="cursor: pointer;">
                    <small class="text-muted me-2">{{t('draft')}}</small>
                    <strong class="h4 float-end">{{draftCount}}
                    <font-awesome-icon icon="fa-filter" class="ps-2 float-end" /></strong>
                </CCallout>
            </CCol>
            <CCol col="12"  md="6" lg="4">
                <CCallout color="danger" :title="t('requested')" @click="selectedTab='requested';$emit('on-requested-click')" :class="{'bg-danger active':selectedTab=='requested'}" style="cursor: pointer;">
                    <small class="text-muted me-2">{{t('requested')}}</small>
                    <strong class="h4 float-end">{{ requestCount }}
                    <font-awesome-icon icon="fa-filter" class="ps-2 float-end" /></strong>
                </CCallout>
            </CCol> 
    </CRow>
</template>
<i18n src="@/i18n/dist/components/controls/common/km-document-count.json"></i18n>
<script setup lang="ts">
//@ts-nocheck

    defineProps({
        publishedCount  : {type:Number, default:0},
        draftCount      : {type:Number, default:0},
        requestCount    : {type:Number, default:0}
    })

    const {t} = useI18n();
    const selectedTab = ref('published');

</script>

<style lang="scss" scoped>

</style>