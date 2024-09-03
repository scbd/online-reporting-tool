// import GaiaApi from '@/api/gaia';

import ArticlesApi            from '~/api/articles'
import CountriesApi           from '~/api/countries'
import KmStorageApi           from '~/api/km-storage'
import KmWorkflowsApi         from '@/api/km-workflows'
import RealmConfigurationApi  from '@/api/realm-configuration'
import SolrIndexApi           from '~/api/solr-index'
import ThesaurusApi           from '~/api/thesaurus'
import SubscriptionApi        from '~/api/subscription'
import UserSettingApi         from '~/api/user-setting'


export default defineNuxtPlugin((nuxtApp) => {

  const articles           = new ArticlesApi          ({});
  const countries          = new CountriesApi         ({});
  const kmStorage          = new KmStorageApi         ({});
  const kmWorkflows        = new KmWorkflowsApi       ({});
  const realmConfiguration = new RealmConfigurationApi({});
  const solrIndex          = new SolrIndexApi         ({});
  const thesaurus          = new ThesaurusApi         ({});
  const subscription       = new SubscriptionApi      ({});
  const userSetting        = new UserSettingApi       ({});
  
  
  const api = {
    articles          ,
    countries         ,
    kmStorage         ,
    kmWorkflows       ,
    realmConfiguration,
    solrIndex         ,
    thesaurus         ,
    subscription      ,
    userSetting       ,
  }
  
  return {
    provide: {
      api
    }
  }
})
