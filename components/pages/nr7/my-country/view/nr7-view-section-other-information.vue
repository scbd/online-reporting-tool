<template>
    <CCard>
      <CCardHeader>
        <slot name="header"> {{t('sectionOtherInformation')}} {{t('sectionOtherInformationDescription')}}</slot>
      </CCardHeader>
      <CCardBody v-if=sectionOtherInfo>
            <div v-if="locales?.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="lSelectedLocale" :locales="locales"></km-locales>
            </div>

            <km-form-group name="additionalDocuments" :caption="t('additionalDocuments')" v-if="sectionOtherInfo.additionalDocuments">
                <km-view-links :can-edit="false" :links="sectionOtherInfo.additionalDocuments"></km-view-links>
            </km-form-group>

            <km-form-group v-if="sectionOtherInfo && sectionOtherInfo.additionalInformation" 
                :caption="t('additionalInformation')">
                <km-lstring-value type="html" :value="sectionOtherInfo.additionalInformation" :locale="selectedLocale"></km-lstring-value> 
            </km-form-group>       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-other-information.json"></i18n>

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
    const lSelectedLocale = ref(locale.value)
    const selectedLocale  = computed(()=>documentLocale?.value||lSelectedLocale.value);

    const sectionOtherInfo = computed(()=>useKmStorage().cleanDocument({...props.document}).sectionOtherInfo);
</script>
