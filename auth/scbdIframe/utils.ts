
export const setUserToken = (token)=>{
    useAuth().reset();
    setScbdIframeToken({authenticationToken:token})
}

export const getUserToken = async ()=>{
    
  const token = await getScbdIframeToken()    
  return token;
}

async function getScbdIframeToken(){

    let userTokenResolved = undefined;
    let token = undefined;
    // if (isServer()) return;
    const authConf = useAuthConf();
    if (!authConf.accountsHostUrl) throw new Error('no accountsHostUrl given to SCBD auth scheme');
   
    token = await resolveToken();



    function receivePostMessage(event) {

        const authConf = useAuthConf();
        if(!event.data || authConf.accountsHostUrl !== event.origin)
            return

        const {
            type,
            authenticationToken,
            authenticationEmail,
            expiration
        } = JSON.parse(event.data);

        if (!['authenticationTokenUpdated', 'authenticationToken'].includes(type)) 
            return;//throw new Error('unsupported authentication message type');
        
        if(type === 'authenticationToken'){
            token = {
                        type,
                        authenticationToken,
                        authenticationEmail,
                        expiration
                    };
            userTokenResolved = true;
            // authConf.token.maxAge = Date.parse(expiration) /1000
            // if(token!=)
            // setUserToken(token);
        }
        // else if(type === 'authenticationTokenUpdated'){
        //     getScbdIframeToken();
        // }
        //{
        //   authenticationToken: authenticationToken,
        //   authenticationEmail: authenticationEmail,
        //   expiration: expiration
        // }
    }

   

    function resolveToken(ms = 300) {
        const self = this;
        return new Promise(async function (resolve, reject) {

            window.addEventListener('message', receivePostMessage);

            const type = 'getAuthenticationToken';
            let accountsIframe = getScbdIframe();

            if(!accountsIframe){

                const onloadCallback = (newIframe)=> {
                    postIFrameMessage(newIframe, JSON.stringify({type}))
                }

                createScbdIframe(onloadCallback)
            }
            else{
                postIFrameMessage(accountsIframe, msg);
            }

            const interval = setInterval(function () {
                if (userTokenResolved) {
                    clearInterval(interval);
                    resolve(token)
                    window.removeEventListener('message', receivePostMessage);
                }
            }, ms);
        });
    }


    return token;
}

async function setScbdIframeToken({authenticationToken, authenticationEmail, expiration}) {

    //TODO promisify
    // if (isServer()) return;

    const authConf = useAuthConf();
    if (!authConf.accountsHostUrl) throw new Error('no accountsHostUrl given to SCBD auth scheme');

    var msg = {
        type: "setAuthenticationToken",
        authenticationToken,
        authenticationEmail,
        expiration
    };

    let accountsIframe = getScbdIframe();
    if(!accountsIframe){
    const onloadCallback = (newIframe)=> {
        postIFrameMessage.bind(this, newIframe, JSON.stringify(msg))
    }
    createScbdIframe(onloadCallback)
    }
    else{
    postIFrameMessage(accountsIframe, JSON.stringify(msg));
    }

} 
function getScbdIframe() {

        const authConf = useAuthConf();
        if (!process.client) return undefined;

        const iFrames = [...window.document.getElementsByTagName('iframe')].find(e=>e.name == 'scbdAuthFrame');
        
        if(iFrames){
        const { origin } = new URL(iFrames.getAttribute('src'));

        if (authConf.accountsHostUrl === origin)
            return iFrames;
        }
    }

    function createScbdIframe(onloadCallback){

        const authConf = useAuthConf();
        //Iframe was not found, embed one
        var sc = document.createElement("iframe");
        sc.setAttribute("src", `${authConf.accountsHostUrl}/app/authorize.html`);
        sc.setAttribute("name", "scbdAuthFrame");
        sc.setAttribute("style", "display:none;");
        sc.onload = () => onloadCallback(sc);
        document.head.appendChild(sc);


        return sc;

    }
    function postIFrameMessage(accountsIframe, message){
        const { contentWindow } = accountsIframe;    
        const authConf = useAuthConf();
        contentWindow.postMessage(message, authConf.accountsHostUrl);
    }