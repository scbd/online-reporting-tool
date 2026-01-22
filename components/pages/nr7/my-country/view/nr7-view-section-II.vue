<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('sectionII')}} {{t('sectionIIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>
        <div v-if="sectionII">

            <div v-if="locales?.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="lSelectedLocale" :locales="locales"></km-locales>
            </div>
            <km-form-group :caption="t('revisedNbsap')" v-if="sectionII.hasRevisedNbsap!=undefined">
                <km-value :value="t(sectionII.hasRevisedNbsap)" :locale="selectedLocale"></km-value>                                    
            </km-form-group>

            <km-form-group :caption="t('anticipatedNbsapDate')" v-if="sectionII.anticipatedNbsapDate!=undefined">
                <km-value :value="sectionII.anticipatedNbsapDate" :locale="selectedLocale"></km-value>                                    
            </km-form-group>

            <km-form-group v-if="sectionII.hasStakeholderEngagement!=undefined" :caption="t('stakeholderEngagement')">
                <km-value-bool :value="sectionII.hasStakeholderEngagement" :locale="selectedLocale"></km-value-bool> 
            </km-form-group> 

            <km-form-group :caption="t('stakeholders')" v-if="sectionII.stakeholders!=undefined">
                <km-value-terms :value="sectionII.stakeholders" :locale="selectedLocale"></km-value-terms>                                   
            </km-form-group>

            <km-form-group :caption="t('hasNbsapAdopted')" v-if="sectionII.hasNbsapAdopted!=undefined">
                <km-value :value="t(sectionII.hasNbsapAdopted)" :locale="selectedLocale"></km-value>                                    
            </km-form-group>    

            <km-form-group :caption="t('hasNbsapAdoptedInfo')" v-if="sectionII.hasNbsapAdoptedInfo!=undefined">
                <km-lstring-value :value="sectionII.hasNbsapAdoptedInfo" :locale="selectedLocale"></km-lstring-value>                                    
            </km-form-group>

            <km-form-group :caption="t('anticipatedNbsapAdoptionDate')" v-if="sectionII.anticipatedNbsapAdoptionDate!=undefined">
                <km-value :value="sectionII.anticipatedNbsapAdoptionDate" :locale="selectedLocale"></km-value>                                    
            </km-form-group>

            <km-form-group :caption="t('policyInstrument')" v-if="sectionII.policyInstrument!=undefined">
                <km-value-term :value="sectionII.policyInstrument" :locale="selectedLocale"></km-value-term> 
            </km-form-group>

            <km-form-group :caption="t('implementationProgress')" v-if="sectionII.implementationProgress!=undefined">
                <km-lstring-value type="html" :value="sectionII.implementationProgress" :locale="selectedLocale"></km-lstring-value>                                    
            </km-form-group>
        </div>
       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-II.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-II.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
  
    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true},
        locales     : { type:Array<string>, default:[] },
        documentLocale: { type:String }
    });

    const {t, locale}    = useI18n();
    const { documentLocale } = toRefs(props);
    const lSelectedLocale = ref(locale.value)
    const selectedLocale  = computed(()=>documentLocale?.value||lSelectedLocale.value);

    const sectionII = computed(()=>useKmStorage().cleanDocument({...props.document}).sectionII);

</script>
