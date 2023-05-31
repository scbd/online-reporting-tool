import {
  LocalScheme, BaseScheme
} from '@nuxtjs/auth-next/dist/runtime'


export default class ScbdIframeAuthScheme extends LocalScheme {

  constructor($auth, options) {
    super( $auth, options )

    this.$auth = $auth;
    this.options = options;
    this.userTokenResolved = undefined;

    //append current url as return url
    this.$auth.onRedirect((to, from)=>{
      return `${to}?returnUrl=${window.location.href}`
    })
  }

  async mounted(options= {}) {

    const {
      tokenCallback = () => this.$auth.reset(),
      refreshTokenCallback = undefined
    } = options;

    const {
      tokenExpired,
      refreshTokenExpired
    } = this.check(true)

    if (refreshTokenExpired && typeof refreshTokenCallback === 'function') {
      refreshTokenCallback()
    } else if (tokenExpired && typeof tokenCallback === 'function') {
      tokenCallback()
    }
    
    // Initialize request interceptor
    this.initializeRequestInterceptor()

    const token = await this.getScbdIframeToken()
    
    // Fetch user once
    return this.$auth.fetchUserOnce(this.options.endpoints.user.url)
    

  }
  setUserToken(token) {
    //TODO : set token expiry
    this.token.set(token);
    return this.fetchUser(this.options.endpoints.user.url);
  }
  async login(endpoint, args) {
    const response = await super.login(endpoint, args);

    await this.setScbdIframeToken(response.data);

    return response;
  }

  async logout() {
    //TODO : clear SCBD iframe
    this.userTokenResolved = undefined;
    
    // if (!this.getStrategy().reset) {
      await this.setScbdIframeToken({authenticationToken:null});
    // }
    return this.$auth.reset()
  }

  async getScbdIframeToken() {

    this.userTokenResolved = undefined;
    if (this.isServer()) return;

    if (!this.options.accountsHostUrl) throw new Error('no accountsHostUrl given to auth store state');
   
    const accountsIframe = this.getScbdIframe();

    window.addEventListener('message', this.receivePostMessage.bind(this));
    
    const type = 'getAuthenticationToken';
    const msg = JSON.stringify({ type });

    accountsIframe.onload = this.postIFrameMessage.bind(this, accountsIframe, msg);
    // this.postIFrameMessage(accountsIframe, msg);
    const token = await this.resolveToken();

    return token;
  }

  async setScbdIframeToken({authenticationToken, authenticationEmail, expiration}) {

    //TODO promisify
    if (this.isServer()) return;

    if (!this.options.accountsHostUrl) throw new Error('no accountsHostUrl given to auth store state');
   
    const accountsIframe = this.getScbdIframe();

    var msg = {
      type: "setAuthenticationToken",
      authenticationToken,
      authenticationEmail,
      expiration
    };

    // var iframeDoc = accountsIframe.contentDocument || accountsIframe.contentWindow.document;
    // // Check if loading is complete
    // if (iframeDoc.readyState  == 'complete' ) {
      this.postIFrameMessage(accountsIframe, JSON.stringify(msg));
    // }
    // else{
    //   accountsIframe.onload = this.postIFrameMessage.bind(this, accountsIframe, JSON.stringify(msg));
    // }

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

    const iFrames = window.document.getElementsByTagName('iframe');

    for (const anIframe of iFrames) {
      const { origin } = new URL(anIframe.getAttribute('src'));

      if (this.options.accountsHostUrl === origin)
        return anIframe;
    }
    //Iframe was not found, embed one
    var sc = document.createElement("iframe");
    sc.setAttribute("src", `${this.options.accountsHostUrl}/app/authorize.html`);
    sc.setAttribute("name", "scbdAuthFrame");
    sc.setAttribute("style", "display:none;");
    document.head.appendChild(sc);
    
    return sc;

  }

