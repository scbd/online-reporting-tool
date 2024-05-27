<template>
    
    <button :disabled="!element" type="button" class="btn btn-primary" 
        @click="onPrintDocument" >
        <font-awesome-icon icon="print"></font-awesome-icon> {{ t('print') }}
        <km-modal-spinner :visible="isPrinting" class="text-dark"
            title="Printing" :message="t('preparePrinting')"></km-modal-spinner>
    </button>  

    <div id="advancePrint" class=" d-none h-0">
        <div class="cbd-user-print">
            <print-header></print-header>
            <div id="cbd-user-print-section" v-if="isPrinting">
                <div v-html="userPrintHtml"></div>
            </div>
            <print-footer></print-footer>
        </div>
    </div>
</template>
<i18n src="@/i18n/dist/components/common/print-section.json"></i18n>
<script setup lang="ts">
    // import { useVueToPrint } from "vue-to-print";
    // import $ from 'jquery';
    
    const props = defineProps({
        element : {type: String, required:true},
        title   : {type: String, required:true},
    });

    const emit = defineEmits(['onPrintDocument', 'onAfterPrint', 'onBeforeGetContent',
                                'onBeforePrint']);

    const {t}             = useI18n();
    const isPrinting      = ref(false);
    const userPrintHtml   = ref(null);

    async function onPrintDocument(){
        import('print-this');
        emit('onPrintDocument');
        
        isPrinting.value = true;
        await sleep(200);
        userPrintHtml.value = document.querySelector(props.element).innerHTML;
        await sleep(200);
        
        $('.cbd-user-print').printThis({
            debug:false,
            printContainer:true,
            importCSS:true,
            importStyle : true,
            pageTitle : $('title').text(),
            // loadCSS : '/app/css/print-friendly.css',
            beforePrint: onBeforePrint,
            afterPrint: onAfterPrint   
        });	
    }

    function onAfterPrint(){
        userPrintHtml.value = null;
        isPrinting.value = false
        emit('onAfterPrint')
    }

    function onBeforePrint(){
        emit('onBeforePrint')
    }
</script>

<style scoped>

    .h-0{
        display: block;
        height: 0px!important;
        overflow: scroll;
    }

    .cbd-user-print{
        padding:20px;
        background-color: #fff;
    }
</style>