import { defineStore } from 'pinia'

export const useThesaurusStore = defineStore('thesaurus', {
  state: () => {
    return {
      domains: [],
      domainTerms : [],
      terms       : {}
    }
  },
  getters:{
    getDomainTerms(state){
      return function (identifier){
        const domainTerms = this.domainTerms.find(e=>e.identifier == identifier)
        // console.log(identifier, domainTerms, this.domainTerms.length)
        return domainTerms?.terms;
      }
    }
  },
  actions:{
    async loadDomain(domainName){
      
        const { $api } = useNuxtApp();
        let domain = this.domains?.find(e=>e.identifier==domainName)
        if(!domain){
          domain = await $api.thesaurs.getDomain(domainName);
          this.domains.push(domain);
        };
    },  
    async loadDomainTerms(identifier){
        if(!identifier)
          return;

        let terms = this.getDomainTerms(identifier)
        if(!terms){

          const { $api } = useNuxtApp();
          ({ data:terms } = await $api.thesaurus.getDomainTerms(identifier));
          this.domainTerms.push({identifier, terms});
        }
        return terms;
    },  
    async loadTerm(){

      const { $api } = useNuxtApp();
      await $api.thesaurs.getDomain(domainName);
    },
  }
})