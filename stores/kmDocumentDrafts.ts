import { defineStore } from 'pinia'

export const useKmDocumentDraftsStore = defineStore('kmDocumentDrafts', {
  state: () => {
    return {
      documentDrafts: [],

      errors : {},

      draftRecord : {},
      isBusy:false,
      validationErrors:[]
    }
  },
  getters:{
    
  },
  actions:{
    async loadDraftDocuments(query:any){
        if(!this.documentDrafts?.length){

          const { $api } = useNuxtApp();
          const { data:documentDrafts } = await $api.kmStorage.drafts.query();
          this.documentDrafts = documentDrafts;
        };
    },

    async loadDraftDocument(identifier:String){
      if(identifier){

        this.isBusy = true
        const { $api } = useNuxtApp();
        const { data:draftRecord } = await $api.kmStorage.drafts.get(identifier, {info:true, body:true});
        
        this.draftRecord = draftRecord;
        this.isBusy = false;
      };
  },
    async saveDraft(identifier:string, draft:any){
        if(draft){

          // try{
            this.isBusy = true
            this.errors = [];

            const { $api } = useNuxtApp();
            const { data:draftRecord, error } = await $api.kmStorage.drafts.put(identifier, draft, {schema:draft.header.schema});

            this.draftRecord = draftRecord;
            this.errors = error
            this.isBusy = false;
          // }
          
        };
    },
  }
})