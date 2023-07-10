import { defineStore } from 'pinia'

export const useKmDocumentDraftsStore = defineStore('kmDocumentDrafts', {
  state: () => {
    return {
      documentDrafts: [],

      errors : [],

      draftRecord : {},
      isBusy:false,
      validationErrors:[]
    }
  },
  getters:{
    
  },
  actions:{
    async loadDraftDocuments(query:string, rowsPerPage:number, 
      sort:String, pageNumebr:number, body:boolean){
                    
        const queryParams = {
            $filter : query,
            collection : "mydraft",
            $top    : rowsPerPage,
            $skip   : (rowsPerPage*pageNumebr),
            $orderby: sort||'updatedOn desc',
            body:body
        };
        this.errors = []
        this.isBusy = true;
        const { $api } = useNuxtApp();
        const { data:documentDrafts, error } = await $api.kmStorage.drafts.query(queryParams);
        
        this.errors.push(error)
        this.documentDrafts = documentDrafts;
        this.isBusy = false;
    },

    async loadDraftDocument(identifier:String){
      if(identifier){

        this.isBusy = true;
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