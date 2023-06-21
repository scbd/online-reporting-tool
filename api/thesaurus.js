
import ApiBase, { tryCastToApiError } from './api-base';

export default class ThesaurusAPI extends ApiBase
{
  constructor(options) {
    super(options);
  }

  async getTerm(params)  {
    return this.$axios.get(`api/v2013/thesaurus`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

}