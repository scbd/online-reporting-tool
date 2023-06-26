<template>
  <EditTarget></EditTarget>
</template>
  
  <script>
  
  import EditTarget from "@/components/pages/nbsap-targets/edit-target.vue";
  export default {
    components: {
      EditTarget
    },
    name: 'TargetEditNew',
    meta:{
      schema:'nationalTarget7'
    },
    roles:['publishingAuthority', 'nationalAuthorizedUser'],
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
  