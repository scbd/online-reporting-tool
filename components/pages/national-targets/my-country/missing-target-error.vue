<template>
    <CAlert color="danger" class="d-flex align-items-center">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
        <span class="p-2">
            <slot name="message">
                Your country has not submitted any national targets for this Global Goal/Target.
            </slot>
        </span>
        <br/>
        <btn-new-target :query="query" :identifier="identifier"></btn-new-target>        
    </CAlert>
</template>

<script setup lang="ts">
    import btnNewTarget from './btn-new-target.vue';
    
    const props = defineProps({
        identifier   : { type:String, required:false},
        query : { type:Object, required:false}
    });

    const { query, identifier } = toRefs(props);
    

</script>

<style scoped>

</style>