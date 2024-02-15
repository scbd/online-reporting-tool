<template>
    <CAlert color="danger" class="d-flex align-items-center">
        <font-awesome-icon icon="fa-solid fa-triangle-exclamation" size="2x"/>
        <span class="p-2">
            <slot name="message">
                {{t('errorMessage')}}
            </slot>

        </span>
        <br/>
        <btn-new-target :query="query" :identifier="identifier"></btn-new-target>        
    </CAlert>
</template>
<i18n src="@/i18n/dist/components/pages/national-targets/my-country/missing-target-error.json"></i18n>
<script setup lang="ts">
    import btnNewTarget from './btn-new-target.vue';
    
    const { t }       = useI18n(); 
    const props = defineProps({
        identifier   : { type:String, required:false},
        query : { type:Object, required:false}
    });

    const { query, identifier } = toRefs(props);
    

</script>

<style scoped>

</style>