<template>
    <div v-if="documentError">
        <CAlert color="danger" class="d-flex align-items-center">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
            <div v-if="documentError==404">
                {{t('notFound')}}
                <span class="col-12 ps-1 pt-2" v-if="security.role.isAdministrator() ">
                    <a :href="`${$route.path}?draft=true`">{{t('loadDraftAdminOnly')}}</a>
                </span>
            </div>
            <div v-else-if="documentError==401 || documentError==403">
                {{t('notAuthorized')}}
            </div>
            <div v-else>
                {{ toRaw('generalError') }}
            </div>
        </CAlert>
    </div>
</template>

<i18n src="@/i18n/dist/common/errors.json"></i18n>

<script setup lang="ts">
//@ts-nocheck
    const { locale, t } = useI18n();
    const security      = useSecurity();
    
    const props = defineProps({
                        documentError : { type:Object, required:true}
                    });

    const { documentError } = toRefs(props);

</script>

<style scoped>

</style>