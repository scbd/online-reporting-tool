import type { EDocumentInfo } from '../schemas/base/EDocumentInfo';

export interface KmDocumentQueryOptions{
     rowsPerPage?:number,
     sort?:string,
     pageNumber?:number,
     body?:boolean,
     collection?:string
}

export interface KmDocumentQueryResult{
     Items: EDocumentInfo[],
     Count?: number
}