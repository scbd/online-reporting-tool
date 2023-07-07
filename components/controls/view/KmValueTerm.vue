<template>
    <div id="km-term"> 
        <div :class="`input-group input-lang-${locale}`">
    
            <CAlert color="danger" v-if="error">Error loading term {{ value.identifier }}</CAlert>
            <div class="form-control km-value" 
                :dir="direction(term.title, locale)" aria-describedby="basic-addon1">
                {{ lstring(term.title, locale) }}
            </div>
            <span class="input-group-text" id="basic-addon1" style="cursor:default">
                {{ lstringLocale(term.title, locale).toUpperCase() }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { direction, lstringLocale, lstring } from '@/util/filter';

    const props = defineProps({
        value  : {type:Object, required:true },
        locale      : {type:String, required:true },
    })
    const { value, locale } = toRefs(props);

    const { $api } = useNuxtApp();

    let term:any;
    let error:any
    if(!value.value?.identifier || value.value){

        ({ data:term, error:error } = await $api.thesaurus.getTerm(value.value?.identifier||value.value))
        

        if(error.value)
            console.error(`Error loading term ${value.value}`, error);

    }

</script>

<style scoped>

</style>