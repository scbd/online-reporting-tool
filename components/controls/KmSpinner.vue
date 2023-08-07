<template>
    <div class="km-spinner">
        <slot>
            <CSpinner  size="sm" variant="grow" v-bind="attrs"/> 
            <span v-if="message">{{ message }}</span>
            <span v-if="!message">{{t('loading')}}...</span>
        </slot>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/KmSpinner.json"></i18n>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
    const props = defineProps({
        message : { type:String}
    })
    const nuxtApp = useNuxtApp();
    const { t } = useI18n();
    const  attrs  = useAttrs()
    const { message } = toRefs(props);
    
</script>

<style>
</style>