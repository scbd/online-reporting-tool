import { type ApiOptions } from "~/types/api-schemas/api-options";
import type { FetchError } from 'ofetch';

export default class ApiBase
{
  $config : ApiOptions = {}
  constructor($config:ApiOptions) {
    this.$config = $config;
  }

  // fetch(
  //   url: string | Request | Ref<string | Request> | () => string | Request,
  //     options?: UseFetchOptions<DataT>
  //   ): Promise<AsyncData<DataT>>{

  //   const { data, pending, error, refresh } =  await useFetch(url, options)

  // }
}

//////////////////////////
// Helpers
////////////////////////

export function tryCastToApiError(error:FetchError) {

  useLogger().error(error);
  
  if(error && error.response && error.response.data && error.response.data.code) {
      const apiError = error.response.data
      throw error.response.data;
  }

  throw error
}