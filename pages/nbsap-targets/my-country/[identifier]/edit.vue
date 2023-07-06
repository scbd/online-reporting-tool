<template>
  <edit-target></edit-target>
</template>
  
<script setup lang="ts">

import EditTarget from "@/components/pages/nbsap-targets/edit-target.vue";
import { ROLES } from '~/constants';

  definePageMeta({
    auth:true,
    schema:'nationalTarget7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
  })

</script>