import { defineStore } from 'pinia'
import type { ThesaurusTerm } from '~/types/api/thesaurus-term'
import type { EDictionary } from '~/types/schemas/base/EDictionary'

/**
 * Store for managing target tracker specific thesaurus data.
 * This store manages domain terms and individual terms for target tracking functionality.
 * 
 * @returns Pinia store with state, getters, and actions for target tracker thesaurus management
 */
export const useTargetTrackerStore = defineStore('targetTracker', {
  state: () => {
    return {
        domainTerms : {} as EDictionary<ThesaurusTerm[]>,
        terms       : {} as EDictionary<ThesaurusTerm>
    }
  },
  getters:{
    getDomainTerms(state){
      return (identifier:string):ThesaurusTerm[]=>{
        const domainTerms = this.domainTerms[identifier];
        return domainTerms;
      }
    },
    getTerm(state){
        return (term:string):ThesaurusTerm=>{
            return this.terms[term]
        }
    }
  },
  actions:{     
    async loadDomainTerms(identifier:string, params:any):Promise<ThesaurusTerm[] | undefined>{
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
    async loadTerm(identifier:string):Promise<ThesaurusTerm|undefined>{

        if(!this.terms[identifier]){
            
            const { $api } = useNuxtApp();
            const term  = await $api.thesaurus.getTerm(identifier);
            
            this.terms[identifier] = term;
        }

        return this.terms[identifier];

    },
  },
  persist: {
      storage: persistedState.sessionStorage, //TODO : switch to localStorage,
    //   beforeRestore: (ctx) => {
    //     console.log(`about to restore '${ctx.store.$id}'`)
    //   },
    //   afterRestore: (ctx) => {
    //     console.log(`just restored '${ctx.store.$id}'`)
    //   }
  }
})