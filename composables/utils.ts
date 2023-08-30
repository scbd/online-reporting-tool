import {useToast} from 'vue-toast-notification';

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

    if(![404, 401].includes(error?.status)){
        console.error(error);
        
        //TODO: send error to server
    }
        
    if(userMessage){
        const $toast = useToast();
        $toast.error(userMessage, {position:'top-right'}); 
    }
}