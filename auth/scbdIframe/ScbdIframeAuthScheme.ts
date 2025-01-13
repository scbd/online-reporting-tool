import { useResolveApiBaseUrl } from "@/composables/common";

export default class ScbdIframeAuthScheme {

    constructor(options) {
 
      this.userTokenResolved = undefined;
      
      this.options = options
    }
  
    // async mounted(options= {}) {
  
    //   const {
    //     tokenCallback = () => this.$auth.reset(),
    //     refreshTokenCallback = undefined
    //   } = options;
  
    //   const {
    //     tokenExpired,
    //     refreshTokenExpired
    //   } = this.check(true)
  
    //   if (refreshTokenExpired && typeof refreshTokenCallback === 'function') {
    //     refreshTokenCallback()
    //   } else if (tokenExpired && typeof tokenCallback === 'function') {
    //     tokenCallback()
    //   }
      
    //   // Initialize request interceptor
    //   this.initializeRequestInterceptor()
  
    //   const token = await this.getScbdIframeToken()
      
    //   // Fetch user once
    //   return this.$auth.fetchUserOnce(this.options.endpoints.user.url)
      
  
    // }
    setUserToken(token) {
      //TODO : set token expiry
      this.token.set(token);
      return this.fetchUser(useResolveApiBaseUrl(this.options.endpoints.user.url));
    }
    
    async logout() {
      this.userTokenResolved = undefined;
      
      await this.setScbdIframeToken({authenticationToken:null});
  
      return this.$auth.reset()
    }
  
    async getScbdIframeToken() {
  
      this.userTokenResolved = undefined;
      if (this.isServer()) return;
  
      if (!this.options.accountsHostUrl) throw new Error('no accountsHostUrl given to SCBD auth scheme');
     
      const token = await this.resolveToken();
  
      return token;
    }
  
    async setScbdIframeToken({authenticationToken, authenticationEmail, expiration}) {
  
      //TODO promisify
      if (this.isServer()) return;
  
      if (!this.options.accountsHostUrl) throw new Error('no accountsHostUrl given to SCBD auth scheme');
     
      var msg = {
        type: "setAuthenticationToken",
        authenticationToken,
        authenticationEmail,
        expiration
      };
  
      let accountsIframe = this.getScbdIframe();
      if(!accountsIframe){
        const onloadCallback = (newIframe)=> {
          this.postIFrameMessage.bind(this, newIframe, JSON.stringify(msg))
        }
        this.createScbdIframe(onloadCallback)
      }
      else{
        this.postIFrameMessage(accountsIframe, JSON.stringify(msg));
      }
  
    }
  
    receivePostMessage(event) {
  
      if(!event.data || this.options.accountsHostUrl !== event.origin)
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
        this.userTokenResolved = true;
        this.options.token.maxAge = Date.parse(expiration) /1000
        this.setUserToken(authenticationToken);
      }
      else if(type === 'authenticationTokenUpdated'){
        this.getScbdIframeToken();
      }
      //{
      //   authenticationToken: authenticationToken,
      //   authenticationEmail: authenticationEmail,
      //   expiration: expiration
      // }
    }
  
    getScbdIframe() {
  
      if (this.isServer()) return undefined;
  
      const iFrames = [...window.document.getElementsByTagName('iframe')].find(e=>e.name == 'scbdAuthFrame');
      
      if(iFrames){
        const { origin } = new URL(iFrames.getAttribute('src'));
  
        if (this.options.accountsHostUrl === origin)
          return iFrames;
      }
    }
    createScbdIframe(onloadCallback){
  
      //Iframe was not found, embed one
      var sc = document.createElement("iframe");
      sc.setAttribute("src", `${this.options.accountsHostUrl}/app/authorize.html`);
      sc.setAttribute("name", "scbdAuthFrame");
      sc.setAttribute("style", "display:none;");
      sc.onload = () => onloadCallback(sc);
      document.head.appendChild(sc);
  
  
      return sc;
  
    }
  
    resolveToken(ms = 300) {
      const self = this;
      return new Promise(async function (resolve, reject) {
  
        window.addEventListener('message', self.receivePostMessage.bind(self));
  
        const type = 'getAuthenticationToken';
        let accountsIframe = self.getScbdIframe();
  
        if(!accountsIframe){
  
          const onloadCallback = (newIframe)=> {
            self.postIFrameMessage(newIframe, JSON.stringify({type}))
          }
  
          self.createScbdIframe(onloadCallback)
        }
        else{
          self.postIFrameMessage(accountsIframe, msg);
        }
  
        const interval = setInterval(function () {
          if (self.userTokenResolved) {
            clearInterval(interval);
            resolve(self.token.get())
            window.removeEventListener('message', self.receivePostMessage.bind(self));
          }
        }, ms);
      });
    }
  
    postIFrameMessage(accountsIframe, message){
      const { contentWindow } = accountsIframe;    
      contentWindow.postMessage(message, this.options.accountsHostUrl);
    }
  
    isServer(){
      return false;
    }
  }



