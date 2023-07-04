import { ofetch } from 'ofetch'
// import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin((nuxtApp) => {
  
  globalThis.$fetch = ofetch.create({
    onRequest ({ _request, options }) {
      const auth = useAuth()
      const config = useRuntimeConfig()

      options.baseURL = options.baseURL || config.public.API_URL;

      if (auth?.token) {
        const authConf = useAuthConf();

        const authHeaderName = authConf?.token?.name||'Authorization';
        const authTokenType  = authConf?.token?.type||'Bearer';

        options.headers = { [authHeaderName]: `${authTokenType} ${auth.token}` }

      } 
      // else {
      //   console.log('Not authenticated')
      // }
    },
    onRequestError ({ error }) {
      console.error(error)
    }
  })
})