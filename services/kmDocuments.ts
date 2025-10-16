//@ts-nocheck
import { defineStore } from 'pinia'

class kmDocuments {

    async loadSchemaDocuments(schema:string|string[], government:string = null, 
        {rowsPerPage= 500, sort= 'updatedOn desc', pageNumber= 0, body= true, collection="my"} : KmDocumentQueryOptions = {}):Promise<EDocumentInfo[]>{
     
        let query = ''
        if(Array.isArray(schema))
            query = `(type eq '${schema.join("' or type eq '")}')`;
        else
            query = `(type eq '${schema}')`;

        if(government)
          query += ` and owner eq 'country:${government}'` ;

      const result = await this.loadDocuments(query,rowsPerPage, sort, pageNumber, body, collection);  

      return result.Items;

    }

    async loadDocuments(query:string, rowsPerPage:number, 
      sort:string, pageNumber:number, body:boolean, collection:string='my'):Promise<KmDocumentQueryResult>{
                    
        const queryParams = {
            $filter : query,
            collection: collection,
            $top    : rowsPerPage,
            $skip   : (rowsPerPage*pageNumber),
            $orderby: sort||'updatedOn desc',
            body:body
        };
        
        const { $api } = useNuxtApp();
        const  data = await $api.kmStorage.documents.query(queryParams);
                    
        return data;
    }

    async loadDocument(identifier:String):EDocumentInfo{
      if(identifier){

        const { $api } = useNuxtApp();
        const data = await $api.kmStorage.documents.get(identifier, {info:true, body:true});
        
        return data;

      };
    }
}

export const KmDocumentsService = new kmDocuments();