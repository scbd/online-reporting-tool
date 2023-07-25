<template>
    <div class="km-value form-control">
        <slot>
            {{ value }}
        </slot>
    </div>
</template>

<script setup lang="ts">
    // import { direction, lstringLocale, lstring } from '@/util/filter';

    const props = defineProps({
        value  : {type:String }
    })
    const { value } = toRefs(props);
    
</script>

<style scoped>
   
</style>