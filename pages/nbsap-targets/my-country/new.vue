<template>
  <km-suspense>
    <edit-target></edit-target>
  </km-suspense>
</template>
  
  <script>
  
  import { KmSuspense } from "@/components/controls";
  import EditTarget from "@/components/pages/nbsap-targets/my-country/edit-target.vue";
  import { ROLES } from '@/constants';
  export default {
    components: {
      EditTarget
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
  