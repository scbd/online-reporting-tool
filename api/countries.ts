
import { type ApiOptions } from "~/types/api-schemas/api-options";
import ApiBase, { tryCastToApiError } from './api-base';

export default class CountriesAPI extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }

  async queryCountries(params:{})  {
    const data =  await useAPIFetch(`/api/v2013/countries`,  { method:'get', params })
                  
    return data;
  }

  async getCountry(code:string)  {

    const data =  await useAPIFetch(`/api/v2013/countries/${encodeURIComponent(code)}`)
  
    return data;
  }

}