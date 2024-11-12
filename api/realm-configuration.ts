
import { type ApiOptions } from "~/types/api/api-options";
import ApiBase from './api-base';

export default class RealmConfigurationAPI extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }

  async getRealmConfigurationByHost(host:string)  {

    if(!host){
      host = window.location.host || useRuntimeConfig().public.REALM_CONF_HOST
    }

    const data  =  await useAPIFetch(`/api/v2018/realm-configurations/${encodeURIComponent(host)||''}`)
  
    return data;
  }

}