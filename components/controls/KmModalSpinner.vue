<template>
    <CModal class="show d-block" alignment="center" backdrop="static" :visible="modalProps.visible" >
        <CModalHeader :close-button="false">
            <CModalTitle>{{modalProps.title|| t('processing')}}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <slot>
                <CSpinner/> 
                <span class="ms-1" v-if="message">{{ message }}</span>
                <span class="ms-1" v-if="!message">{{t('loading')}}...</span>
            </slot>
        </CModalBody>           
    </CModal>
</template>

<i18n src="@/i18n/dist/components/controls/KmModalSpinner.json"></i18n>
<script setup lang="ts">
    import { useI18n } from 'vue-i18n';
    const props = defineProps({
        visible : { type:Boolean, default:false},
        title   : { type:String},
        message : { type:String}
    })

    const nuxtApp = useNuxtApp();
    const { t } = useI18n();

    const modalProps  = ref(props)
    
</script>

<style>
.modal-backdrop.fade,
.modal-backdrop.show{
    opacity: 0.5;
}
</style>