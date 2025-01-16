//@ts-nocheck
import { defineStore } from 'pinia'
import editFormUtility from './edit-form-utility'

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
        const  data = await $api.kmStorage.drafts.query(queryParams);
                    
        return data;
    }

    async loadDraftDocument(identifier:String){
      if(identifier){

        const { $api } = useNuxtApp();
        const data = await $api.kmStorage.drafts.get(identifier, {info:true, body:true});
        
        return data;

      };
    }

    async bulkPublish(realm, schemas,  identifiers){
        const res = await useAPIFetch(`/api/v2023/documents/bulk/publish`,{
            method: 'POST',
            query : {
                realm
            },
            body:{
                schemas,
                identifiers
            }
        });
        return res;
    }

    async saveDraftVersion(identifier, document){
                
        const { $api } = useNuxtApp();
        const  data = await $api.kmStorage.drafts.saveDraftVersion(identifier, document);
        
        return data;
    }
}

export const KmDocumentDraftsService = new kmDocumentDrafts();