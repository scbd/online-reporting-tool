<template>
    <a href="#" @click="downloadExcel"  v-if="data?.length">
        {{ t('download') }}  
        <font-awesome-icon icon="fa-download"></font-awesome-icon>                                                            
    </a>
</template>
<i18n src="@/i18n/dist/components/common/download/download-data.json"></i18n>

<script setup lang="ts">
    import writeXlsxFile from 'write-excel-file';

    const props = defineProps({
        headers: { type: Array<Object>, required: true },
        data: { type: Array<Array<Object>>, required: true },
        fileName: { type: String, default: 'indicator-data' }
    });
    const { t, locale } = useI18n();

    const downloadExcel = async () => {
        if (!props.data || props.data.length === 0) {
            alert(`No data to download`);
            return;
        }
        await writeXlsxFile([props.headers, ...props.data], { fileName: `scbd-ort-${props.fileName}.xlsx`}); 
    }    
</script>

<style scoped>

</style>