<template>
    <km-suspense>
      <edit-target></edit-target>
    </km-suspense>
</template>
  
<script setup lang="ts">
import { KmSuspense } from "@/components/controls";
import EditTarget from "@/components/pages/nbsap-targets/my-country/edit-target.vue";
import { ROLES } from '@/constants';

  definePageMeta({
    auth:true,
    schema:'nationalTarget7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
  })

</script>