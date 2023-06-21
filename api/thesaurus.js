
import ApiBase, { tryCastToApiError } from './api-base';

export default class ThesaurusAPI extends ApiBase
{
  constructor(options) {
    super(options);
  }

  async getDomains(domainIdentifier, params)  {
    return this.$axios.get(`api/v2013/thesaurus/domains/${encodeURIComponent(domainIdentifier)}`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getDomainTerms(termIdentifier, params)  {
    return this.$axios.get(`api/v2013/thesaurusdomains/${encodeURIComponent(termIdentifier)}/terms'`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getTerm(termIdentifier, params)  {
    return this.$axios.get(`api/v2013/thesaurus/terms/${encodeURIComponent(termIdentifier)}`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }
}