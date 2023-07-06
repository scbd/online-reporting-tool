<template>
    <div class="km-term">
        <CAlert color="danger" v-if="error">Error loading term {{ modelValue.identifier }}</CAlert>
        {{ lstringTerm }}
    </div>
</template>

<script setup lang="ts">
    import { direction, lstringLocale, lstring } from '@/util/filter';

    const props = defineProps({
        modelValue  : {type:Object, required:true },
        locale      : {type:String, required:true },
    })
    const { modelValue, locale } = toRefs(props);

    const { $api } = useNuxtApp();

    const { data:term, error } = await $api.thesaurus.getTerm(modelValue.value.identifier)
    if(error)
        console.error(`Error loading term ${modelValue.value}`, error);

    const lstringTerm = computed(()=>{
        return lstring(term?.title, locale)
    })

</script>

<style scoped>

</style>