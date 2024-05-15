<template>
     <CCard>
        <CCardBody>
            <cbd-article :query="articleQuery()" show-edit="true">
                <template #missingArticle>
                    <CAlert color="success" v-bind:visible="true">
                        <CAlertHeading>{{t('notFoundHeader')}}!</CAlertHeading>
                        <hr />
                        <p class="mb-0">{{t('notFound')}}</p>
                    </CAlert>
                </template>
            </cbd-article>
        </CCardBody>
    </CCard>
</template>

<script setup lang="ts">
    import {useRoute } from 'vue-router';

    const {t} = useI18n();
    const route = useRoute()

    definePageMeta({
        auth:false,
        breadcrumbs : {
            skip : ['identifier']
        }
    })

    function articleQuery(){
        const ag = [];
        if (isObjectId(route.params?.identifier))
            ag.push({ $match: { _id: mapObjectId(route.params.identifier) } });        
        
        return {
            "ag" : JSON.stringify(ag)
        };
    }

</script>

<style lang="scss" scoped>

</style>