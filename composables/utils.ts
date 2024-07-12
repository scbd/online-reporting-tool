import {useToast} from 'vue-toast-notification';
import { useRealmConfStore } from '@/stores/realmConf';

export const useGenerateUUID = ()=> {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()).toUpperCase();
}

export function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export const useLogger = ()=>{
    return {
        error
    }
}

export const isDevelopment = ()=>{
    const { ACCOUNTS_HOST_URL } = useRuntimeConfig().public;

    return ACCOUNTS_HOST_URL.indexOf('accounts.cbddev.xyz')>=0
}

export const isProduction = ()=>{
    const { ACCOUNTS_HOST_URL } = useRuntimeConfig().public;
    
    return ACCOUNTS_HOST_URL.indexOf('accounts.cbd.int')>=0
}

function error(appError, userMessage){

    if(![404, 401, 403].includes(appError?.status)){

        try{
            console.error(appError);
            
            const { ACCOUNTS_HOST_URL, TAG, COMMIT } = useRuntimeConfig().public;
            const realmConfStore  = useRealmConfStore();
            const realmConf = realmConfStore.realmConf; 
            //TODO: send error to server
            const errorLog = {
                stack : JSON.stringify(appError, Object.getOwnPropertyNames(appError)), 
                message: JSON.stringify(userMessage || appError?.message || 'unknown'),
                url      : window.location.href,
                userAgent: window.navigator.userAgent,
                ver      : TAG||COMMIT,
                timestamp: new Date(),
                realm : realmConf.realm
            }; 

            useAPIFetch('/error-logs', {method:'POST', body: errorLog});
        }
        catch(err){
            console.error(err, 'error sending error log to server.')
        }
    }
        
    if(userMessage){
        const $toast = useToast();
        $toast.error(userMessage, {position:'top-right'}); 
    }
}