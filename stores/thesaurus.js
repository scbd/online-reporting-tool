import { defineStore } from 'pinia'

export const useThesaurusStore = defineStore('thesaurus', {
  state: () => {
    return {
      domains: [],
      domainTerms : {},
      terms       : {}
    }
  },
  getters:{
    getDomainTerms : (state)=> {
      return (identifier)=>{
        return state.domainTerms[identifier];
      }
    }
  },
  actions:{
    async loadDomain(domainName){
  
        let domain = this.domains?.find(e=>e.identifier==domainName)
        if(!domain){
          domain = await this.$api.thesaurs.getDomain(domainName);
          this.domains.push(domain);
        };
  
    },  
    async loadDomainTerms(identifier){
        if(!identifier)
          return;

        let term = this.domains?.find(e=>e.identifier==identifier)
        if(!term){
          term = await this.$nuxt.$api.thesaurus.getDomainTerms(identifier);
          this.domainTerms[identifier] = term;
        }

    },  
    async loadTerm(){
      await this.$api.thesaurs.getDomain(domainName);
    },
  }
})