// export const setUserToken = (token)=>{
//   console.log(token)
//   //TODO : set token expiry
//   // token.set(token);
//   // return authUser();'
//   setScbdIframeToken({authenticationToken:token})
// }

// export const getUserToken = async ()=>{
  
//   const token = await getScbdIframeToken()
 
//   return token;
// }

// async function getScbdIframeToken(){

//   let userTokenResolved = undefined;
//   let token = undefined;
//   // if (isServer()) return;
//   const authConf = useAuthConf();
//   if (!authConf.accountsHostUrl) throw new Error('no accountsHostUrl given to SCBD auth scheme');
 
//   token = await resolveToken();



//   function receivePostMessage(event) {

//       const authConf = useAuthConf();
//       if(!event.data || authConf.accountsHostUrl !== event.origin)
//           return

//       const {
//           type,
//           authenticationToken,
//           authenticationEmail,
//           expiration
//       } = JSON.parse(event.data);

//       console.log(event.data)
//       if (!['authenticationTokenUpdated', 'authenticationToken'].includes(type)) 
//           return;//throw new Error('unsupported authentication message type');
      
//       if(type === 'authenticationToken'){
//           token = {
//                       type,
//                       authenticationToken,
//                       authenticationEmail,
//                       expiration
//                   };
//           userTokenResolved = true;
//           // authConf.token.maxAge = Date.parse(expiration) /1000
//           setUserToken(token);
//       }
//       else if(type === 'authenticationTokenUpdated'){
//           getScbdIframeToken();
//       }
//       //{
//       //   authenticationToken: authenticationToken,
//       //   authenticationEmail: authenticationEmail,
//       //   expiration: expiration
//       // }
//   }


//   function resolveToken(ms = 300) {
//       const self = this;
//       return new Promise(async function (resolve, reject) {

//           window.addEventListener('message', receivePostMessage);

//           const type = 'getAuthenticationToken';
//           let accountsIframe = getScbdIframe();
//           const msg = JSON.stringify({type})
//           if(!accountsIframe){

//               const onloadCallback = (newIframe)=> {
//                   postIFrameMessage(newIframe, msg)
//               }

//               createScbdIframe(onloadCallback)
//           }
//           else{
//               postIFrameMessage(accountsIframe, msg);
//           }

//           const interval = setInterval(function () {
//               if (userTokenResolved) {
//                   clearInterval(interval);
//                   resolve(token)
//                   window.removeEventListener('message', receivePostMessage);
//               }
//           }, ms);
//       });
//   }


//   return token;
// }
// async function setScbdIframeToken({authenticationToken, authenticationEmail, expiration}) {

//   //TODO promisify
//   // if (isServer()) return;

//   const authConf = useAuthConf();
//   if (!authConf.accountsHostUrl) throw new Error('no accountsHostUrl given to SCBD auth scheme');

//   var msg = {
//       type: "setAuthenticationToken",
//       authenticationToken,
//       authenticationEmail,
//       expiration
//   };

//   let accountsIframe = getScbdIframe();
//   if(!accountsIframe){
//   const onloadCallback = (newIframe)=> {
//       postIFrameMessage.bind(this, newIframe, JSON.stringify(msg))
//   }
//       createScbdIframe(onloadCallback)
//   }
//   else{
//       postIFrameMessage(accountsIframe, JSON.stringify(msg));
//   }

// }

// function getScbdIframe() {

//   const authConf = useAuthConf();
//   if (!process.client) return undefined;

//   const iFrames = [...window.document.getElementsByTagName('iframe')].find(e=>e.name == 'scbdAuthFrame');
  
//   if(iFrames){
//   const { origin } = new URL(iFrames.getAttribute('src'));

//   if (authConf.accountsHostUrl === origin)
//       return iFrames;
//   }
// }

// function createScbdIframe(onloadCallback){

//   const authConf = useAuthConf();
//   //Iframe was not found, embed one
//   var sc = document.createElement("iframe");
//   sc.setAttribute("src", `${authConf.accountsHostUrl}/app/authorize.html`);
//   sc.setAttribute("name", "scbdAuthFrame");
//   sc.setAttribute("style", "display:none;");
//   sc.onload = () => onloadCallback(sc);
//   document.head.appendChild(sc);


//   return sc;

// }

// function postIFrameMessage(accountsIframe, message){
//   const { contentWindow } = accountsIframe;    
//   const authConf = useAuthConf();
//   contentWindow.postMessage(message, authConf.accountsHostUrl);
// }