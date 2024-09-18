<template>
  <term-list header="Global Biodiversity Framework Goals" v-if="globalGoals?.length" :terms="globalGoals"></term-list>
  <term-list header="Global Biodiversity Framework Targets" v-if="globalTargets?.length" :terms="globalTargets"></term-list>
</template>

<script setup lang="ts">
import { useThesaurusStore } from '@/stores/thesaurus';
import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";


const thesaurusStore = useThesaurusStore();
const globalTargets = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS) || []).sort((a, b) => a.name.localeCompare(b.name)));
const globalGoals = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS) || []).sort((a, b) => a.name.localeCompare(b.name)));

onMounted(() => {
  GbfGoalsAndTargets.loadGbfGoalsAndTargets()
})

</script>