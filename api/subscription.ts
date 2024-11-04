import { type ApiOptions } from "~/types/api-schemas/api-options";
import type { MongoQuery } from '~/types/api-schemas/mongo-query';
import ApiBase, { tryCastToApiError } from './api-base';

export default class SubscriptionApi extends ApiBase
{
    constructor(options:ApiOptions) {
        super(options);
    }
        
    async list(query:Object, options : MongoQuery) {  
        
        const { count, length, skip, sort } = options || {};
        const httpQuery = {
            q : JSON.stringify(query||{}),
            l : length   ||25,
            s : sort,
            sk: skip     ||0,
            c : count
        };

        const data =  await useAPIFetch(`/api/v2016/me/subscriptions`,  { method:'get', query:httpQuery })                
        return data;
    }

    async get(id:String)  {

        const data =  await useAPIFetch(`/api/v2016/me/subscriptions/${encodeURIComponent(id)}`,  { method:'get' })                
        return data;
    }

    async add(body:Subscription) {
        return useAPIFetch("/api/v2016/me/subscriptions/", {method:'POST', body})
    }

    async update(id:String, body:Subscription) {
        return useAPIFetch("/api/v2016/me/subscriptions/" + id , {method:'PUT', body})
    }

    async delete(id:string) {
        return useAPIFetch(`/api/v2016/me/subscriptions/${id}`, {method:'DELETE' });

    }
}