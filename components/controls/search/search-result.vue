<template>
    <div v-for="document in documents" :key="document.id">
        <search-result-item :document="document"></search-result-item>
    </div>
</template>

<script setup lang="ts">
    import searchResultItem from './search-result-item.vue';

    const props = defineProps({
        documents : {type:Array<Object>, required:true}
    })
</script>

<style scoped>

</style>