
export const auth = {
  redirect: {
    login: `${process.env.ACCOUNTS_HOST_URL}/signin`,
    logout: `${process.env.ACCOUNTS_HOST_URL}/logout`,
    callback: false,
    home: '/'
  },
  strategies: {
    ScbdIframeAuthStrategy: {
      scheme: '~/schemes/scbd-iframe-auth-scheme',
      token: {
        global: true,
        prefix: '_token.',
        property: 'authenticationToken',
        type: 'Bearer',
        name: 'Authorization',
        required:true
      },
      accountsHostUrl: process.env.ACCOUNTS_HOST_URL,
      endpoints: {
        logout: false,
        login: {
          url: `${process.env.API_HOST_URL}/api/v2013/authentication/token`,
          method: 'post'
        },
        user: {
          url: `${process.env.API_HOST_URL}/api/v2013/authentication/user`,
          method: 'get'
        }
      },
      user: {
        property: false,
        autoFetch: true
      },
    }
  }
}
