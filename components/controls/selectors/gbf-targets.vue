<template>
    <km-select v-if="globalTargets"
        v-model="model"
        label="shortTitle"
        track-by="identifier"
        value-key="identifier"
        :options="globalTargets"
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
    const globalTargets = computed(()=>(thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS)||[]).sort((a,b)=>a.name.localeCompare(b.name)));
    
    onMounted(() => {
        thesaurusStore.loadDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS)
    })
</script>

<style scoped>

</style>