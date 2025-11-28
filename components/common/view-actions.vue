<template>
   <div class="row">
        <div class="col-12 mb-1">
            <pdf-section  class="me-md-2 btn-secondary float-end" :element="printSelector" :title="title" ref="pdfSectionRef" ></pdf-section>
            <print-section  class="me-md-2 btn-secondary float-end" :element="printSelector" :title="title" ref="printSectionRef"></print-section>
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

</script>

<style scoped>

</style>