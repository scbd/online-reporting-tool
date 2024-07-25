<template>
    <km-select v-if="globalGoals"
        v-model="model"
        label="shortTitle"
        track-by="identifier"
        value-key="identifier"
        :options="globalGoals"
        :close-on-select="false"
        :custom-label="customShortLabel($event, locale)"
        :custom-selected-item="customSelectedItem">
    </km-select>
</template>

<script setup lang="ts">

    import { useThesaurusStore }    from '@/stores/thesaurus';

    const model = defineModel()

    const { t, locale }         = useI18n();
    const thesaurusStore= useThesaurusStore ();
    const globalGoals = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS)||[]).sort((a,b)=>a.name.localeCompare(b.name)));
    
    onMounted(() => {
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_GLOBAL_GOALS)
    })
</script>

<style scoped>

</style>