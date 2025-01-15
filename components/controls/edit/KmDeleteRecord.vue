<template>
    <CButton color="danger" size="sm" v-if="hasDraft || hasPublishedVersion" 
        :disabled="!canDelete" @click="showDeleteConfirmation(true)">
        <font-awesome-icon icon="fa-trash" /> 
        <slot><span class="pl-1">{{t('delete')}}</span></slot>
    </CButton>

    <CModal  class="show d-block" alignment="center" backdrop="static" @close="() => {showDeleteConfirmationModal=false}" :visible="showDeleteConfirmationModal" >
        <CModalHeader :close-button="false">
            <CModalTitle>
                {{ t('deleteConfirmationTitle') }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CAlert color="danger" variant="solid">
            <strong>{{ t('deleteConfirmMessage') }}</strong></CAlert>
            <div class="mt-2" v-if="isLoading">
                <CSpinner size="md" variant="grow"/><strong>{{ t('processing') }}</strong>               
            </div>
            <CRow>
                <CCol :sm="12" v-if="hasPublishedVersion" class="mt-2">
                        <CCard>
                            <CCardHeader>{{t('publishedRecord')}}</CCardHeader>
                            <CCardBody>
                                <CCardTitle>{{ lstring(documentToDelete.title, locale) }}</CCardTitle>
                                <CCardText> {{ lstring(documentToDelete.summary, locale) }}</CCardText>

                                <CButton color="danger" size="sm" :disabled="isLoading" @click="deleteRecord('published')" class="float-end">
                                    <font-awesome-icon icon="fa-trash" /> {{t('deletePublished')}}
                                </CButton>
                                <small class="form-text text-muted" v-if="hasDraft">{{t('deletePublishedInfo')}}</small>
                            </CCardBody>
                        </CCard>
                </CCol>
                <CCol :sm="12" v-if="hasDraft" class="mt-2">
                        <CCard>
                            <CCardHeader>{{t('draftRecord')}}</CCardHeader>
                            <CCardBody>
                                <CCardTitle>{{ lstring(documentToDelete.workingDocumentTitle, locale) }}</CCardTitle>
                                <CCardText> {{ lstring(documentToDelete.workingDocumentSummary, locale) }}</CCardText>
                                <CButton color="danger" size="sm" :disabled="isLoading" @click="deleteRecord('draft')" class="float-end">
                                    <font-awesome-icon icon="fa-trash" /> {{t('deleteDraft')}}
                                </CButton>
                                <small class="form-text text-muted" v-if="hasDraft">{{t('deleteDraftInfo')}}</small>
                            </CCardBody>
                        </CCard>
                </CCol>
            </CRow>
            
            
        </CModalBody>
        <CModalFooter>
            <CButton :disabled="isLoading" color="secondary" @click="showDeleteConfirmation(false)">{{t('cancel')}}</CButton>
            <CButton :disabled="isLoading" color="danger" @click="deleteRecord()" v-if="hasPublishedVersion && hasDraft">{{t('delete')}}</CButton>
        </CModalFooter>
    </CModal>
</template>

<i18n src="@/i18n/dist/components/controls/edit/KmDeleteRecord.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    import {useToast} from 'vue-toast-notification';
    import { EditFormUtility } from '@/services/edit-form-utility';


    const props = defineProps({
        document  : {type:Object, required:true}
    });
    const emit  = defineEmits(['onDelete']);
   

    const {$api}         = useNuxtApp();
    const security       = useSecurity();
    const {t, locale }   = useI18n();
    const $toast        = useToast();
    const isLoading        = ref(false);
    const showDeleteConfirmationModal = ref(false);    
    const documentToDelete = props.document;

    const canDelete = computed(()=> security.role.isAdministrator() ||         
                                    security.role.isPublishingAuthority(props.document.type, 'national') ||   
                                    security.role.isNationalAuthorizedUser(props.document.type, 'national') ||
                                    security.role.isNationalFocalPoint());

    const hasPublishedVersion = computed(()=>documentToDelete?.latestRevision > 0)
    const hasDraft = computed(()=>documentToDelete?.workingDocumentBody)

    async function showDeleteConfirmation(value:boolean){
        
        showDeleteConfirmationModal.value = value;
        
    }

    async function deleteRecord(type:String=''){
        
        isLoading.value = true;

        try{
            if(type == 'draft'){
                await $api.kmStorage.drafts.delete(documentToDelete.identifier); 
            }
            else{
                await EditFormUtility.deleteDocument({
                    identifier: documentToDelete.identifier,
                    title     : documentToDelete.title,
                    summary   : documentToDelete.summary,
                    metadata  : documentToDelete.metadata,
                    documentID: documentToDelete.documentID,
                }, ''); 
                await sleep(5000)
            }     
            showDeleteConfirmation(false);
            await sleep(200)
            emit('onDelete', { identifier:documentToDelete.identifier, type });
            $toast.success(t('deleteSuccessfully'), {position:'top-right'}); 
        }
        catch(e){
            useLogger().error(e, `${t('deleteError')} ${type||''}`)
        }       

        isLoading.value = false;
    }
</script>

<style scoped>

</style>