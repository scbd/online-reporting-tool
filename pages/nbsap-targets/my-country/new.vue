<template>
  <EditTarget></EditTarget>
</template>
  
  <script>
  
  import EditTarget from "@/components/pages/nbsap-targets/edit-target.vue";
import { ROLES } from '@/constants';
  export default {
    components: {
      EditTarget
    },
    name: 'TargetEditNew',
    data(){
      return {
        document : {}
      }
    },
    methods :{
      submitDocument (){
        this.$router.push('/nbsap-targets')
      }
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
  