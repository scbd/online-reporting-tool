// import GaiaApi from '~/api/gaia';

import ArticlesApi            from '~/api/articles'
import CountriesApi           from '~/api/countries'
import KmStorageApi           from '~/api/km-storage'
import KmWorkflowsApi         from '~/api/km-workflows'
import RealmConfigurationApi  from '~/api/realm-configuration'
import SolrIndexApi           from '~/api/solr-index'
import ThesaurusApi           from '~/api/thesaurus'

export default (context, inject) => {

  const articles           = new ArticlesApi          (context);
  const countries          = new CountriesApi         (context);
  const kmStorage          = new KmStorageApi         (context);
  const kmWorkflows        = new KmWorkflowsApi       (context);
  const realmConfiguration = new RealmConfigurationApi(context);
  const solrIndex          = new SolrIndexApi         (context);
  const thesaurus          = new ThesaurusApi         (context);
  
  const api = {
    articles          ,
    countries         ,
    kmStorage         ,
    kmWorkflows       ,
    realmConfiguration,
    solrIndex         ,
    thesaurus         ,
  }
  
  inject('api',   api);
};
