<template>
    <table class="table table-hover" v-if="term">
        <thead>
        <tr>
            <th colspan="2">
            {{header}}
            </th>
        </tr>  
        <tr>
            <td class="w-25"></td>
            <td></td>
        </tr>    
        </thead>
        <tbody>
            <tr>
                <td>{{ t('code') }}</td>
                <td>{{ term.identifier }}</td>
            </tr>
            <tr v-if="term.title">
                <td>{{ t('title') }}</td>
                <td>{{ lstring(term.title) }}</td>
            </tr>
            <tr v-if="term.shortTitle">
                <td>{{ t('shortTitle') }}</td>
                <td>{{ lstring(term.shortTitle) }}</td>
            </tr>
            <tr v-if="term.description">
                <td>{{ t('description') }}</td>
                <td>{{ lstring(term.description) }}</td>
            </tr>
            <tr v-if="term.longDescription">
                <td>{{ t('longDescription') }}</td>
                <td>{{ lstring(term.longDescription) }}</td>
            </tr>
            <tr v-if="term.broaderTerms && /GBF\-INDICATOR/.test(term.identifier)">
                <td>{{ t('linkedWith') }}</td>
                <td>
                    <ul class="list-group">
                        <li class="list-group-item" v-for="xTerm in term.broaderTerms" :key="xTerm">
                            <!-- <km-link class="pe-1" :to="appRoutes.TAXONOMY_GBF_DETAILS.replace(':identifier', xTerm)"  -->
                            <!-- v-if="/^GBF/.test(xTerm)">{{ xTerm }}</km-link> -->
                             {{ xTerm }}
                        </li>
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<i18n src="@/i18n/dist/components/pages/taxonomy/gbf/term-details.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    const {t} = useI18n();
    defineProps({
        header : {type:String, require:true},
        term   : {type:Object, required:true}
    })
</script>

<style scoped>

</style>