import {
  LocalScheme, BaseScheme
} from '~auth/runtime'

export default class ScbdIframeAuthScheme extends BaseScheme {

  constructor($auth, options) {
    super( $auth, options )
    // console.log(this)
    this.$auth = $auth
    this.name = options._name

    // this.options = options
  }

  mounted({
    tokenCallback = () => this.$auth.reset(),
    refreshTokenCallback = undefined
  } = {}) {
    const {
      tokenExpired,
      refreshTokenExpired
    } = this.check(true)

    // if (refreshTokenExpired && typeof refreshTokenCallback === 'function') {
    //   refreshTokenCallback()
    // } else if (tokenExpired && typeof tokenCallback === 'function') {
    //   tokenCallback()
    // }
    

    // Initialize request interceptor
    this.initializeRequestInterceptor()

    this.getIframeToken().then((token)=>{
        console.log(token)
        // Fetch user once
        return this.$auth.fetchUserOnce()
    })
  }

  async login() {
    this.fetchUser()
  }

  async logout() {
    return this.$auth.reset()
  }

  // Override `fetchUser` method of `local` scheme
  async fetchUser(endpoint) {
    // Token is required but not available
    if (!this.check().valid) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).then((response) => {
      const user = getProp(response.data, this.options.user.property)

      // Transform the user object
      const customUser = {
        ...user,
        fullName: user.firstName + ' ' + user.lastName,
        roles: ['user']
      }

      // Set the custom user
      // The `customUser` object will be accessible through `this.$auth.user`
      // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
      this.$auth.setUser(customUser)

      return response
    }).catch((error) => {
      this.$auth.callOnError(error, {
        method: 'fetchUser'
      })
    })
  }

  async getIframeToken() {
    
    if (isServer()) return;
    if (this.token) return this.token;

    if (!this.accountsHostUrl) throw new Error('no accountsHostUrl given to auth store state');
   
    const accountsIframe = this.getIframe();    
    const self = this;

    window.addEventListener('message', this.receivePostMessage);

    accountsIframe.onload = () => {
      const { contentWindow } = accountsIframe;
      const type = 'getAuthenticationToken';
      const msg = JSON.stringify({ type });

      contentWindow.postMessage(msg, this.accountsHostUrl);

      return resolveToken(self);
    }

    return this.useIframe(this.iFrameEl);

  }

  receivePostMessage(event) {

    const {
      type,
      authenticationToken,
      authenticationEmail,
      expiration
    } = JSON.parse(event.data);

    if (type !== 'authenticationToken') throw new Error('unsupported authentication message type');

    this.token = {
      token: authenticationToken,
      email: authenticationEmail,
      expiration: expiration
    };

    return this.token;
  }

  getIframe() {

    if (isServer()) return undefined;

    const iFrames = window.document.getElementsByTagName('iframe');

    for (const anIframe of iFrames) {
      const { origin } = new URL(anIframe.getAttribute('src'));

      if (this.accountsHostUrl === origin)
        return anIframe;
    }

    //Iframe was not found, embed one
    var sc = document.createElement("iframe");
    sc.setAttribute("src", `${accountsHostUrl}/app/authorize.html`);
    sc.setAttribute("name", "scbdAuthFrame");
    sc.setAttribute("style", "display:none;");
    document.head.appendChild(sc);
    
    return sc;

  }

  resolveToken(self, ms = 300) {
    return new Promise(function (resolve, reject) {
      const interval = setInterval(function () {
        if (self.token) {
          resolve(self.token)
          clearInterval(interval)
        }
      }, ms);
    });
  }
}
