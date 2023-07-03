<template>
  <EditTarget></EditTarget>
</template>
  
  <script>
  
  import EditTarget from "@/components/pages/nbsap-targets/edit-target.vue";
import { ROLES } from '~/constants';
  export default {
    components: {
      EditTarget
    },
    name: 'TargetEditNew',
    meta:{
      schema:'nationalTarget7'
    },
    roles:[ROLES.PUBLISHING_AUTHORITIES, ROLES.NATIONAL_AUTHORIZED_USER, ROLES.NATIONAL_FOCALPOINT],
    data(){
      return {
        document : {}
      }
    },
    methods :{
      submitDocument (){
        this.$router.push('/nbsap-targets')
      }
    }
  }
  </script>
  