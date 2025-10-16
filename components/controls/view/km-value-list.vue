<template>
    <div id="km-value-list">
        <km-value v-for="(item, index) in value" :key="index" :value="item" class="mb-1"/>
    </div>
</template>

<script setup lang="ts">

    const props = defineProps({
        value  : {type:Array<string>, required:true }
    })

    const { value } = toRefs(props);    


</script>