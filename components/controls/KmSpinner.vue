<template>
    <div class="km-spinner" :class="{'d-flex justify-content-center' : alignCenter}">
        <slot>
            <!-- <font-awesome-icon icon="yin-yang" spin size="xl" ></font-awesome-icon> -->
            <img src="/cbd-gbf-logo.jpeg" class="rotate" width="25" height="25" />
            <!-- <CSpinner  size="sm" variant="grow" v-bind="attrs"/>  -->
            <span class="ms-1" v-if="message">{{ message }}</span>
            <span class="ms-1" v-if="!message">{{t('loading')}}...</span>
        </slot>
    </div>
</template>
<i18n src="@/i18n/dist/components/controls/KmSpinner.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
import { useI18n } from 'vue-i18n';
    const props = defineProps({
        message : { type:String}
    })
    const nuxtApp = useNuxtApp();
    const { t } = useI18n();
    const  attrs  = useAttrs()
    const { message } = toRefs(props);

    const alignCenter = attrs.hasOwnProperty('center');
    
</script>

<style scoped>
    .rotate {
        animation: rotation 3s infinite linear;
    }

    @keyframes rotation {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(359deg);
        }
    }

</style>