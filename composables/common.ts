import { RouteLocation } from "vue-router";



export const useNavigateAppTo = (to:RouteLocation, options: NavigateToOptions) =>{ 
    
    const localePath  = useLocalePath()
    
    if(typeof to === 'string'){
        return navigateTo(localePath(to), options)
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
