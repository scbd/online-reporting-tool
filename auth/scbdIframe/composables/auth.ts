import  { useRuntimeConfig, useAppConfig } from '#app';
import { setUserToken } from '../utils';

export const useAuth = () => useNuxtApp().$auth

export const useAuthConf = () => {
    const conf = useRuntimeConfig();

    const strategy = conf.public.auth.stratagey;
    const strategyConf = { ...conf.public.auth.strategies[strategy] };
    const { redirect, accountsHostUrl} = conf.public.auth;
    return {
        ...strategyConf,
        redirect,
        accountsHostUrl
    }
}

export const authRedirectToLogin = async (from:string) => {
   
    const authConf = useAuthConf();
    const redirectTo = `${authConf.redirect.login}?returnUrl=${encodeURIComponent(window.location.origin)}${encodeURIComponent(from)}`

    await navigateTo(redirectTo, { external: true });

    return redirectTo;
};

export const authLogin = async () => {

    authRedirectToLogin(window.location.pathname)
};

export const authLogout = async () => {
  
    setUserToken(null)
    // useAuth().user = undefined;
};

export const authUser = async (token = null) => {
    const user = useState("user")

    if(user.value)
        return user.value

    const authConf = useAuthConf();
    const auth     = useAuth();
    
//     if(auth.user)
//         return auth.user;

    try{
        const headers = authHeader(token);

        if(headers){
            const luser = await $fetch(`${authConf.endpoints?.user?.url}`, {
                                        method: authConf.endpoints?.user?.method?.toUpperCase(),
                                        headers        
                                    });

            // await useAuth().updateSession();
            // auth.user = user;
            user.value = luser
            return user.value;
        }
    }
    catch(e){
        console.debug(`Error loading user info`, e)
        return {}
    }
};

export const authHeader = (token)=>{
    const auth = useAuth()
      
    token = auth?.token || token;
    if (token) {
        const authConf = useAuthConf();

        const authHeaderName = authConf?.token?.name||'Authorization';
        const authTokenType  = authConf?.token?.type||'Bearer';

        return { [authHeaderName]: `${authTokenType} ${token}` }
    } 
}