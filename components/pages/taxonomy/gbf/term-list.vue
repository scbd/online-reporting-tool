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
          Code
        </th>
        <th>Title</th>
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
<script setup lang="ts">
    defineProps({
        header : {type:String, require:true},
        terms   : {type:Object, required:true},
        linkUrl : {type:String, default:appRoutes.TAXONOMY_GBF_DETAILS}
    })

</script>

<style scoped>

</style>