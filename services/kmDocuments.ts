//@ts-nocheck
import { defineStore } from 'pinia'

class kmDocuments {

    async loadDocuments(query:string, rowsPerPage:number, 
      sort:String, pageNumber:number, body:boolean){
                    
        const queryParams = {
            $filter : query,
            collection : "my",
            $top    : rowsPerPage,
            $skip   : (rowsPerPage*pageNumber),
            $orderby: sort||'updatedOn desc',
            body:body
        };
        
        const { $api } = useNuxtApp();
        const  data = await $api.kmStorage.documents.query(queryParams);
                    
        return data;
    }

    async loadDocument(identifier:String){
      if(identifier){

        const { $api } = useNuxtApp();
        const data = await $api.kmStorage.documents.get(identifier, {info:true, body:true});
        
        return data;

      };
    }
}

export const KmDocumentsService = new kmDocuments();