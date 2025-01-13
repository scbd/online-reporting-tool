<template>
  <km-suspense>
    <edit-target-part-2></edit-target-part-2>
  </km-suspense>
</template>
  
  <script lang="ts">
//@ts-nocheck
  
  import { KmSuspense } from "~/components/controls";
  import EditTargetPart2 from "@/components/pages/national-targets/my-country/part-2/edit-target-part-2.vue";
      import { SCHEMAS, ROLES } from '@/utils';
  
  export default {
    components: {
      EditTargetPart2
    },
    setup(){

      definePageMeta({
          auth:true,
          schema:'nationalTarget7',
          roles:[...ROLES.ALL_NATIONAL_USERS],
      })
    }
  }
  </script>
  