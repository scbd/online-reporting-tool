<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('sectionII')}} {{t('sectionIIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>
        <div v-if="sectionII">

            <div v-if="document.header.languages && document.header.languages.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="selectedLocale" :locales="document.header.languages"></km-locales>
            </div>
            <km-form-group :caption="t('revisedNbsap')" v-if="sectionII.hasRevisedNbsap">
                <km-lstring-value :value="t(sectionII.hasRevisedNbsap)" :locale="selectedLocale"></km-lstring-value>                                    
            </km-form-group>

            <km-form-group :caption="t('anticipatedNbsapDate')" v-if="sectionII.anticipatedNbsapDate">
                <km-value :value="sectionII.anticipatedNbsapDate" :locale="selectedLocale"></km-value>                                    
            </km-form-group>

            <km-form-group v-if="sectionII.hasStakeholderEngagement" :caption="t('stakeholderEngagement')">
                <km-value-bool :value="sectionII.hasStakeholderEngagement" :locale="selectedLocale"></km-value-bool> 
            </km-form-group> 

            <km-form-group :caption="t('stakeholders')" v-if="sectionII.stakeholders">
                <km-value-terms :value="sectionII.stakeholders" :locale="selectedLocale"></km-value-terms>                                   
            </km-form-group>

            <km-form-group :caption="t('hasNbsapAdopted')" v-if="sectionII.hasNbsapAdopted">
                <km-lstring-value :value="t(sectionII.hasNbsapAdopted)" :locale="selectedLocale"></km-lstring-value>                                    
            </km-form-group>

            <km-form-group :caption="t('anticipatedNbsapAdoptionDate')" v-if="sectionII.anticipatedNbsapAdoptionDate">
                <km-lstring-value :value="sectionII.anticipatedNbsapAdoptionDate" :locale="selectedLocale"></km-lstring-value>                                    
            </km-form-group>

            <km-form-group :caption="t('policyInstrument')" v-if="sectionII.policyInstrument">
                <km-value-terms :value="sectionII.policyInstrument" :locale="selectedLocale"></km-value-terms>                                   
            </km-form-group>

            <km-form-group :caption="t('implementationProgress')" v-if="sectionII.implementationProgress">
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
  
    const {t, locale}    = useI18n();
    const selectedLocale = ref(locale.value);

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    });

    const sectionII = computed(()=>useKmStorage().cleanDocument({...props.document}).sectionII);

</script>
