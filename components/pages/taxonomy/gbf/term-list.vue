<template>
    <table class="table table-bordered">
    <thead>
      <tr>
        <th colspan="2">
          {{header}}
        </th>
      </tr>
      <tr>
        <th class="w-25">
          {{ t('code') }}   
        </th>
        <th>{{ t('title') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="term in terms" :key="term">
        <td>{{ term.identifier }}</td>
        <td>
            <km-link :to="`${linkUrl.replace(':identifier', term.identifier)}`">
                {{ lstring(term.title) }}
          </km-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<i18n src="@/i18n/dist/components/pages/taxonomy/gbf/term-list.json"></i18n>
<script setup lang="ts">
//@ts-nocheck
    const {t} = useI18n();
    defineProps({
        header : {type:String, require:true},
        terms   : {type:Object, required:true},
        linkUrl : {type:String, default:appRoutes.TAXONOMY_GBF_DETAILS}
    })

</script>

<style scoped>

</style>