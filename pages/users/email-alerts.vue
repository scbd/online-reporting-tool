<template>
    <CCard>
        <CCardHeader>{{t('alerts')}}</CCardHeader>
        <CCardBody>
            <CCard>
                <CCardBody>
                    <frequency></frequency>
                </CCardBody>
            </CCard>

            <CCard class="mt-2">
                <CCardBody>
                    <subscribe-email-alerts></subscribe-email-alerts>
                </CCardBody>
            </CCard>
        </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
//@ts-nocheck

    const {t} = useI18n();
    definePageMeta({
            auth:true
    });
</script>

<style scoped>

</style>