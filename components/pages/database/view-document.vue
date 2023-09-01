<template>
    <CCard>
        <!-- <CCardHeader v-if="identifier">
            <slot name="header"></slot>
        </CCardHeader> -->
        <CCardBody>
            <km-suspense>
                <view-target-part-1 v-if="viewDocument && viewDocument.header.schema == SCHEMAS.NATIONAL_TARGET_7" 
                    :document="viewDocument"></view-target-part-1>
                <view-target-part-2 v-if="viewDocument && viewDocument.header.schema == SCHEMAS.NATIONAL_TARGET_7_MAPPING" 
                    :document="viewDocument"></view-target-part-2>
            </km-suspense>

            <div v-if="!viewDocument && !isLoading &&  documentLoadError">
                <CAlert color="danger" class="d-flex align-items-center">
                    <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
                    <div v-if="documentLoadError==404">
                        {{t('notFound')}}
                    </div>
                    <div v-if="documentLoadError==401 || documentLoadError==403">
                        {{t('notAuthorized')}}
                    </div>
                </CAlert>
            </div>
            <div class="d-flex justify-content-center" v-if="isLoading">
                <km-spinner :visible="isLoading" ></km-spinner>
            </div>
       
        </CCardBody>
    </CCard>

</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/part-1/view-target-part-1.json"></i18n>
<i18n src="@/i18n/dist/components/pages/database/view-document.json"></i18n>

<script setup lang="ts">
    import { KmSuspense } from "@/components/controls";
    
    import { useRoute } from 'vue-router';
    import { SCHEMAS, ROLES } from '@/utils';
    import { KmDocumentDraftsService}from "@/services/kmDocumentDrafts";
    import { KmDocumentsService } from "@/services/kmDocuments";
    
    const viewTargetPart1 = defineAsyncComponent(()=>import('@/components/pages/national-targets/my-country/part-1/view-target-part-1.vue'));
    const viewTargetPart2 = defineAsyncComponent(()=>import('@/components/pages/national-targets/my-country/part-2/view-target-part-2.vue'));

    const { user }                = useAuth();
    const security                = useSecurity();
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

    async function loadDocument(identifier: string){

        isLoading.value = true;
        try{
            if(route.query?.draft == 'true' || route.query.hasOwnProperty('draft')){
                const draftRecord = await KmDocumentDraftsService.loadDraftDocument(route.params.identifier);
                lDocument.value = draftRecord.body;
            }
            else{
                const record = await KmDocumentsService.loadDocument(route.params.identifier);
                lDocument.value = record.body;
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

</style>