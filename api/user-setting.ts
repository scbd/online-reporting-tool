//@ts-nocheck
import { type ApiOptions } from "~/types/api/api-options";
import type { MongoQuery } from '~/types/api/mongo-query';
import ApiBase from './api-base';
import type { UserSetting } from "~/types/api/user-setting";

export default class SubscriptionApi extends ApiBase
{
    constructor(options:ApiOptions) {
        super(options);
    }
    async get(id:String):Promise<UserSetting> {
        return useAPIFetch("/api/v2016/me/settings/"+id, {method:'GET'})
    }

    async add(body):Promise<any> {
        return useAPIFetch("/api/v2016/me/settings/", {method:'POST', body})
    }

    async update(id:String, body):Promise<any> {
        return useAPIFetch("/api/v2016/me/settings/" + id , {method:'PUT', body})
    }

    async delete(id:string):Promise<any> {
        return useAPIFetch(`/api/v2016/me/settings/${id}`, {method:'DELETE' });

    }
}