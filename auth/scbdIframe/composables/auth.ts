import  { useRuntimeConfig, useAppConfig } from '#app';
import { setUserToken } from '../utils';
import { SocketIOService } from '@/services/socket-io';

export const useAuth = () => useNuxtApp().$auth

export const useAuthConf = () => {
    const conf = useRuntimeConfig();

    const strategy = conf.public.auth.stratagey;
    const strategyConf = { ...conf.public.auth.strategies[strategy] };
    const { redirect } = conf.public.auth;
    return {
        ...strategyConf,
        redirect,
        accountsHostUrl : conf.public.ACCOUNTS_HOST_URL
    }
}

export const authRedirectToLogin = async (from:string) => {
   
    const authConf = useAuthConf();
    const redirectTo = `${useResolveAccountsHostUrl(authConf.redirect.login)}?returnUrl=${encodeURIComponent(window.location.origin)}${encodeURIComponent(from)}`

    await useNavigateAppTo(redirectTo, { external: true });

    return redirectTo;
};

export const authLogin = async () => {

    authRedirectToLogin(window.location.pathname)
};

export const authLogout = async () => {
  
    setUserToken(null);
    SocketIOService.disconnect(true);

    // useAuth().user = undefined;
};

export async function authUser(token = null): Promise<EAuthUser> {
    const user = useState<EAuthUser>("user");

    if (user.value)
        return user.value;

    const authConf = useAuthConf();
    const auth = useAuth();

    //     if(auth.user)
    //         return auth.user;
    try {
        const headers = authHeader(token);

        if (headers) {
            const lUser = await $fetch<EAuthUser>(`${useResolveApiBaseUrl(authConf.endpoints?.user?.url)}`, {
                method: authConf.endpoints?.user?.method?.toUpperCase(),
                headers
            });

            // await useAuth().updateSession();
            // auth.user = user;
            user.value = lUser;
            return user.value;
        }
    }
    catch (e) {
        useLogger().error(e, `Error loading user info`);
        return {} as EAuthUser;
    }
}

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