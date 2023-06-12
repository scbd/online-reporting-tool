import {  LocalScheme } from '~auth/runtime'


export default class ScbdIframeAuthScheme extends LocalScheme {

  constructor($auth, options, ...defaults) {

    let authConf = {};
    if($auth.ctx.$config.auth?.strategies){
      authConf = $auth.ctx.$config.auth?.strategies[options.name]
    }

    // if redirect option are missing auth conf than the module uses its defaults, 
    // so check if there are any custom redirect in conf else use the option one
    $auth.options.redirect  = $auth.ctx.$config.auth?.redirect  || $auth.options?.redirect;
    options.accountsHostUrl = $auth.ctx.$config.auth?.accountsHostUrl || options.accountsHostUrl

    super( $auth, options,  ...defaults, authConf )

    this.userTokenResolved = undefined;

    //append current url as return url
    this.$auth.onRedirect((to, from)=>{
      return `${to}?returnUrl=${encodeURIComponent(window.location.origin)}${encodeURIComponent(from)}`
    });

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
