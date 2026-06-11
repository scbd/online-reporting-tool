
import { type ApiOptions } from "~/types/api/api-options";
import { type ApiListResponse } from "~/types/api/api-response";
import ApiBase from './api-base';
import type { MongoQuery } from "~/types/api/mongo-query";
import type { ECommitmentCountryReview, CommitmentReviewsStatsResponse, CommitmentReviewsQuery, CommitmentReviewsStatsQuery } from "~/types/schemas/ECommitmentCountryReview";
import type { EDocumentInfo } from "~/types/schemas/base/EDocumentInfo";

export default class KmStakeholderCommitmentApi extends ApiBase
{
    constructor(options:ApiOptions) {
        super(options);
    }
    
    
    async   getCountryReviews({identifier, government, realm, reviewed, reviewStatus} = {} as CommitmentReviewsQuery, 
        { count, length, skip, sort } = { count: 0, length : 25, skip: 0, sort: { 'meta.updatedOn': -1 }} as MongoQuery) 
            : Promise<ApiListResponse<ECommitmentCountryReview>> {
        const query = {
            identifier,
            government,
            realm,
            reviewed,reviewStatus,
            l: length,
            s: sort,
            sk: skip,
            c: count            
        }
        const data =  await useAPIFetch<ApiListResponse<ECommitmentCountryReview>>(`/api/v2023/documents/schemas/stakeholder-commitment/country-reviews`, {
              method:'GET', query
            })                
        return data;
    }

    async getCountryReviewStats({identifier, government, realm, reviewed, reviewStatus, countryStats, organizationStats} = {} as CommitmentReviewsStatsQuery) 
            : Promise<CommitmentReviewsStatsResponse> {

        const query = {
            identifier,
            government,
            realm,
            reviewed,reviewStatus,
            countryStats,
            organizationStats,
        }
        const data =  await useAPIFetch<CommitmentReviewsStatsResponse>(`/api/v2023/documents/schemas/stakeholder-commitment/country-reviews/stats`, {
              method:'GET', query
            })                
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