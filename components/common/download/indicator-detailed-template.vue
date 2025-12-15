<template>
    <div class="alert alert-info" v-if="detailIndicatorTemplateMapping[indicator.identifier]">
        <strong>{{t('optional')}}</strong>
        <div>
            {{ t('newIndicatorTemplates') }}
            <a :href="detailIndicatorTemplateMapping[indicator.identifier]" target="_blank">
                {{ t('download') }}  
                <font-awesome-icon icon="fa-download"></font-awesome-icon>                                                            
            </a>
        </div>
    </div>
</template>

<i18n src="@/i18n/dist/components/common/download/indicator-detailed-template.json"></i18n>

<script setup lang="ts">

    const props = defineProps({
        indicator: { type: Object, required: true }
    });

    const detailIndicatorTemplateMapping:Record<string, string> = {
        "GBF-INDICATOR-2.1"  : "/excel-templates/GBF-INDICATOR-2.1.xlsx",
        "GBF-INDICATOR-2.2"  : "/excel-templates/GBF-INDICATOR-2.1.xlsx", //obsolete and use 2.1
        "GBF-INDICATOR-12.1" : "/excel-templates/GBF-INDICATOR-12.1.xlsx",
        "GBF-INDICATOR-A.1"  : "/excel-templates/GBF-INDICATOR-A.1.xlsx",
        "GBF-INDICATOR-A.2"  : "/excel-templates/GBF-INDICATOR-A.2.xlsx",
        "GBF-INDICATOR-B1"   : "/excel-templates/GBF-INDICATOR-B1.xlsx"
    }

    const { t, locale } = useI18n();
    
</script>

<style scoped>

</style>