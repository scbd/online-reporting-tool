//@ts-nocheck
let reCaptchaPromise:Promise<string>|undefined = undefined;
let gAssignedId:string|undefined = undefined;
let initResult:Promise<any>|undefined

export default defineNuxtPlugin((nuxtApp) => {

    const { CAPTCHA_V2_BADGE_KEY } = useRuntimeConfig().public;

    if(CAPTCHA_V2_BADGE_KEY)
        initializeRecaptcha('g-recaptcha', CAPTCHA_V2_BADGE_KEY);

    nuxtApp.provide('recaptcha', {
        getRecaptchaToken,
        resetRecaptcha
    })
})

function initializeRecaptcha(elementId:string, sitekey:string){

    if(!initResult){

        initResult = new Promise((resolve, reject)=>{
                
            let checkIntervalRunCount = 0;
            const checkInterval = setInterval(() => {

                if(checkIntervalRunCount > 2000){

                    clearInterval(checkInterval);
                    reject('Unable to initialize reCaptcha');
                }

                checkIntervalRunCount++;

                if (window.grecaptcha && window.grecaptcha.hasOwnProperty('render')){
                    clearInterval(checkInterval);
                    gAssignedId = render(elementId, sitekey);
                    resolve(gAssignedId);
                }

            }, 100)

        })
    }

    return initResult;
}

function getRecaptchaToken(){
    
    if(isNaN(parseInt(gAssignedId)))
        return;
    
    if(reCaptchaPromise?.reject)
        reCaptchaPromise.reject();        

    return new Promise((resolve, reject)=>{
        reCaptchaPromise = { resolve, reject };
        window.grecaptcha.execute(gAssignedId)
    });   
}

function resetRecaptcha(){

    if(isNaN(parseInt(gAssignedId)))
        return;

    if(reCaptchaPromise?.reject)
        reCaptchaPromise.reject();
    reCaptchaPromise = undefined;
    window.grecaptcha.reset(gAssignedId)
}

function render(elementId:string, sitekey:string){
    return window.grecaptcha.render(elementId, {
        sitekey: sitekey,
        size: 'invisible',
        'callback': (recaptchaToken:string) => {
            if(reCaptchaPromise?.resolve)
                reCaptchaPromise.resolve(recaptchaToken);
            reCaptchaPromise = undefined;
            resetRecaptcha();
        },
        'expired-callback': (message:any) => {
            if(reCaptchaPromise?.reject)
                reCaptchaPromise.reject({expired:true, message});
            reCaptchaPromise = undefined;
            resetRecaptcha();
        },
        'error-callback': (error:any) => {
            if(reCaptchaPromise?.reject)
                reCaptchaPromise.reject({error});
            reCaptchaPromise = undefined;
            resetRecaptcha();
        }
    });

}