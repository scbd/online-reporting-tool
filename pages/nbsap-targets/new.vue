<template>
  <EditTarget></EditTarget>
</template>
  
  <script>
  
  import EditTarget from "@/components/pages/nbsap-targets/edit-target.vue";
import { useThesaurusStore } from '~/stores/thesaurus';
import { GBF_GLOBAL_GOALS, GBF_GLOBAL_TARGETS, GBF_TARGETS_CONSIDERATIONS } from '~/constants';
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
    // async fetch(){
    //     const thesaurusStore = useThesaurusStore(this.$pinia);
    //     //   console.log('calling actions')
    //     const response = await Promise.all([
    //         thesaurusStore.loadDomainTerms(GBF_GLOBAL_TARGETS),
    //         thesaurusStore.loadDomainTerms(GBF_GLOBAL_GOALS),
    //         thesaurusStore.loadDomainTerms(GBF_TARGETS_CONSIDERATIONS)
    //     ]);
    //     this.gbfTargets             = response[0]
    //     this.gbfGoals               = response[1]
    //     this.gbfTargetConsideration = response[2]
    //     // console.log('finished actions')
    // },
    methods :{
      submitDocument (){
        this.$router.push('/nbsap-targets')
      }
    }
  }
  </script>
  