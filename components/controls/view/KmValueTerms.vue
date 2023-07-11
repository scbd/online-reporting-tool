<template>
    <div id="km-terms" class="d-grid gap-1"> 
        <div v-for="term in value" :key="term">
            <km-value-term :value="term" :locale="locale"></km-value-term> 
        </div>  
    </div>
</template>

<script setup lang="ts">
    // import { direction, lstringLocale, lstring } from '@/util/filter';
    import KmValueTerm from './KmValueTerm.vue';

    const props = defineProps({
        value  : {type:[Array, Object], required:true },
        locale      : {type:String, required:true },
    })
    const { value, locale } = toRefs(props);

</script>

<style scoped>

</style>