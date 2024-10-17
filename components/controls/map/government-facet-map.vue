<template>
    <un-map v-if="countryColors?.length" :countryColors="countryColors" 
        :zoom="0.4" :screenshot-only="true"></un-map>
</template>

<script setup lang="ts">

    import { facets } from '@/services/solr';
    import { useCountriesStore }    from '@/stores/countries';

    const props = defineProps({
        query : { type:Object, required:true},
        zoom  : { type:Number, default : 0.8 }
    });

    const countriesStore  = useCountriesStore ();
    const countryColors   = ref();

    onMounted(async()=>{;    

        await countriesStore.loadCountries();
        const searchQuery = {
            rows            : 0,
            facet           : true,
            'facet.field'   : 'government_s',
            'facet.query'   : props.query,
            'facet.mincount': 1,
            q               : props.query
        }
        
        const facetResponse = await facets(searchQuery)
        countryColors.value = Object.entries(facetResponse.facets.government_s).map(([key, val])=>{
                                    return {
                                    code3 : countriesStore.countries.find(c=>c.code == key?.toUpperCase())?.code3,
                                    color : CBD_GREEN
                                }
                            })
    })

</script>

<style scoped>

</style>