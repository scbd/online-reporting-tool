<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> {{t('sectionI')}} {{t('sectionIDescription')}}</slot>
      </CCardHeader>
      <CCardBody>
        <div v-if="document.header">
        
            <div v-if="document.header.languages && document.header.languages.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="selectedLocale" :locales="document.header.languages"></km-locales>
            </div>
            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        General
                    </div>
                    <div class="card-body">  
                        <km-form-group v-if="document.government && document.government.identifier" :caption="t('government')">
                            <km-value-term :value="document.government" :locale="selectedLocale"></km-value-term>                                    
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>
            <km-form-group>
                <div class="card">
                    <div class="card-body">  
                        <km-form-group v-if="document.sectionI && document.sectionI.processUndertaken" :caption="t('preparationProcess')">
                            <km-lstring-value type="html" :value="document.sectionI.processUndertaken" :locale="selectedLocale"></km-lstring-value> 
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            
        </div>
       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/nr7/my-country/edit/nr7-edit-section-I.json"></i18n>
<i18n src="@/i18n/dist/components/pages/nr7/my-country/view/nr7-view-section-I.json"></i18n>

<script setup>
  
    const {t, locale}    = useI18n();
    const selectedLocale = ref(locale.value);

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    });

    const document = useKmStorage().cleanDocument({...props.document});

</script>
