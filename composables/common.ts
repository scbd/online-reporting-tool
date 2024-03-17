import { RouteLocationRaw } from "vue-router";
import { NavigateToOptions } from '#imports'

export const useNavigateAppTo = (to:RouteLocationRaw, options?: NavigateToOptions | undefined) =>{ 
    
    const localePath  = useLocalePath();
    options = options || {};
    
    if(typeof to === 'string'){
        return navigateTo({path: localePath(to), ...options })
    }
    
    to.path = localePath(to.path);    
    return navigateTo(to, options);

};

export const useResolveApiBaseUrl = function(url:string){

    const conf  = useRuntimeConfig();
    const apiUrl= conf.public.API_URL;

    if(/^\/api/.test(url))
        return `${apiUrl}${url}`

    return url;
}

export const useResolveAccountsHostUrl = function(url:string){

    const conf              = useRuntimeConfig();
    const accountsHostUrl   = conf.public.ACCOUNTS_HOST_URL;

    if(/^\//.test(url))
        return `${accountsHostUrl}${url}`

    return url;
}
