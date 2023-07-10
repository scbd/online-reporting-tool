<template>
    <div id="km-value-ml"> 
        <div :class="`input-group input-lang-${locale}`">
    
            <div v-if="type=='string'" class="form-control km-value km-value-ml-div" 
                :dir="direction(valueLstring, locale)" aria-describedby="basic-addon1">
                {{ valueLstring }}
            </div>
            <div v-if="type=='html'" class="form-control km-value km-value-ml-div" 
                :dir="direction(valueLstring, locale)" aria-describedby="basic-addon1" v-html="valueLstring">                
            </div>
            <span class="input-group-text" id="basic-addon1" style="cursor:default">
                {{ valueLocale.toUpperCase() }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { direction, lstringLocale, lstring } from '@/util/filter';

    const props = defineProps({
        value  : {type:Object, required:true },
        locale      : {type:String, required:true },
        type        : {type:String, default:'string' },
    })
    const { value, locale, type } = toRefs(props);

    const valueLocale   = computed(()=>lstringLocale(value.value, locale.value));
    const valueLstring  = computed(()=>lstring(value.value, locale.value));
    
</script>

<style scoped>
   
</style>