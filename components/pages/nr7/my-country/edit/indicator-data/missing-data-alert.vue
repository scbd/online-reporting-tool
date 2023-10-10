<template>
    <CAlert color="danger" class="d-flex align-items-center">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="1x"/>
        <slot name="message">
            Your country has not submitted any data for this Indicator.
        </slot>        
    </CAlert>
</template>

<script setup lang="ts">
    // import btnNewTarget from './btn-new-target.vue';
    
    const props = defineProps({
        identifier   : { type:String, required:false},
        query : { type:Object, required:false}
    });

    const { query, identifier } = toRefs(props);
    

</script>

<style scoped>

</style>