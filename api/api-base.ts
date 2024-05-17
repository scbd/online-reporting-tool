export default class ApiBase
{
  constructor({ $config }) {
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

export function tryCastToApiError(error) {

  useLogger().error(error);

  if(error && error.response && error.response.data && error.response.data.code) {
      const apiError = error.response.data
      throw error.response.data;
  }

  throw error
}