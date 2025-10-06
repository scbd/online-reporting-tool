
import { type ApiOptions } from "~/types/api/api-options";
import ApiBase from './api-base';
import type { MongoQuery } from "~/types/api/mongo-query";
import type { ECommitmentCountryReview } from "~/types/schemas/ECommitmentCountryReview";
import type { EDocumentInfo } from "~/types/schemas/base/EDocumentInfo";

export default class KmStakeholderCommitmentApi extends ApiBase
{
    constructor(options:ApiOptions) {
        super(options);
    }
    
    
    async getCountryReviews({identifier, government} = {} as {identifier?: string, government?: string}, 
        { count, length, skip, sort } = 
            { count: false, length : 25, skip: 0, sort: { 'meta.updatedOn': -1 }} as MongoQuery) : Promise<ECommitmentCountryReview[]> {
        const query = {
            identifier,
            government,
            l: length,
            s: sort,
            sk: skip,
            c: count
        }
        const data =  await useAPIFetch<ECommitmentCountryReview[]>(`/api/v2023/documents/schemas/stakeholder-commitment/country-reviews`, {  method:'GET', query })                
        return data;
    }

    async getCountryCommitment(identifier:string):Promise<EDocumentInfo>  {

        const data =  await useAPIFetch<EDocumentInfo>(`/api/v2023/documents/schemas/stakeholder-commitment/country-reviews/${identifier}`,  { method:'GET' })                
        return data;
    }

    async reviewCountryCommitment(identifier:string) {
        return useAPIFetch(`/api/v2023/documents/schemas/stakeholder-commitment/country-reviews/${identifier}`, { method:'POST'})
    }

    async returnCountryCommitment(identifier:string) {
        return useAPIFetch(`/api/v2023/documents/schemas/stakeholder-commitment/country-reviews/${identifier}`, { method:'DELETE'})
    }
}