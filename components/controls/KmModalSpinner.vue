<template>
    <CModal class="show d-block" alignment="center" backdrop="static" :visible="modalProps.visible" >
        <CModalHeader close-button="false">
            <CModalTitle>{{modalProps.title|| t('processing')}}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <slot>
                <CSpinner/> 
                <span v-if="message">{{ message }}</span>
                <span v-if="message">{{t('loading')}}...</span>
            </slot>
        </CModalBody>           
    </CModal>
</template>

<i18n src="@/i18n/dist/components/controls/KmModalSpinner.json"></i18n>
<script setup lang="ts">
    const props = defineProps({
        visible : { type:Boolean, default:false},
        title   : { type:String},
        message : { type:String}
    })

    const nuxtApp = useNuxtApp();
    const { t } = nuxtApp.$i18n;

    const modalProps  = ref(props)
    
</script>

<style>
.modal-backdrop.fade,
.modal-backdrop.show{
    opacity: 0.5;
}
</style>