//@ts-nocheck

import { type ApiOptions } from "~/types/api/api-options";
import ApiBase from './api-base';

export default class CountriesAPI extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }

  async queryCountries(params:object = {})  {
    const data =  await useAPIFetch(`/api/v2013/countries`,  { method:'get', params })
                  
    return data;
  }

  async getCountry(code:string)  {

    const data =  await useAPIFetch(`/api/v2013/countries/${encodeURIComponent(code)}`)
  
    return data;
  }

}