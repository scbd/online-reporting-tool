<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('sectionIV')}} {{t('sectionIVDescription')}}</slot>
      </CCardHeader>
      <CCardBody>
            <div v-if="locales?.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="lSelectedLocale" :locales="locales"></km-locales>
            </div>

             <div class="card mb-3" v-for="(assessment) in sectionIVComputed" :key="assessment">
                <div class="card-header">
                    <km-term :value="assessment.gbfGoal?.identifier" :locale="selectedLocale"></km-term>                    
                    <strong v-if="assessment.targetType" class="ms-1">({{ capitalCase(assessment.targetType) }})</strong>
                </div>
                <div class="card-body" >
                    <km-form-group v-if="assessment.summaryOfProgress"
                        :caption="t('summaryOfNationalProgress')">
                        <km-lstring-value type="html" :value="assessment.summaryOfProgress" 
                            :locale="selectedLocale"></km-lstring-value>
                    </km-form-group>
                    
                    <legend>
                        {{ t('indicatorData') }}
                    </legend>
                    <hr>
                    <nr7-view-target-indicators  :is-printing="isPrinting"  :target-indicators="assessment.indicatorData" :hide-missing-data-alert="true"
                        :indicators-data="indicatorsData"></nr7-view-target-indicators>
                
                </div>
            </div>
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-IV.json"></i18n>
<!-- <i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-IV.json"></i18n> -->

<script setup lang="ts">
//@ts-nocheck
  
  const props = defineProps({
        document    : { type:Object, required:true},
        identifier  : { type:String, required:true},
        indicatorsData  : {type:Array<EDocumentInfo>, default:[], required:true },
        locales     : { type:Array<string>, default:[]  },
        documentLocale: { type:String },
        isPrinting      : { type: Boolean, default:false}
    });

    const {t, locale}    = useI18n();
    const { documentLocale } = toRefs(props);
    const lSelectedLocale = ref(locale.value)
    const selectedLocale  = computed(()=>documentLocale?.value||lSelectedLocale.value);

    const sectionIVComputed = computed(()=>{
        return props.document?.sectionIV || [];
    })

    const nationalTargetsComputed = computed(()=>{
        return props.nationalTargets || {}
    });

    onMounted(()=>{
        // console.log('mounted')
        /*
            globalTargetAlignment_ss,otherNationalIndicators_ss,otherNationalIndicators_CEN_s,
            headlineIndicators_CAR_ss
        */
    })

</script>
<style scoped>
    .assessment-goal-accordion{
        top:110px;
    }
    .assessment-target-active{
        border: 3px solid#26638e;
    }
    .accordion-header.assessment-goal-accordion.header{
        border-bottom: 3px solid#26638e;
    }
</style>

