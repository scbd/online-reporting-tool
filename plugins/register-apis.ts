// import GaiaApi from '~/api/gaia';

import ArticlesApi            from '~/api/articles'
import CountriesApi           from '~/api/countries'
import KmStorageApi           from '~/api/km-storage'
import KmWorkflowsApi         from '~/api/km-workflows'
import RealmConfigurationApi  from '~/api/realm-configuration'
import SolrIndexApi           from '~/api/solr-index'
import ThesaurusApi           from '~/api/thesaurus'


export default defineNuxtPlugin((nuxtApp) => {

  const articles           = new ArticlesApi          ({});
  const countries          = new CountriesApi         ({});
  const kmStorage          = new KmStorageApi         ({});
  const kmWorkflows        = new KmWorkflowsApi       ({});
  const realmConfiguration = new RealmConfigurationApi({});
  const solrIndex          = new SolrIndexApi         ({});
  const thesaurus          = new ThesaurusApi         ({});
  
  const api = {
    articles          ,
    countries         ,
    kmStorage         ,
    kmWorkflows       ,
    realmConfiguration,
    solrIndex         ,
    thesaurus         ,
  }
  console.log(api)
  
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`,
      api
    }
  }
})
