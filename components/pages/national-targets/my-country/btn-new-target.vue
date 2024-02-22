<template>   
    <CButton color="secondary" size="sm" @click="addEditTarget()">       
        <font-awesome-icon icon="fa-solid fa-pen-to-square"/> {{t('submitTarget')}}
    </CButton>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/btn-new-target.json"></i18n>
<script setup lang="ts">

    const { t } = useI18n();
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

        await useNavigateAppTo({ 
            path,
            query:routeQuery,
            
        });
    }

</script>

<style scoped>

</style>