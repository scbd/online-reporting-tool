<template>
    <div class="table-responsive">       
        <table class="table" v-if="regionCountries?.length">
            <thead>
                <tr>
                    <th scope="col">{{t('region')}}</th>
                    <th scope="col">{{t('countries')}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(region) in regionCountries">
                    <td>
                        {{lstring(region.title, locale)}}
                    </td>
                    <td>
                        <span v-for="(country) in region.narrowerTerms" :key="country">
                            <km-term :value="{identifier:country}" :locale="locale"></km-term>,
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<i18n src="@/i18n/dist/components/pages/stakeholders/commitments/region-country-list.json"></i18n>  
<script setup lang="ts">

import ThesaurusAPI from '~/api/thesaurus';
import type { ETerm } from '~/types/schemas/base/ETerm';
    
    const { t, locale } = useI18n();
    const thesaurusAPI = new ThesaurusAPI({});

    const props = defineProps({
        regions : { type:Array<ETerm>, required:true }
    })

    const loading = ref(false);
    const regionCountries = ref<Array<ETerm>>([]);

    const showRegionCountries = async () => {

        if(props.regions.length === 0){
            return;
        }

        loading.value = true;
        regionCountries.value = await Promise.all(props.regions.map(region => {   
            return thesaurusAPI.getTerm(region.identifier)
        }))
        .finally(() => {
            loading.value = false;
        });
    }   
    
    watch(() => props.regions, () => {
        showRegionCountries();
    }, { immediate: true });


</script>

<style scoped></style>