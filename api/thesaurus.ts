
import { type ApiOptions } from "~/types/api/api-options";
import ApiBase from './api-base';
import type { ThesaurusTerm } from "~/types/api/thesaurus-term";

export default class ThesaurusAPI extends ApiBase
{
  
  constructor(options:ApiOptions) {
    super(options);
  }

  async getDomainTerms(termIdentifier:string, params:Object):Promise<ThesaurusTerm[]>  {
    const data  =  await useAPIFetch<ThesaurusTerm[]>(`/api/v2013/thesaurus/domains/${encodeURIComponent(termIdentifier)}/terms`,  { method:'get', params })
                  
    return data;
  }

  async getTerm(termIdentifier:string, params?:Object):Promise<ThesaurusTerm>  {
    const data  =  await useAPIFetch<ThesaurusTerm>(`/api/v2013/thesaurus/terms/${encodeURIComponent(termIdentifier)}`,  { method:'get', params })
                  
    return data;
  }
}