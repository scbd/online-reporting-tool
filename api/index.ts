
import ArticlesApi            from '~/api/articles'
import CountriesApi           from '~/api/countries'
import KmDocumentsApi         from '~/api/km-storage'
import KmWorkflowsApi         from '@/api/km-workflows'
import RealmConfigurationApi  from '@/api/realm-configuration'
import SolrIndexApi           from '~/api/solr-index'
import ThesaurusApi           from '~/api/thesaurus'

const articles           = new ArticlesApi          ({});
const countries          = new CountriesApi         ({});
const kmDocuments        = new KmDocumentsApi       ({});
const kmWorkflows        = new KmWorkflowsApi       ({});
const realmConfiguration = new RealmConfigurationApi({});
const solrIndex          = new SolrIndexApi         ({});
const thesaurus          = new ThesaurusApi         ({});

export const Api = {
  articles          ,
  countries         ,
  kmDocuments       ,
  kmWorkflows       ,
  realmConfiguration,
  solrIndex         ,
  thesaurus         ,
}