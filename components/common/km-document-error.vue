<template>
    <div v-if="documentError">
        <CAlert color="danger" class="d-flex align-items-center">
            <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
            <div v-if="documentError==404">
                {{t('notFound')}}
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
    const { locale, t } = useI18n();
    const props = defineProps({
                        documentError : { type:Object, required:true}
                    });

    const { documentError } = toRefs(props);

</script>

<style scoped>

</style>