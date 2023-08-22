import { ofetch } from 'ofetch'
import { useRealmConfStore } from '@/stores/realmConf'
import { useAuthStore } from '@/store/auth'
import {removeEmpty} from '@/utils'

export default defineNuxtPlugin((nuxtApp) => {
  
  globalThis.$fetch = ofetch.create({
    onRequest ({ _request, options }) {
        const auth = useAuth()
        const config = useRuntimeConfig()
        const realmConfStore = useRealmConfStore()
        
        const realmConf = realmConfStore.realmConf;

        options.baseURL = options.baseURL || config.public.API_URL;
        options.headers = options.headers || {};

        if(realmConf.realm)
            options.headers['realm'] = realmConf.realm;

        if (auth?.token) {
            const authConf = useAuthConf();

            const authHeaderName = authConf?.token?.name||'Authorization';
            const authTokenType  = authConf?.token?.type||'Bearer';

            if(!options.headers.hasOwnProperty(authHeaderName))
                options.headers[authHeaderName] = `${authTokenType} ${auth.token}`;
            
            if(!options.headers[authHeaderName]){
                delete options.headers[authHeaderName];
                delete options.headers['realm'];
            }
        } 

    },
    onRequestError ({ error }) {
      console.error(error)
    }
  })
})