<template>
    <CAlert color="danger" class="d-flex align-items-center">
        <CIcon icon="cil-burn" class="flex-shrink-0 me-2" width="24" height="24" />
        <div>
            Your country has not submitted any national targets for this Global Goal/Target.
            <br/>
            <btn-new-target :global-target="globalTarget" :identifier="identifier"></btn-new-target>
        </div>
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