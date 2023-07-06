<template>
    <div id="km-value-ml"> 
        <div :class="`input-group input-lang-${locale}`">
    
            <div v-if="type=='string'" class="form-control km-value km-value-ml-div" 
                :dir="direction(modelValue, locale)" aria-describedby="basic-addon1">
                {{ value }}
            </div>
            <div v-if="type=='html'" class="form-control km-value km-value-ml-div" 
                :dir="direction(modelValue, locale)" aria-describedby="basic-addon1" v-html="value">                
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
        modelValue  : {type:Object, required:true },
        locale      : {type:String, required:true },
        type        : {type:String, default:'string' },
    })
    const { modelValue, locale, type } = toRefs(props);

    const valueLocale = computed(()=>lstringLocale(modelValue.value, locale.value));
    const value   = computed(()=>lstring(modelValue.value, locale.value));
    
</script>

<style scoped>
    .km-value{
        background-color: #f5f5f5!important;
        border: 1px solid #ccc!important;
        border: 1px solid rgba(0, 0, 0, 0.15)!important;
        color:#333;
    }
</style>