  resolveToken(ms = 300) {
    const self = this;
    console.log(self)
    return new Promise(function (resolve, reject) {
      const interval = setInterval(function () {
        if (self.userTokenResolved) {
          // console.log(self.userTokenDetails)
          resolve(self.token.get())
          clearInterval(interval)
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


// class MyLocalScheme extends BaseScheme {
//   constructor($auth, options, ...defaults) {
//     super($auth, options, ...defaults, DEFAULTS$4);
//     this.token = new Token(this, this.$auth.$storage);
//     this.requestHandler = new RequestHandler(this, this.$auth.ctx.$axios);
//   }
//   check(checkStatus = false) {
//     const response = {
//       valid: false,
//       tokenExpired: false
//     };
//     const token = this.token.sync();
//     if (!token) {
//       return response;
//     }
//     if (!checkStatus) {
//       response.valid = true;
//       return response;
//     }
//     const tokenStatus = this.token.status();
//     if (tokenStatus.expired()) {
//       response.tokenExpired = true;
//       return response;
//     }
//     response.valid = true;
//     return response;
//   }
//   mounted({
//     tokenCallback = () => this.$auth.reset(),
//     refreshTokenCallback = void 0
//   } = {}) {
//     const { tokenExpired, refreshTokenExpired } = this.check(true);
//     if (refreshTokenExpired && typeof refreshTokenCallback === "function") {
//       refreshTokenCallback();
//     } else if (tokenExpired && typeof tokenCallback === "function") {
//       tokenCallback();
//     }
//     this.initializeRequestInterceptor();
//     return this.$auth.fetchUserOnce();
//   }
//   async login(endpoint, { reset = true } = {}) {
//     if (!this.options.endpoints.login) {
//       return;
//     }
//     if (reset) {
//       this.$auth.reset({ resetInterceptor: false });
//     }
//     if (this.options.clientId) {
//       endpoint.data.client_id = this.options.clientId;
//     }
//     if (this.options.grantType) {
//       endpoint.data.grant_type = this.options.grantType;
//     }
//     if (this.options.scope) {
//       endpoint.data.scope = this.options.scope;
//     }
//     const response = await this.$auth.request(endpoint, this.options.endpoints.login);
//     this.updateTokens(response);
//     if (!this.requestHandler.interceptor) {
//       this.initializeRequestInterceptor();
//     }
//     if (this.options.user.autoFetch) {
//       await this.fetchUser();
//     }
//     return response;
//   }
//   setUserToken(token) {
//     this.token.set(token);
//     return this.fetchUser();
//   }
//   fetchUser(endpoint) {
//     if (!this.check().valid) {
//       return Promise.resolve();
//     }
//     if (!this.options.endpoints.user) {
//       this.$auth.setUser({});
//       return Promise.resolve();
//     }
//     return this.$auth.requestWith(this.name, endpoint, this.options.endpoints.user).then((response) => {
//       const userData = getProp(response.data, this.options.user.property);
//       if (!userData) {
//         const error = new Error(`User Data response does not contain field ${this.options.user.property}`);
//         return Promise.reject(error);
//       }
//       this.$auth.setUser(userData);
//       return response;
//     }).catch((error) => {
//       this.$auth.callOnError(error, { method: "fetchUser" });
//       return Promise.reject(error);
//     });
//   }
//   async logout(endpoint = {}) {
//     if (this.options.endpoints.logout) {
//       await this.$auth.requestWith(this.name, endpoint, this.options.endpoints.logout).catch(() => {
//       });
//     }
//     return this.$auth.reset();
//   }
//   reset({ resetInterceptor = true } = {}) {
//     this.$auth.setUser(false);
//     this.token.reset();
//     if (resetInterceptor) {
//       this.requestHandler.reset();
//     }
//   }
//   updateTokens(response) {
//     const token = this.options.token.required ? getProp(response.data, this.options.token.property) : true;
//     this.token.set(token);
//   }
//   initializeRequestInterceptor() {
//     this.requestHandler.initializeRequestInterceptor();
//   }
// }
