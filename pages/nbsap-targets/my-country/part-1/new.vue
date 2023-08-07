<template>
  <km-suspense>
    <edit-target-part-1></edit-target-part-1>
  </km-suspense>
</template>
  
  <script>
  
    import { SCHEMAS, ROLES } from '@/utils';
  import { KmSuspense } from "@/components/controls";
  import EditTargetPart1 from "@/components/pages/nbsap-targets/my-country/part-1/edit-target-part-1.vue";
  export default {
    components: {
      EditTargetPart1
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
  