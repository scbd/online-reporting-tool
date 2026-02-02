<template>
   <div class="row">
        <div class="col-12 mb-1">
            <pdf-section  class="me-md-2 btn-secondary float-end" :element="printSelector" :title="title" ref="pdfSectionRef" 
                @on-pdf-document="onPdfDocument" @on-after-pdf="onAfterPdf"></pdf-section>
            <print-section  class="me-md-2 btn-secondary float-end" :element="printSelector" :title="title" ref="printSectionRef" 
                @on-print-document="onPrintDocument" @on-before-print="onBeforePrint" @on-after-print="onAfterPrint"></print-section>
        </div>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck

    const pdfSectionRef = ref();
    const printSectionRef = ref();

    const props = defineProps({
        printSelector : {type: String, required:true},
        title   : {type: String, required:true},
        fileName: {type: String, required:true},
    });

    defineExpose({
        pdfSection : {
            get pdfDocument() { 
                return pdfSectionRef.value?.pdfDocument
            }
        },
        printSection : {
            get pdfDocument() { 
                return printSectionRef.value?.pdfDocument
            }
        }
    })
    const emit = defineEmits(['onPrintDocument', 'onAfterPrint',    
                                'onBeforePrint', 'onPdfDocument', 'onAfterPdf']);

    const onPrintDocument = () => {
        emit('onPrintDocument');
    }
    const onBeforePrint = () => {
        emit('onBeforePrint');
    }
    const onAfterPrint = () => {
        emit('onAfterPrint');
    }

    const onPdfDocument = () => {
        emit('onPdfDocument');
    }    
    const onAfterPdf = () => {
        emit('onAfterPdf');
    }   
</script>

<style scoped>

</style>