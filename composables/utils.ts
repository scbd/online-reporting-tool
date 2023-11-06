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


function error(error, userMessage){

    if(![404, 401, 403].includes(error?.status)){
        console.error(error);
        
        const { ACCOUNTS_HOST_URL, TAG, COMMIT } = useRuntimeConfig().public;
        const realmConfStore  = useRealmConfStore();
        const realmConf = realmConfStore.realmConf; 
        //TODO: send error to server
        const errorLog = {
            ...error, 
            url      : window.location.href,
            userAgent: window.navigator.userAgent,
            ver      : TAG||COMMIT,
            timestamp: new Date(),
            realm : realmConf.realm
        }; 

        useAPIFetch('/error-logs', {method:'POST', body: errorLog})
    }
        
    if(userMessage){
        const $toast = useToast();
        $toast.error(userMessage, {position:'top-right'}); 
    }
}