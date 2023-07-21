<template>
    <CAlert color="danger" class="d-flex align-items-center">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
        <span class="p-2">Your country has not submitted any national targets for this Global Goal/Target.</span>
        <br/>
        <btn-new-target :global-target="globalTarget" :identifier="identifier"></btn-new-target>        
    </CAlert>
</template>

<script setup lang="ts">
    import btnNewTarget from './btn-new-target.vue';
    
    const props = defineProps({
        identifier   : { type:String, required:false},
        globalTarget : { type:String, required:false}
    });

    const { globalTarget, identifier } = toRefs(props);
    

</script>

<style scoped>

</style>