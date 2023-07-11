<template>
    <km-suspense>
      <edit-target-part-1></edit-target-part-1>
    </km-suspense>
</template>
  
<script setup lang="ts">
import { KmSuspense } from "@/components/controls";
import EditTargetPart1 from "@/components/pages/nbsap-targets/my-country/part-1/edit-target-part-1.vue";

  definePageMeta({
    auth:true,
    schema:'nationalTarget7',
    roles:[...ROLES.ALL_NATIONAL_USERS],
    breadcrumbs : {
      skip : ['identifier']
    }
  })

</script>