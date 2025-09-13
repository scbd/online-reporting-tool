import { defineStore } from 'pinia'
import type { ThesaurusTerm } from '~/types/api/thesaurus-term'
import type { EDictionary } from '~/types/schemas/base/EDictionary'

/**
 * Target Tracker store for managing thesaurus terms specific to target tracking functionality
 * @returns Pinia store instance for target tracker thesaurus operations
 */
export const useTargetTrackerStore = defineStore('targetTracker', {
  state: () => {
    return {
        domainTerms : {} as EDictionary<ThesaurusTerm[]>,
        terms       : {} as EDictionary<ThesaurusTerm>
    }
  },
  getters:{
    /**
     * Returns domain terms for a given identifier
     * @param {string} identifier - The domain identifier
     * @returns {Function} Function that returns ThesaurusTerm array for the identifier
     */
    getDomainTerms(state){
      return (identifier:string):ThesaurusTerm[]=>{
        const domainTerms = this.domainTerms[identifier];
        return domainTerms;
      }
    },
    /**
     * Returns a specific thesaurus term by identifier
     * @param {string} term - The term identifier
     * @returns {Function} Function that returns the ThesaurusTerm
     */
    getTerm(state){
        return (term:string):ThesaurusTerm=>{
            return this.terms[term]
        }
    }
  },
  actions:{
    /**
     * Loads domain terms for a specific identifier with caching
     * @param {string} identifier - The domain identifier to load terms for
     * @param {any} params - Additional parameters for the API call
     * @returns {Promise<ThesaurusTerm[] | undefined>} Promise resolving to array of thesaurus terms
     */
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
    /**
     * Loads a specific thesaurus term by identifier with caching
     * @param {string} identifier - The term identifier to load
     * @returns {Promise<ThesaurusTerm|undefined>} Promise resolving to the thesaurus term
     */
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