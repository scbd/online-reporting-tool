<template>
  <term-list :header="t('globalBiodiversityFrameworkGoals')" v-if="['all','goals'].includes(type) &&  globalGoals?.length" :terms="globalGoals"
    :link-url="`${appRoutes.TAXONOMY_GBF_GOAL_DETAILS}`"></term-list>
  <term-list :header="t('globalBiodiversityFrameworkTargets')" v-if="['all','targets'].includes(type) && globalTargets?.length" :terms="globalTargets"
    :link-url="`${appRoutes.TAXONOMY_GBF_TARGET_DETAILS}`"></term-list>
</template>

<i18n src="@/i18n/dist/components/pages/taxonomy/gbf/gbf-taxonomy-list.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
import { useThesaurusStore } from '@/stores/thesaurus';
import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
import {useRoute } from 'vue-router';

const props = defineProps({
  type: {
    type: String,required: true,
    validator: (value: string) => ['all', 'goals', 'targets', 'indicators'].includes(value)
  }
})

const {t} = useI18n();
const thesaurusStore = useThesaurusStore();
const globalTargets = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS) || []).sort((a, b) => a.name.localeCompare(b.name)));
const globalGoals = computed(() => (thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS) || []).sort((a, b) => a.name.localeCompare(b.name)));

onMounted(() => {
  GbfGoalsAndTargets.loadGbfGoalsAndTargets()
})

</script>