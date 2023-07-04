
import ApiBase, { tryCastToApiError } from './api-base';

export default class CountriesAPI extends ApiBase
{
  constructor(options) {
    super(options);
  }

  async queryCountries(params)  {
    const { data, pending, error, refresh } =  await useAPIFetch(`/api/v2013/countries`,  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }

  async getCountry(code)  {

    const { data, pending, error, refresh } =  await useAPIFetch(`/api/v2013/countries/${encodeURIComponent(code)}`)
  
    return { data : data?.value, pending, error, refresh };
  }

}