<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> {{t('sectionV')}} {{t('sectionVDescription')}}</slot>
      </CCardHeader>
      <CCardBody>
            <div v-if="document.header.languages && document.header.languages.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="selectedLocale" :locales="document.header.languages"></km-locales>
            </div>
            <km-form-group v-if="document.sectionV && document.sectionV.assessmentSummaryInfo" 
                :caption="t('assessmentSummaryInfo')">
                <km-lstring-value type="html" :value="document.sectionV.assessmentSummaryInfo" :locale="selectedLocale"></km-lstring-value> 
            </km-form-group>       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-V.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-V.json"></i18n>

<script setup>
  
    const {t, locale}    = useI18n();
    const selectedLocale = ref(locale.value);

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    });

    const document = useKmStorage().cleanDocument({...props.document});

</script>
