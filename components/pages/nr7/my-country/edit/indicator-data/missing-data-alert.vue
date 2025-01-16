<template>
    <CAlert color="danger" class="d-flex align-items-center">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="1x"/>
        <slot name="message">
            {{ t('noCountryIndicator') }}
        </slot>        
    </CAlert>
</template>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/indicator-data/missing-data-alert.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    // import btnNewTarget from './btn-new-target.vue';
    const {t} = useI18n();
    const props = defineProps({
        identifier   : { type:String, required:false},
        query : { type:Object, required:false}
    });

    const { query, identifier } = toRefs(props);
    

</script>

<style scoped>

</style>