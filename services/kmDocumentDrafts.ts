//@ts-nocheck
import { defineStore } from 'pinia'
import editFormUtility from './edit-form-utility'

class kmDocumentDrafts {


    async loadSchemaDrafts(schema:string|string[], government:string = null){

        let query = ''
        if(Array.isArray(schema))
            query = `(type eq '${schema.join("' or type eq '")}')`;
        else
            query = `(type eq '${schema}')`;

        if(government)
            query += ` and owner eq 'country:${government}'` ;

        const result = await this.loadDraftDocuments(query,500, 'updatedOn desc', 0, true);  

        return result.Items;

    }

    async loadDraftDocuments(query:string, rowsPerPage:number, 
      sort:string, pageNumber:number, body:boolean){
                    
        const queryParams = {
            $filter : query,
            collection : "mydraft",
            $top    : rowsPerPage,
            $skip   : (rowsPerPage*pageNumber),
            $orderby: sort||'updatedOn desc',
            body:body
        };
        
        const { $api } = useNuxtApp();
        const  data = await $api.kmStorage.drafts.query(queryParams);
                    
        return data;
    }

    async loadDraftDocument(identifier:string){
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