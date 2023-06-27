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
          const lcountries = await this.$nuxt.$api.countries.queryCountries();
          this.countries = lcountries;
        };
    },
  }
})