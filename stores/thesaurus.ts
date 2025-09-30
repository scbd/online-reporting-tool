//@ts-nocheck
import { defineStore } from 'pinia'
import {THESAURUS} from '@/utils/constants'
import type { ETerm } from '~/types/schemas/base/ETerm'

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
        return function (term):ETerm {
            return this.terms[term]
        }
    }
  },
  actions:{
    async loadDomain(domainName:string, params:any){
      
        const { $api } = useNuxtApp();
        let domain = this.domains[domainName]
        if(!domain){
          domain = await $api.thesaurus.getDomain(domainName, params);
          this.domains.push(domain);
        };
    },  
    async loadDomainTerms(identifier:string, {relations, other}:any = {}){
        if(!identifier)
          return;
        let terms = this.getDomainTerms(identifier)
        if(!terms){
          const params = {
            relations: relations
          }
          const { $api } = useNuxtApp();
          terms  = await $api.thesaurus.getDomainTerms(identifier, params);console.log(other);
          if(other){
            const otherTerm = await this.loadTerm(THESAURUS.OTHER);
            terms.push(otherTerm);
          }
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
      storage: persistedState.sessionStorage, //TODO : switch to localStorage,
    //   beforeRestore: (ctx) => {
    //     console.log(`about to restore '${ctx.store.$id}'`)
    //   },
    //   afterRestore: (ctx) => {
    //     console.log(`just restored '${ctx.store.$id}'`)
    //   }
  }
})