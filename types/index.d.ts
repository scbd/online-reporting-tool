import type ArticlesApi           from '~/api/articles';
import type CountriesApi          from '~/api/countries';
import type KmStorageApi          from '~/api/km-storage';
import type KmWorkflowsApi        from '~/api/km-workflows';
import type RealmConfigurationApi from '~/api/realm-configuration';
import type SolrIndexApi          from '~/api/solr-index';
import type ThesaurusApi          from '~/api/thesaurus';
import type SubscriptionApi       from '~/api/subscription';
import type UserSettingApi        from '~/api/user-setting';
import type { appRoutes }         from '~/utils/app-routes';

declare module '#app' {
  interface NuxtApp {
    $api: ApiShape;
    $appRoutes: typeof appRoutes;
  }
}

type ApiShape = {
  articles:           InstanceType<typeof ArticlesApi>;
  countries:          InstanceType<typeof CountriesApi>;
  kmStorage:          InstanceType<typeof KmStorageApi>;
  kmWorkflows:        InstanceType<typeof KmWorkflowsApi>;
  realmConfiguration: InstanceType<typeof RealmConfigurationApi>;
  solrIndex:          InstanceType<typeof SolrIndexApi>;
  thesaurus:          InstanceType<typeof ThesaurusApi>;
  subscription:       InstanceType<typeof SubscriptionApi>;
  userSetting:        InstanceType<typeof UserSettingApi>;
};

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: ApiShape;
    $appRoutes: typeof appRoutes;
  }
}

export {};

declare global {
  interface Window {
    _slaask: any;
    mapboxgl: any;
    grecaptcha: any;
    jQuery: any;
    $: any;
    ClassicEditor: any;
  }
}