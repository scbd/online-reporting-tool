
import ApiBase, { tryCastToApiError } from './api-base';

export default class RealmConfigurationAPI extends ApiBase
{
  constructor(options) {
    super(options);
  }

  async queryRealmConfigurations(params)  {
    return $fetch.get(`/api/v2018/realm-configurations`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getRealmConfigurationByHost(host)  {

    if(!host){
      host = useRuntimeConfig().public.REALM_CONF_HOST
    }

    const { data, pending, error, refresh } =  await useAPIFetch(`/api/v2018/realm-configurations/${encodeURIComponent(host)||''}`)
  
    return data.value;
  }

}