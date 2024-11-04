import { type ApiOptions } from "~/types/api-schemas/api-options";
import type { MongoQuery } from '~/types/api-schemas/mongo-query';
import ApiBase, { tryCastToApiError } from './api-base';

export default class SubscriptionApi extends ApiBase
{
    constructor(options:ApiOptions) {
        super(options);
    }
    async get(id:String) {
        return useAPIFetch("/api/v2016/me/settings/"+id, {method:'GET'})
    }

    async add(body) {
        return useAPIFetch("/api/v2016/me/settings/", {method:'POST', body})
    }

    async update(id:String, body) {
        return useAPIFetch("/api/v2016/me/settings/" + id , {method:'PUT', body})
    }

    async delete(id:string) {
        return useAPIFetch(`/api/v2016/me/settings/${id}`, {method:'DELETE' });

    }
}