<template>   
    <CButton color="secondary" size="sm" @click="addEditTarget()">       
        <font-awesome-icon icon="fa-solid fa-pen-to-square"/> Submit new target here
    </CButton>
</template>

<script setup lang="ts">

    const { $appRoutes }   = useNuxtApp();
    const props = defineProps({
        identifier   : { type:String, required:false},
        query : { type:Object, required:false},
    })
    const { query, identifier } = toRefs(props);
    
    async function addEditTarget(){

        let routeQuery;
        let path = $appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_NEW;

        if(identifier?.value){
            path = $appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I_EDIT
            path = path.replace(':identifier', identifier.value)
        }

        if(query?.value){
            routeQuery = {
                ...query.value
            } 
        }

        await navigateTo({ 
            path,
            query:routeQuery,
            
        });
    }

</script>

<style scoped>

</style>