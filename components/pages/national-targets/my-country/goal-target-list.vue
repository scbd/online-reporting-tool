<template>
    <ul v-if="props.goalTargets">
        <li v-for="item in props.goalTargets" :key="item.identifier">
            <a v-if="item.identifier.startsWith('GBF-GOAL')" href="https://www.cbd.int/gbf/goals/" target="_blank">{{ item.identifier }}</a> 
            <a v-if="item.identifier.startsWith('GBF-TARGET')" :href="`https://www.cbd.int/gbf/targets/${getTargetNumber(item.identifier)}`" 
                target="_blank">{{ item.identifier }}</a> 
        </li>
    </ul>
</template>

<script setup lang="ts">
    const props = defineProps({
        goalTargets : {type:Array<ETerm>, required:true}
    });

</script>

<style scoped>

</style>