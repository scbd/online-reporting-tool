import type { EDocumentInfo } from '~/types/schemas/base/EDocumentInfo';
import type { KmDocumentQueryOptions, KmDocumentQueryResult } from '~/types/api/km-documents';

async function loadSchemaDocuments(schema:string|string[], government?:string|null,
    {rowsPerPage= 500, sort= 'updatedOn desc', pageNumber= 0, body= true, collection="my"} : KmDocumentQueryOptions = {}):Promise<EDocumentInfo[]>{

    let query = ''
    if(Array.isArray(schema))
        query = `(type eq '${schema.join("' or type eq '")}')`;
    else
        query = `(type eq '${schema}')`;

    if(government)
      query += ` and owner eq 'country:${government}'` ;

    const result = await loadDocuments(query, rowsPerPage, sort, pageNumber, body, collection);

    return result.Items;
}

async function loadDocuments(query:string, rowsPerPage:number,
    sort:string|undefined, pageNumber:number, body:boolean, collection:string='my'):Promise<KmDocumentQueryResult>{

    const queryParams = {
        $filter : query,
        collection: collection,
        $top    : rowsPerPage,
        $skip   : (rowsPerPage*pageNumber),
        $orderby: sort||'updatedOn desc',
        body:body
    };

    const { $api } = useNuxtApp();
    return await $api.kmStorage.documents.query(queryParams) as KmDocumentQueryResult;
}

async function loadDocument(identifier:string):Promise<EDocumentInfo>{
    const { $api } = useNuxtApp();
    return await $api.kmStorage.documents.get(identifier, {info:true, body:true}) as EDocumentInfo;
}

export const KmDocumentsService = { loadSchemaDocuments, loadDocuments, loadDocument };
