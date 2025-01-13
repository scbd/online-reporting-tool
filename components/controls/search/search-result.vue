<template>
    <div v-for="document in documents" :key="document.id">
        <search-result-item :document="document" link-target="linkTarget"></search-result-item>
    </div>
</template>

<script setup lang="ts">
//@ts-nocheck
    import searchResultItem from './search-result-item.vue';

    const props = defineProps({
        documents : {type:Array<Object>, required:true},
        linkTarget : {type:String, default:'_blank'}
    })
</script>

<style scoped>

</style>