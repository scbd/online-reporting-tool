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
        this.documentDrafts = await $api.kmStorage.drafts.query(queryParams);
        
        this.isBusy = false;

        return this.documentDrafts;
    },

    async loadDraftDocument(identifier:String){
      if(identifier){

        this.isBusy = true;
        const { $api } = useNuxtApp();
        this.draftRecord  = await $api.kmStorage.drafts.get(identifier, {info:true, body:true});
        
        this.isBusy = false;
      };
  },
    async saveDraft(identifier:string, draft:any){
        if(draft){

          // try{
            this.isBusy = true
            this.errors = [];

            const { $api } = useNuxtApp();
            const draftRecord = await $api.kmStorage.drafts.put(identifier, draft, {schema:draft.header.schema});

            this.isBusy = false;
          // }
          
        };
    },
  }
})