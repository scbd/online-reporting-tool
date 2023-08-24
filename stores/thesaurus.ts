import { defineStore } from 'pinia'

export const useThesaurusStore = defineStore('thesaurus', {
  state: () => {
    return {
      domains: {},
      domainTerms : {},
      terms       : {}
    }
  },
  getters:{
    getDomainTerms(state){
      return function (identifier){
        const domainTerms = this.domainTerms[identifier];
        return domainTerms;
      }
    },
    getTerm(state){
        return function (term){
            return this.terms[term]
        }
    }
  },
  actions:{
    async loadDomain(domainName:string, params:any){
      
        const { $api } = useNuxtApp();
        let domain = this.domains[domainName]
        if(!domain){
          domain = await $api.thesaurs.getDomain(domainName, params);
          this.domains.push(domain);
        };
    },  
    async loadDomainTerms(identifier:string, params:any){
        if(!identifier)
          return;
        let terms = this.getDomainTerms(identifier)
        if(!terms){

          const { $api } = useNuxtApp();
          terms  = await $api.thesaurus.getDomainTerms(identifier, params);
          this.domainTerms[identifier] = terms;
          
          terms.forEach(term => {
            this.terms[term.identifier] = term;
          });
        }
        return terms;
    },  
    async loadTerm(identifier:string){

        if(!this.terms[identifier]){
            
            const { $api } = useNuxtApp();
            const term  = await $api.thesaurus.getTerm(identifier);
            
            this.terms[identifier] = term;
        }

        return this.terms[identifier];

    },
  },
  persist: {
      storage: persistedState.localStorage, //TODO : switch to localStorage,
    //   beforeRestore: (ctx) => {
    //     console.log(`about to restore '${ctx.store.$id}'`)
    //   },
    //   afterRestore: (ctx) => {
    //     console.log(`just restored '${ctx.store.$id}'`)
    //   }
  }
})