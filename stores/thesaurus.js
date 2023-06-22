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
  
        let domain = this.domains?.find(e=>e.identifier==domainName)
        if(!domain){
          domain = await this.$api.thesaurs.getDomain(domainName);
          this.domains.push(domain);
        };
    },  
    async loadDomainTerms(identifier){
        if(!identifier)
          return;

        let terms = this.getDomainTerms(identifier)
        if(!terms){
          // console.log('calling await', identifier)
          terms = await this.$nuxt.$api.thesaurus.getDomainTerms(identifier);
          // console.log('finished await', identifier)
          this.domainTerms.push({identifier, terms});
          // console.log(this.getDomainTerms(identifier))
        }
        return terms;
    },  
    async loadTerm(){
      await this.$api.thesaurs.getDomain(domainName);
    },
  }
})