// import './configs/default-config';
import { auth } from './configs/auth';

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
  /*
  ** Global CSS
  */
  css: [
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
    { src: '~/plugins/coreui', mode: 'client' },
    { src: '~/plugins/font-awesome', mode: 'client' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
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
    extend (config, ctx) {
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
  },
  router: {
    middleware: ['auth']
  },
  auth,
  publicRuntimeConfig: {
    ACCOUNTS_HOST_URL : process.env.ACCOUNTS_HOST_URL || 'https://accounts.cbddev.xyz',
    API_HOST_URL      : process.env.API_HOST_URL      || 'https://api.cbddev.xyz',
    auth : {
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
      }
    }
  },
  privateRuntimeConfig: {}
}
