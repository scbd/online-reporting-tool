<template>
    <span>
        <CAlert color="danger" v-if="error">{{ t('error')}} {{ value.identifier }}</CAlert>
        {{ lstring(term.title, locale) }}
        <slot name="help" :term="term">

        </slot>
    </span>
</template>
<i18n src="@/i18n/dist/components/controls/view/KmTerm.json"></i18n>
<script setup lang="ts">

    import { useThesaurusStore }    from '@/stores/thesaurus';

    const emit = defineEmits(['onTermLoad'])
    const props = defineProps({
        value   : {type:Object, required:true },
        locale  : {type:String, required:true },
    })
    const { t } = useI18n();
    const { value, locale } = toRefs(props);

    const { $api }          = useNuxtApp();
    const thesaurusStore    = useThesaurusStore ();

    let term:any;
    let error:any
    if(!value.value?.identifier || value.value){

        try{
            
            term = await  thesaurusStore.loadTerm(value.value?.identifier||value.value);

            if(term){
                emit('onTermLoad', term);
            }
        }
        catch(error){
            useLogger().error(`Error loading term ${value.value}`, error);
        }
    }

</script>

<style scoped>

</style>