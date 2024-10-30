<template>
    <CCard>
        <CCardHeader>{{t('workflowRequestsTitle')}}</CCardHeader>
        <CCardBody>
            <workflow-requests></workflow-requests>
        </CCardBody>
    </CCard>
</template>
<i18n src="@/i18n/dist/pages/workflows/requests.json"></i18n>
<script setup lang="ts">
  const {t} = useI18n();
</script>

<style scoped>

</style>