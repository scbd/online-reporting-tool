import { defineStore } from 'pinia'

export const useKmDocumentStore = defineStore('kmDocuments', {
  state: () => {
    return {
      documents: [],
    }
  },
  getters:{
    
  },
  actions:{
    async loadDocuments(){
        if(!this.documents?.length){

          const { $api }  = useNuxtApp();
          const documents = await $api.storage.documents.queryDocuments();
          this.documents = documents;
        };
    },
    async saveDraft(){
        if(!this.documents?.length){

          const { $api }  = useNuxtApp();
          const documents = await $api.storage.documents.queryDocuments();
          this.documents  = documents;
        };
    },
  }
})