<template>
    <CCard>
      <CCardHeader v-if="identifier">
        <slot name="header"> {{t('title')}}</slot>
      </CCardHeader>
      <CCardBody>
       
        <div v-if="viewDocument">
        
            <div v-if="viewDocument.header.languages && viewDocument.header.languages.length > 1" 
                class="d-grid d-md-flex justify-content-md-end mb-2">
                <km-locales v-model="selectedLocale" :locales="viewDocument.header.languages"></km-locales>
            </div>
            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('general')}}
                    </div>
                    <div class="card-body">  
                        <km-form-group v-if="viewDocument.government && viewDocument.government.identifier">
                            <label class="form-label" for="government">{{t('government')}}</label>
                            <km-value-term :value="viewDocument.government" :locale="selectedLocale"></km-value-term>                                    
                        </km-form-group>
                        <km-form-group v-if="viewDocument.globalGoalOrTarget">
                            <label class="form-label">{{t('linkedTarget')}}</label>
                            <km-value-term :value="viewDocument.globalGoalOrTarget" :locale="selectedLocale"></km-value-term>                                 
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('elementsOfTargets')}}
                    </div>
                    <div class="card-body">                                
                        <km-form-group v-if="viewDocument.elementOfGlobalTargetsInfo || viewDocument.hasReferencePeriod || viewDocument.hasReferencePeriod">
                            <label class="form-label" for="elementOfGlobalTargetsInfo">{{t('addressedElements')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.elementOfGlobalTargetsInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>
            <km-form-group v-if="viewDocument.referencePeriod">
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('referencePeriod')}}
                    </div>
                    <div class="card-body">
                        
                        <CCard class="mb-2" v-for="(indicator) in viewDocument.referencePeriod" :key="indicator.identifier">
                            <CCardBody>
                                <CCardTitle>
                                    <km-term :value="indicator.headlineIndicator" :locale="selectedLocale"></km-term>
                                </CCardTitle>
                                <hr/>
                                <CCardText >
                                    <km-form-group>
                                        <label class="form-check-label" for="hasReferencePeriod">{{t('referencePeriodForIndicator')}}</label>
                                        <km-value-bool :value="indicator.hasReferencePeriod" :locale="selectedLocale"></km-value-bool>
                                    </km-form-group> 

                                    
                                    <km-form-group v-if="indicator.hasReferencePeriod">
                                        <label class="form-label" for="referencePeriodInfo">{{t('explain')}}</label>
                                        <km-lstring-value type="html" :value="indicator.referencePeriodInfo" :locale="selectedLocale"></km-lstring-value>
                                    </km-form-group> 
                                </CCardText>

                            </CCardBody>
                        </CCard>
                        
                    </div>
                </div>
            </km-form-group>

        </div>

        <km-document-error v-if="!viewDocument && !isLoading &&  documentLoadError"></km-document-error>
        <km-spinner :visible="isLoading"  v-if="isLoading" center></km-spinner>
       
      </CCardBody>
    </CCard>
  
</template>

<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-2/view-target-part-2.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
  
    import { useRoute } from 'vue-router' 
    import { KmDocumentDraftsService}from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";

    const emit                    = defineEmits(['onDocumentLoad']);
    const route                   = useRoute();
    const {t, locale}             = useI18n();
    const {$appRoutes:appRoutes } = useNuxtApp();

    const props = defineProps({
        document    : { type:Object, default : undefined},
        identifier  : { type:String, required:true}
    })

    const { document, identifier } = toRefs(props)

    const lDocument = ref(undefined);
    const isLoading = ref(false);
    const documentLoadError = ref(false);
    const selectedLocale = ref(locale.value);

    const viewDocument = computed(()=>{
        return document?.value||lDocument?.value;
    })

    onMounted(() => {
        if(props.identifier && !props.document){
            loadDocument(props.identifier)       
        }
    })
 
    const onClose = async ()=>{
        await useNavigateAppTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_II)
    }

    async function loadDocument(identifier){
        isLoading.value = true;
        try{
            if(route.query?.draft == 'true' || route.query?.draft === null){
                const draftRecord = await KmDocumentDraftsService.loadDraftDocument(route.params.identifier);
                lDocument.value = draftRecord.body;
                emit('onDocumentLoad', draftRecord.body);
            }
            else{
                const record = await KmDocumentsService.loadDocument(route.params.identifier);
                lDocument.value = record.body;
                emit('onDocumentLoad', record.body);
            }
        }
        catch(e){
            if([404, 401, 403].includes(e.status)){
                documentLoadError.value = e.status;
                useLogger().error(e, `${t(e.status==404 ? 'notFound' : 'notAuthorized')} ` + route.params.identifier);
            }
            else
                useLogger().error(e, `${t('errorLoading')} ` + route.params.identifier);
        }
        isLoading.value = false;
        
    }

</script>
