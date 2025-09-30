
import { type ApiOptions } from "~/types/api/api-options";
import ApiBase from './api-base';
import type { MongoQuery } from "~/types/api/mongo-query";
import type { StakeholderEndorsement } from "~/types/schemas/EStakeholderEndorsement";
import type { EDocumentInfo } from "~/types/schemas/base/EDocumentInfo";

export default class KmStakeholderCommitmentApi extends ApiBase
{
    constructor(options:ApiOptions) {
        super(options);
    }
    
    
    async getEndorsements({identifier, government} = {} as {identifier?: string, government : string}, 
        { count, length, skip, sort } = 
            { count: false, length : 25, skip: 0, sort: { 'meta.updatedOn': -1 }} as MongoQuery) : Promise<StakeholderEndorsement[]> {
        const query = {
            identifier,
            government,
            l: length,
            s: sort,
            sk: skip,
            c: count
        }
        const data =  await useAPIFetch<StakeholderEndorsement[]>(`/api/v2023/documents/schemas/stakeholder-commitment/endorsements`, { baseURL:'http://localhost:8000', method:'GET', query })                
        return data;
    }

    async getCountryCommitment(identifier:string):Promise<EDocumentInfo>  {

        const data =  await useAPIFetch<EDocumentInfo>(`/api/v2023/documents/schemas/stakeholder-commitment/endorsements/${identifier}`,  {baseURL:'http://localhost:8000', method:'GET' })                
        return data;
    }

    async endorseCountryCommitment(identifier:string) {
        return useAPIFetch(`/api/v2023/documents/schemas/stakeholder-commitment/endorsements/${identifier}`, {baseURL:'http://localhost:8000', method:'POST'})
    }

    async renounceCountryCommitment(identifier:string) {
        return useAPIFetch(`/api/v2023/documents/schemas/stakeholder-commitment/endorsements/${identifier}`, {baseURL:'http://localhost:8000', method:'DELETE'})
    }
}