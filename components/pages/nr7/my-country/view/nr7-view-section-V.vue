<template>
    
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('sectionV')}} {{t('sectionVDescription')}}</slot>
      </CCardHeader>
      <CCardBody>
            <div v-if="locales?.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="selectedLocale" :locales="locales"></km-locales>
            </div>
            <km-form-group v-if="sectionV && sectionV.assessmentSummary" 
                :caption="t('assessmentSummary')">
                <km-lstring-value type="html" :value="sectionV.assessmentSummary" :locale="selectedLocale"></km-lstring-value> 
            </km-form-group>       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-V.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-V.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
  

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true},
        locales     : { type:Array<string>, default:[]  },
        documentLocale: { type:String }
    });

    const {t, locale}    = useI18n();
    const { documentLocale } = toRefs(props);
    const selectedLocale = computed(()=>props.documentLocale||locale.value);

    const sectionV = computed(()=>useKmStorage().cleanDocument({...props.document}).sectionV);

</script>
