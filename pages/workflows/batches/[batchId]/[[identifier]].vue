<template>
   <CCard>
        
        <CCardBody>           

            <div v-if="!workflowBatch && !isLoading &&  documentLoadError">
                <km-document-error :document-error="documentLoadError"></km-document-error>
            </div>
            <div class="d-flex justify-content-center" v-if="isLoading">
                <km-spinner :visible="isLoading" ></km-spinner>
            </div>
       
        </CCardBody>
    </CCard>
</template>

<i18n src="@/i18n/dist/common/errors.json"></i18n>
<i18n src="@/i18n/dist/pages/workflows/batches/[batchId]/[[identifier]].json"></i18n>

<script setup lang="ts">
//@ts-nocheck
    import { KmSuspense } from "@/components/controls";
    import { useRoute } from 'vue-router';
    import { SCHEMAS, ROLES } from '@/utils';

    definePageMeta({
        auth:true,
        roles:[...ROLES.ALL_NATIONAL_USERS],
        breadcrumbs : {
            skip : ['identifier']
        }
    })

    const route                 = useRoute();
    const { $appRoutes, $api }  = useNuxtApp();
    const isLoading             = ref(false);
    const documentLoadError     = ref(false);
    const {t, locale}           = useI18n();

    async function loadWorkflowBatch(){
        isLoading.value = true;

        try{
            const batchWorkflow =  await $api.kmWorkflows.getBatchWorkflowDetails(route.params.batchId);
        
            if([SCHEMAS.NATIONAL_TARGET_7, SCHEMAS.NATIONAL_TARGET_7_MAPPING].includes(batchWorkflow.schema))
                await useNavigateAppTo($appRoutes.NATIONAL_TARGETS_MY_COUNTRY)
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

    onMounted(() => {
      loadWorkflowBatch();  
    });

</script>

<style scoped>

</style>