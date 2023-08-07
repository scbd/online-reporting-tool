<template>
    <span>
        <CAlert color="danger" v-if="error">Error loading term {{ value.identifier }}</CAlert>
        {{ lstring(term.title, locale) }}
    </span>
</template>

<script setup lang="ts">

    import { useThesaurusStore }    from '@/stores/thesaurus';

    const emit = defineEmits(['onTermLoad'])
    const props = defineProps({
        value   : {type:Object, required:true },
        locale  : {type:String, required:true },
    })
    const { value, locale } = toRefs(props);

    const { $api }          = useNuxtApp();
    const thesaurusStore    = useThesaurusStore ();

    let term:any;
    let error:any
    if(!value.value?.identifier || value.value){

        try{
            
            term = await  thesaurusStore.loadTerm(value.value?.identifier||value.value);

            if(term){
                emit('onTermLoad', term);
            }
        }
        catch(error){
            console.error(`Error loading term ${value.value}`, error);
        }
    }

</script>

<style scoped>

</style>