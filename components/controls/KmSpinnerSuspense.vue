<template>
    <div class="km-spinner-suspense">
        <slot>
            <div class="d-grid gap-2 d-md-flex justify-content-center">
                <CButton disabled>
                    <km-spinner component="span" size="sm" variant="grow" aria-hidden="true"
                    :message="t('loadingSuspense')"/>
                </CButton>
            </div>
        </slot>
    </div>
</template>

<i18n src="@/i18n/dist/components/controls/KmSpinnerSuspense.json"></i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
    import KmSpinner from './KmSpinner.vue';
    const nuxtApp = useNuxtApp();
    const { t } = useI18n();
</script>

<style>
</style>