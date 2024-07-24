<template>
   <div class="row">
        <div class="col-12 mb-1">
            <pdf-section  class="me-md-2 btn-secondary float-end" :element="printSelector" :title="title" ></pdf-section>
            <print-section  class="me-md-2 btn-secondary float-end" :element="printSelector" :title="title"></print-section>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        printSelector : {type: String, required:true},
        title   : {type: String, required:true},
        fileName: {type: String, required:true},
    });
</script>

<style scoped>

</style>