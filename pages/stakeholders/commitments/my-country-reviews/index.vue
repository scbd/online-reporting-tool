<template>
  <km-suspense>
      <my-country-reviews></my-country-reviews>
  </km-suspense>
  
</template>

<script setup lang="ts">

  import { SCHEMAS, ROLES } from '@/utils';

    definePageMeta({
        auth:true,
        roles:[ROLES.NATIONAL_FOCALPOINT],
        breadcrumbs : {}
    });

    // route.meta.breadcrumbs.replaceCrumb = [ {'nbsaps' : lstring(schema?.title, locale)} ];

</script>