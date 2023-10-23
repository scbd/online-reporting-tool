type useFetchType = typeof useFetch
import { useRealmConfStore } from '@/stores/realmConf'
import { useAuthStore } from '@/store/auth'
import {removeEmpty} from '@/utils'

export default class ApiError extends Error {
    constructor({status, error, message})  {
        super(message, { cause : {...error, status} });

        this.status = status;
        this.error  = error;
    }
}


// wrap useFetch with configuration needed to talk to our API
export const useAPIFetch: useFetchType = async (path, options = {}) => {


        const config = useRuntimeConfig()
        if(/^\/api\/*/.test(path))
            options.baseURL = options.baseURL || config.public.API_URL;

        const auth = useAuth()
        const realmConfStore = useRealmConfStore()
        
        const realmConf = realmConfStore.realmConf;

        
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

    const { data, error, execute, pending, refresh, status } = await useFetch(path, options)

    if(error?.value){
        throw new ApiError({
            status : error.value?.statusCode,
            error  : error.value?.data||error.value,
            message : `Error occurred executing ${options.method} request for url ${path}`
        })
    }

    return data.value;
}

// wrap useFetch with configuration needed to talk to our API
export const useAPIFetchWithCache: useFetchType = async (path, options = {}) => {

    const { data, error, execute, pending, refresh, status } = await useFetch(path, options)

    if(error?.value){
        throw new ApiError({
            status : error.value?.statusCode,
            error  : error.value?.data||error.value,
            message : `Error occurred executing ${options.method} request for url ${path}`
        })
    }

    return data.value;
}