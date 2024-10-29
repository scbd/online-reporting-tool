<template>
  <term-list :header="t('globalBiodiversityFrameworkGoals')" v-if="globalGoals?.length" :terms="globalGoals"></term-list>
  <term-list header="t('globalBiodiversityFrameworkTargets')" v-if="globalTargets?.length" :terms="globalTargets"></term-list>
</template>

<i18n src="@/i18n/dist/components/pages/taxonomy/gbf/gbf-taxonomy-list.json"></i18n>
<script setup lang="ts">
import { useThesaurusStore } from '@/stores/thesaurus';
import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";

 const {t} = useI18n();
const thesaurusStore = useThesaurusStore();
const globalTargets = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS) || []).sort((a, b) => a.name.localeCompare(b.name)));
const globalGoals = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS) || []).sort((a, b) => a.name.localeCompare(b.name)));

onMounted(() => {
  GbfGoalsAndTargets.loadGbfGoalsAndTargets()
})

</script>