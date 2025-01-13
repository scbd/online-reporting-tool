//@ts-nocheck
import { ofetch } from 'ofetch';
import { useRealmConfStore } from '@/stores/realmConf';

export default defineNuxtPlugin((nuxtApp) => {
  
  globalThis.$fetch = ofetch.create({
    onRequest ({ request, options }) {
        const config = useRuntimeConfig();
        const auth = useAuth()
        const realmConfStore = useRealmConfStore()        
        const realmConf = realmConfStore.realmConf;

        
        options.headers = options.headers || new globalThis.Headers({});
        if(/^\/api\/v20\d{2}\/*/.test(request)){
            options.baseURL = options.baseURL || config.public.API_URL;
            
            if(/^https:\/\/api\.cbd\.int\//i.test(config.url) || /^https:\/\/api\.cbddev\.xyz\//i.test(config.url)){
                options.headers.append('x-referer', window.location.href);
            }

            if(realmConf.realm)
                options.headers.append('realm', realmConf.realm);

            if (auth?.token) {
                const authConf = useAuthConf();

                const authHeaderName = authConf?.token?.name||'Authorization';
                const authTokenType  = authConf?.token?.type||'Bearer';

                if(!options.headers.hasOwnProperty(authHeaderName))
                    options.headers.append([authHeaderName], `${authTokenType} ${auth.token}`);
                
                if(!options.headers[authHeaderName]){
                    delete options.headers[authHeaderName];
                    delete options.headers['realm'];
                }
            } 
        }


    },
    onRequestError ({ error }) {
      useLogger().error(error)
    }
  });
  
})