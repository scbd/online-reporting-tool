<template>
    <term-details :header="t('globalBiodiversityFrameworkGoal')"   v-if="globalGoal" :term="globalGoal"></term-details>
    <term-details :header="t('globalBiodiversityFrameworkTarget')" v-if="globalTarget" :term="globalTarget"></term-details>
    
    <term-list :header="t('headlineIndicators')"      :link-url="appRoutes.TAXONOMY_GBF_INDICATOR_DETAILS.replace(':target', filterTerm)" v-if="headlineIndicators?.length && showHeadline" :terms="headlineIndicators" ></term-list>
    <term-list :header="t('binaryIndicators')"        :link-url="appRoutes.TAXONOMY_GBF_INDICATOR_DETAILS.replace(':target', filterTerm)" v-if="binaryIndicators?.length  && showBinary" :terms="binaryIndicators"></term-list>
    <term-list :header="t('componentIndicators')"     :link-url="appRoutes.TAXONOMY_GBF_INDICATOR_DETAILS.replace(':target', filterTerm)" v-if="componentIndicators?.length  && showComponent" :terms="componentIndicators"></term-list>
    <term-list :header="t('complementaryIndicators')" :link-url="appRoutes.TAXONOMY_GBF_INDICATOR_DETAILS.replace(':target', filterTerm)" v-if="complementaryIndicators?.length  && showComplementary" :terms="complementaryIndicators"></term-list>

    <div v-if="showTermDetails && otherTermDetails?.title">
      <term-details :header="t('globalBiodiversityFrameworkTerm')" :term="otherTermDetails"></term-details>      
    </div>

</template>
<i18n src="@/i18n/dist/components/pages/taxonomy/gbf/gbf-taxonomy-details.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
  import { useThesaurusStore } from '@/stores/thesaurus';
  import { GbfGoalsAndTargets } from "@/services/gbfGoalsAndTargets";
  import {useRoute } from 'vue-router';
  import {uniqBy } from 'lodash'

  const props = defineProps({
      showIndicatorType : {
        type:String, default:null, 
        validator: (value: string) => ['headline', 'component', 'complementary', 'binary'].includes(value) || value==null
      }
  })

  const thesaurusStore = useThesaurusStore();
  const {t}            = useI18n();
  const route          = useRoute();

  const filterTerm = route.params?.identifier?.toUpperCase();

  const showTermDetails        = computed(()=>!globalTarget.value && !globalGoal.value)
  const globalTarget           = computed(() => thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_TARGETS).find(e=>e.identifier == filterTerm));
  const globalGoal             = computed(() => thesaurusStore.getDomainTerms(THESAURUS.GBF_GLOBAL_GOALS).find(e=>e.identifier == filterTerm));
  const headlineIndicators      = ref([]);
  const componentIndicators     = ref([]);
  const complementaryIndicators = ref([]);
  const binaryIndicators        = ref([]);
  const otherTermDetails        = ref({});


  const showHeadline      = computed(()=>(filterTerm|| props.showIndicatorType=='headline'));
  const showBinary        = computed(()=>(filterTerm|| props.showIndicatorType=='binary'));
  const showComponent     = computed(()=>(filterTerm|| props.showIndicatorType=='component'));
  const showComplementary = computed(()=>(filterTerm|| props.showIndicatorType=='complementary'));
  function formatIndicators(list){
    return sortBy(uniqBy(list?.     flat()||[], 'identifier'), 'title');
  }

  onMounted(() => {
    GbfGoalsAndTargets.loadGbfGoalsAndTargetsWithIndicators();
    if(filterTerm)
      thesaurusStore.loadTerm(filterTerm).then(e=>otherTermDetails.value = e);

    if(showHeadline.value)
      GbfGoalsAndTargets.loadGbfHeadlineIndicator(filterTerm).then(formatIndicators).then(e=>headlineIndicators.value = e );
    if(showComponent.value)
      GbfGoalsAndTargets.loadGbfComponentIndicator(filterTerm).then(formatIndicators).then(e=>componentIndicators.value = e);
    if(showComplementary.value)
      GbfGoalsAndTargets.loadGbfComplementaryIndicator(filterTerm).then(formatIndicators).then(e=>complementaryIndicators.value = e);
    if(showBinary.value)
      GbfGoalsAndTargets.loadGbfBinaryIndicator(filterTerm).then(formatIndicators).then(e=>binaryIndicators.value = e);
  })

</script>