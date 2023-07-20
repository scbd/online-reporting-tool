import { defineStore } from 'pinia'

class kmDocumentDrafts {

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
        
        const { $api } = useNuxtApp();
        const { data, error } = await $api.kmStorage.drafts.query(queryParams);
        if(error?.value)
            throw error;
            
        return data;
    }

    async loadDraftDocument(identifier:String){
      if(identifier){

        const { $api } = useNuxtApp();
        const { data, error } = await $api.kmStorage.drafts.get(identifier, {info:true, body:true});
        if(error?.value)
            throw error;

        return data;

      };
    }
    async saveDraft(identifier:string, draft:any){
        if(draft){

            const { $api } = useNuxtApp();
            const { data, error } = await $api.kmStorage.drafts.put(identifier, draft, {schema:draft.header.schema});

            if(error?.value)
                throw error;
            
            return data;
            // this.errors = Array.isArray(error.value) ? error : [error]            
          
        };
    }
}

export const KmDocumentDraftsService = new kmDocumentDrafts();