import { auth } from './configs/auth';
import { i18n } from './configs/i18n';
import i18nFileSync from './plugins/sync-i18n';

export default {
  ssr: false,
  /*
  ** Headers of the page
  */
  head: {
    title: 'Online Reporting Tool',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  loadingIndicator: {
    name: 'pulse',
    color: '#3B8070',
    background: 'white'
  },
  /*
  ** Global CSS
  */
  css: [
    { src: '~/node_modules/bootstrap/dist/css/bootstrap.css' },
    { src: '~/assets/scss/style.scss', lang: 'scss' },
    { src: '@fortawesome/fontawesome-svg-core/styles.css' }
  ],

  styleResources: {
    scss: [
      '~/assets/scss/_variables.scss',
      '~/assets/scss/_mixins.scss'
    ]
  },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: "~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js", mode: "client" },
    { src: '~/plugins/coreui', mode: 'client' },
    { src: '~/plugins/font-awesome', mode: 'client' },
    { src: '~/plugins/i18n', mode: 'client' },
    { src: '~/plugins/axios.js', mode:'client'},
    { src: '~/plugins/register-apis.js', mode:'client'},
    { src: '~/plugins/app-routes.js', mode:'client'}
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [

    // Nuxt 2 only:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    hotMiddleware: {
      client: {
        noInfo: true,
        quiet:true
      },
    },
    extend (config, ctx) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
    "babel": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "esmodules": true
            }
          }
        ]
      ],
      "plugins": [
      ]
    },
    plugins:[
      new i18nFileSync({})
    ]
  },
  router: {
    linkActiveClass: 'active-link', 
    middleware: [ 'auth', 'security' ]
  },
  auth,
  i18n,
  publicRuntimeConfig: {
    ACCOUNTS_HOST_URL : process.env.ACCOUNTS_HOST_URL || 'https://accounts.cbddev.xyz',
    API_HOST_URL      : process.env.API_HOST_URL      || 'https://api.cbddev.xyz',
    REALM_CONF_HOST   : process.env.REALM_CONF_HOST   || 'ort.cbddev.xyz',
    auth : {
      accountsHostUrl : process.env.ACCOUNTS_HOST_URL || 'https://accounts.cbddev.xyz',
      redirect: {
        login:  `${process.env.ACCOUNTS_HOST_URL}/signin`,
        logout: `${process.env.ACCOUNTS_HOST_URL}/logout`,
        callback: false,
        home: '/'
      },
      strategies: {
        ScbdIframeAuthStrategy: {
          token: {
            global: true,
            prefix: '_token.',
            property: 'authenticationToken',
            type: 'Bearer',
            name: 'Authorization',
            required:true
          },
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
      },
    }
  },
  privateRuntimeConfig: {},
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
}
