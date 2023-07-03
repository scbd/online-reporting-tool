import { viteSyncI18nFiles } from './i18n/sync-i18n';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },  
  ssr:false,
  runtimeConfig: {
    public:{
      ACCOUNTS_HOST_URL : process.env.ACCOUNTS_HOST_URL || 'https://accounts.cbddev.xyz',
      API_URL           : process.env.API_URL           || 'https://api.cbddev.xyz',
      REALM_CONF_HOST   : process.env.REALM_CONF_HOST   || 'ort.cbddev.xyz',
      auth : {
        accountsHostUrl : process.env.ACCOUNTS_HOST_URL || 'https://accounts.cbddev.xyz',
        redirect: {
          login:  `${process.env.ACCOUNTS_HOST_URL}/signin`,
          logout: `${process.env.ACCOUNTS_HOST_URL}/logout`,
          callback: false,
          home: '/'
        },
        name: "scbd-iframe-session",
        stratagey:'ScbdIframeAuthStrategy',
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
                        url: `${process.env.API_URL}/api/v2013/authentication/token`,
                        method: 'post'
                    },
                    user: {
                        url: `${process.env.API_URL}/api/v2013/authentication/user`,
                        method: 'get'
                    }
                },
                user: {
                    property: false,
                    autoFetch: true
                },
            }
        },
      },
    }
  },
  nitro: {
      storage: {
          ".data:auth": { driver: "fs", base: "./.data/auth" },
      },
  },
  extends:[
    './auth/scbdIframe'
  ],
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],
  css:[
    // 'bootstrap/dist/css/bootstrap.css'
  ],
  i18n: {
    locales: ['ar','en', 'fr', 'es', 'ru', 'zh'],
    defaultLocale: 'en',
    fallbackLocale: 'en',
    locale: 'en',
    detectBrowserLanguage : {
        alwaysRedirect: true,
    },
    // strategy: "prefix",
    vueI18n: './i18n.config.ts' // if you are using custom path, default 
  },
  vite: {
    plugins: [
      // VueI18nPlugin({
      //   include: resolve(dirname(fileURLToPath(import.meta.url)), './i18n-dist/**'),        
      // }),
      viteSyncI18nFiles()
    ]
  }

})
