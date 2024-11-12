
import { type ApiOptions } from "~/types/api/api-options";
import ApiBase from './api-base';
import type { SolrQuery } from "~/types/api/solr";

export default class SolrIndexAPI extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }

  async querySolr(params:SolrQuery)  {

    const defaults = {
      searchField : 'text_EN_txt',
      start : 0, rowsPerPage:25
    }
    params = {...defaults, ...params };

      var queryListParameters = {
        df    : params.searchField,
        fq    : params.fieldQueries,
        q     : params.query,
        sort  : this.localizeFields(params.sort),
        fl    : this.localizeFields(params.fields),
        wt    : 'json',
        start : params.start,
        rows  : params.rowsPerPage,
        // 'debug.explain.structured':true,
        // "debugQuery":"on"
    };

    const data = await useAPIFetch(`/api/v2013/index/select`, { method:'POST', body : queryListParameters});

    return data;


  }

  localizeFields(fields:string, locale?:string){
      if(!fields)
          return;
          
      if(locale && locale!='en'){
          return fields.replace(/_EN/ig, '_'+(locale||'en').toUpperCase())
      }

      return fields;
  }

}