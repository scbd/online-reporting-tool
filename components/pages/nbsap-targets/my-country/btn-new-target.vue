<template>   
    <CButton color="secondary" size="sm" @click="addEditTarget()">       
        <font-awesome-icon icon="fa-solid fa-pen-to-square"/> Submit new target here
    </CButton>
</template>

<script setup lang="ts">

    const { $appRoutes }   = useNuxtApp();
    const props = defineProps({
        identifier   : { type:String, required:false},
        globalTarget : { type:String, required:false}
    })
    const { globalTarget, identifier } = toRefs(props);
    
    async function addEditTarget(){

        let query;
        let path = $appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I_NEW;

        if(identifier?.value){
            path = $appRoutes.NBSAPS_TARGETS_MY_COUNTRY_PART_I_EDIT
            path = path.replace(':identifier', identifier.value)
        }

        if(globalTarget?.value){
            query = {
                globalTarget : globalTarget.value
            } 
        }

        await navigateTo({ 
            path,
            query
        });
    }

</script>

<style scoped>

</style>