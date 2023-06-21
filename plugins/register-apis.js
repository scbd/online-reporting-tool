// import GaiaApi from '~/api/gaia';

import ArticlesApi            from '~/api/articles'
import CountriesApi           from '~/api/countries'
import KmDocumentsApi         from '~/api/km-documents'
import KmWorkflowsApi         from '~/api/km-workflows'
import RealmConfigurationApi  from '~/api/realm-configuration'
import SolrIndexApi           from '~/api/solr-index'

export default (context, inject) => {

  const articles           = new ArticlesApi          (context);
  const countries          = new CountriesApi         (context);
  const kmDocuments        = new KmDocumentsApi       (context);
  const kmWorkflows        = new KmWorkflowsApi       (context);
  const realmConfiguration = new RealmConfigurationApi(context);
  const solrIndex          = new SolrIndexApi         (context);
  
  const api = {
    articles          ,
    countries         ,
    kmDocuments       ,
    kmWorkflows       ,
    realmConfiguration,
    solrIndex         ,
  }
  
  inject('api',   api);
};
