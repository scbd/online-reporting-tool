<template>
    <small class="me-2 fs-6">
        <strong>{{t('publishedOn')}}</strong> {{formatDate(publishedOn)}}
    </small>
    <small class="me-2 fs-6" v-if="updatedOn!=publishedOn">
        {{t('updated')}} {{formatDate(updatedOn)}}
    </small>
</template>
<i18n src="@/i18n/dist/components/controls/search/document-dates.json"></i18n>
<script setup lang="ts">
//@ts-nocheck

    defineProps({
        publishedOn : { type:[String, Object], required:true },
        updatedOn   : { type:[String, Object], default:null }
    });

    const { t } = useI18n();
</script>
