<template>
    <div id="km-term"> 
        <div :class="`input-group input-lang-${locale}`">
    
            <CAlert color="danger" v-if="error">Error loading term {{ modelValue.identifier }}</CAlert>
            <div class="form-control km-value" 
                :dir="direction(lstringTerm, locale)" aria-describedby="basic-addon1">
                {{ lstringTerm }}
            </div>
        </div>
    </div>
    <div class="km-term">
        
    </div>
</template>

<script setup lang="ts">
    import { direction, lstringLocale, lstring } from '@/util/filter';
import { log } from 'console';

    const props = defineProps({
        modelValue  : {type:Object, required:true },
        locale      : {type:String, required:true },
    })
    const { modelValue, locale } = toRefs(props);

    const { $api } = useNuxtApp();

    // if(modelValue.value.identifier){

        const { data:term, error } = await $api.thesaurus.getTerm(modelValue.value.identifier)
        
        if(error.value)
            console.error(`Error loading term ${modelValue.value}`, error);

    // }

    const lstringTerm = computed(()=>{        
        return lstring(term?.title, locale.value)
    })


</script>

<style scoped>

</style>