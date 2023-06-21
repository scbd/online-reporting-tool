
import ApiBase, { tryCastToApiError } from './api-base';

export default class CountriesAPI extends ApiBase
{
  constructor(options) {
    super(options);
  }

  async queryCountries(params)  {
    return this.$axios.get(`api/v2013/countries`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getCountry(code)  {

    return this.$axios.get(`api/v2013/countries/${code}`)
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

}