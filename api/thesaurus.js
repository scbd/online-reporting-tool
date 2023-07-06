
import ApiBase, { tryCastToApiError } from './api-base';

export default class ThesaurusAPI extends ApiBase
{
  
  constructor(options) {
    super(options);
  }

  async getDomains(domainIdentifier, params)  {
    const { data, pending, error, refresh } =  await useAPIFetch(`/api/v2013/thesaurus/domains/${encodeURIComponent(domainIdentifier)}`,  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }

  async getDomainTerms(termIdentifier, params)  {
    const { data, pending, error, refresh } =  await useAPIFetch(`/api/v2013/thesaurus/domains/${encodeURIComponent(termIdentifier)}/terms`,  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }

  async getTerm(termIdentifier, params)  {
    const { data, pending, error, refresh } =  await useAPIFetch(`/api/v2013/thesaurus/terms/${encodeURIComponent(termIdentifier)}`,  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
}