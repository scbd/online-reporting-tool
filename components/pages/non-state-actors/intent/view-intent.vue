<template>
    <CCard>
      <CCardHeader>
         {{t('nbsapTitle')}}
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
                        <km-form-group :caption="t('isGbfAligned')" v-if="viewDocument.isGbfAligned!==undefined">
                            <km-lstring-value :value="t(viewDocument.isGbfAligned ? 'yes' : 'no')" :locale="selectedLocale"></km-lstring-value>                                    
                        </km-form-group>
                        <km-form-group v-if="viewDocument.government && viewDocument.government.identifier" :caption="t('government')">
                            <km-value-term :value="viewDocument.government" :locale="selectedLocale"></km-value-term>                                    
                        </km-form-group>

                        <km-form-group v-if="viewDocument.title" :caption="t('title')">                
                            <km-lstring-value :value="viewDocument.title" :locale="selectedLocale"></km-lstring-value>                                    
                        </km-form-group>

                        <km-form-group v-if="viewDocument.summary" :caption="t('summary')">
                            <km-lstring-value type="html" :value="viewDocument.summary" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{t('jurisdictionSectionTitle')}}
                    </div>
                    <div class="card-body">
                             
                        <km-form-group v-if="viewDocument.jurisdiction" :caption="t('')">
                            <label class="form-label" for="jurisdiction">{{t('jurisdiction')}}</label>
                            <km-value-term :value="viewDocument.jurisdiction" :locale="selectedLocale"></km-value-term>
                        </km-form-group>

                        <km-form-group v-if="viewDocument.jurisdictionInfo" :caption="t('')">
                            <label class="form-label" for="jurisdictionInfo">{{t('jurisdictionInfo')}}</label>
                            <km-lstring-value type="html" :value="viewDocument.jurisdictionInfo" :locale="selectedLocale"></km-lstring-value>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>
            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{ t('implementationPeriod') }}
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6" v-if="viewDocument.startDate">
                                <km-form-group name="startDate" :caption="t('startDate')">
                                    <km-value :value="formatDate(viewDocument.startDate, 'DD MMM YYYY')" :locale="selectedLocale"></km-value>    
                                </km-form-group>
                            </div>
                            <div class="col-md-6" v-if="viewDocument.endDate">
                                <km-form-group name="endDate" :caption="t('endDate')">
                                    <km-value :value="formatDate(viewDocument.endDate, 'DD MMM YYYY')" :locale="selectedLocale"></km-value>  
                                </km-form-group>
                            </div>
                        </div>
                    </div>
                </div>
            </km-form-group>
            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{ t('status') }}
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6" v-if="viewDocument.status">
                                <km-form-group name="status" :caption="t('statusOfTheDocument')">
                                    <km-value-term :value="viewDocument.status" :locale="selectedLocale"></km-value-term>                                    
                                </km-form-group>
                            </div>
                            <div class="col-md-6" v-if="viewDocument.adoptionDate">
                                <km-form-group name="adoptionDate" :caption="t('adoptionDate')"  :data-content="t('adoptionYear')">                                                
                                    <km-value :value="formatDate(viewDocument.adoptionDate, 'DD MMM YYYY')" :locale="selectedLocale"></km-value>   
                                </km-form-group>
                            </div>
                        </div>

                        <div class="row bottom-spacing" v-if="viewDocument.approvedStatus">
                            <div class="col-md-6">
                                <km-form-group name="approvedStatus" :caption="t('statusOfApprovedDocument')">
                                    <km-value-term :value="viewDocument.approvedStatus" :locale="selectedLocale"></km-value-term>  
                                </km-form-group>
                            </div>
                            <div class="col-md-6">
                                <km-form-group name="approvingBody" :caption="t('approvingBody')">
                                    <km-value-term :value="viewDocument.approvingBody" :locale="selectedLocale"></km-value-term>  
                                </km-form-group>
                            </div>
                        </div>

                        <div class="row bottom-spacing" v-if="viewDocument.approvingBodyInfo">
                            <div class="col-md-12">
                                <km-form-group name="approvingBodyInfo"
                                    :caption="t('approvingBodyInformation')">
                                    <km-lstring-value type="html" :value="viewDocument.approvingBodyInfo" :locale="selectedLocale"></km-lstring-value>                                    
                                </km-form-group>
                            </div>
                        </div>
                    </div>
                </div>
            </km-form-group>

            <km-form-group>
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{ t('mainRelevantDocuments') }}
                    </div>
                    <div class="card-body">
                        <km-form-group name="documentText" :caption="t('relevantInformation')" v-if="viewDocument.documentText" >
                            <km-lstring-value type="html" :value="viewDocument.documentText" :locale="selectedLocale"></km-lstring-value>                                    
                        </km-form-group>
                        
                        <km-form-group name="documentLinks" :caption="t('relevantLinks')" v-if="viewDocument.documentLinks">
                            <km-view-links :can-edit="false" :links="viewDocument.documentLinks"></km-view-links>
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>

            <km-form-group v-if="viewDocument.relevantInformation">
                <div class="card">
                    <div class="card-header bg-secondary">
                        {{ t('otherRelevantInformation') }}
                    </div>
                    <div class="card-body">
                        <km-form-group name="relevantInformation" :caption="t('otherRelevantInformationInfo')">
                            <km-lstring-value type="html" :value="viewDocument.relevantInformation" :locale="selectedLocale"></km-lstring-value>                                    
                        </km-form-group>
                    </div>
                </div>
            </km-form-group>
        </div>

        <km-document-error v-if="!viewDocument && !isLoading &&  documentLoadError" :document-error="documentLoadError"></km-document-error>        
        <km-spinner :visible="isLoading" v-if="isLoading" center></km-spinner>        
       
      </CCardBody>
    </CCard>
  
</template>
<i18n src="@/i18n/dist/components/pages/nbsaps/my-country/edit-nbsap.json"></i18n>

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

    const { document, identifier } = toRefs(props);
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
        await useNavigateAppTo(appRoutes.NATIONAL_TARGETS_MY_COUNTRY_PART_I)
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
<style scoped>
    .degree-of-alignment :deep(.form-control.km-value){
        background-color: unset!important;
        border: unset!important;
    }
</style>