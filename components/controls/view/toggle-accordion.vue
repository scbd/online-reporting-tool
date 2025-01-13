<template>    
    <CButton class="btn-xs" color="primary" size="sm" @click="toggle()" v-if="selector">
        <span v-if="!accordionOpen"><font-awesome-icon icon="fa-arrows-down-to-line"></font-awesome-icon> {{ t('expandAll') }}</span>
        <span v-if="accordionOpen" ><font-awesome-icon icon="fa-arrows-up-to-line"></font-awesome-icon> {{ t('collapseAll') }}</span>
    </CButton>
</template>

<i18n src="@/i18n/dist/components/controls/view/toggle-accordion.json"></i18n>
<script setup lang="ts">
    import $ from 'jquery';
    import { useI18n } from 'vue-i18n';

    const { t }         = useI18n();
    const accordionOpen = ref(false);
    const { selector }  = useAttrs();

    defineExpose({toggle})
    
    function toggle(open){
        if(!selector)
            return;

        accordionOpen.value = open || !accordionOpen.value;
        const buttons = $(selector);
        buttons.each(function(){
            const ariaExpanded = $(this)[0].ariaExpanded == "true";
            if((accordionOpen.value && ariaExpanded) || (!accordionOpen.value && !ariaExpanded))
                $(this).click();
        })
    }

</script>

<style lang="scss" scoped>

</style>