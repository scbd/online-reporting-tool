
export const auth = {
  
  scopeKey: 'roles',
  strategies: {
    ScbdIframeAuthStrategy: {
      scheme: '~/schemes/scbd-iframe-auth-scheme',
    }
  },
  plugins:[
    'plugins/security.js'
  ]
}
