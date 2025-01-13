<template>
    {{schemaTitle}}
</template>

<script setup lang="ts">
//@ts-nocheck
    const props = defineProps({
        schema  : {type:String, required:true},
        type    : {type:String, default:'title'}
    });
    const {locale}      = useI18n();
    const schemaDetails = useGetRealmSchema(props.schema);
    
    const schemaTitle = computed(()=>{
        if(props.type == 'title')
            return lstring(schemaDetails.title, locale);
        else if(props.type == 'titlePlural')
            return lstring(schemaDetails.titlePlural||schemaDetails.title, locale);
        else if(props.type == 'description')
            return lstring(schemaDetails.description||schemaDetails.title, locale);
    })
</script>

<style scoped>

</style>