//@ts-nocheck
import { defineStore } from 'pinia'

export const useCountriesStore = defineStore('countries', {
  state: () => {
    return {
      countries: [],
    }
  },
  getters:{
    
  },
  actions:{
    async loadCountries(){
        if(!this.countries?.length){

          const { $api } = useNuxtApp();
          const data = await $api.countries.queryCountries();
          this.countries = data;
        };
    },
  },
  persist: {
      storage: persistedState.sessionStorage,
  }
})