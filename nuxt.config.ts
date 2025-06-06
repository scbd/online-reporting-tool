import { viteSyncI18nFiles } from './i18n/sync-i18n';
// import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'


// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript:{
      typeCheck:true,
      strict:true
  },

  devtools: { enabled: true },

  sourcemap: {
      client: true
  },

  ssr:false,

  nitro: {
      storage: {
          ".data:auth": { driver: "fs", base: "./.data/auth" },
      },
  },

  extends:[
      './auth/scbdIframe',
      './config'
  ],

  modules: [
      '@nuxtjs/i18n-edge',
      '@pinia/nuxt',
      '@pinia-plugin-persistedstate/nuxt',
      'nuxt-gtag'
  ],

  css:[
      // 'bootstrap/dist/css/bootstrap.css'
      '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  i18n: {       
      locales: [
          { code: 'ar', iso: 'ar-SA',  dir: 'rtl' },
          { code: 'en', iso: 'en-US',             },
          { code: 'fr', iso: 'fr-FR',             },
          { code: 'es', iso: 'es-ES',             },
          { code: 'ru', iso: 'ru-RU',             },
          { code: 'zh', iso: 'zh-CN',             },
      ],
      defaultLocale: 'en',
      detectBrowserLanguage : {
          alwaysRedirect: true,
          fallbackLocale: 'en'
      },
      // precompile: {
      //     strictMessage: false,
      // },
      // strictMessage: false,
      // escapeHtml:true,
      strategy: "prefix_and_default",
      vueI18n: './config/i18n.config.ts'
  },

  vue: {  
      compilerOptions: {
          isCustomElement: (tag) =>{
              if(tag.startsWith('km-')){
                  // console.log(tag)
                  // return true
              }
          },
      },
  },

  vite: {
  
      resolve: {
          alias: {
              'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
          }
      },
      plugins: [
          // @ts-ignore
          viteSyncI18nFiles({}),
          // VueI18nVitePlugin({
          //   include: [
          //     resolve(dirname(fileURLToPath(import.meta.url)), './i18n/dist/*.json')
          //   ]
          // }),
      ]
  },
  gtag: {       
    //   id: process.env.NUXT_PUBLIC_GTAG_ID || 'G-XXXXXX',
      enabled: true//(process.env?.NUXT_PUBLIC_ACCOUNTS_HOST_URL||'').indexOf('accounts.cbd.int') >= 0
  },
  components: [
      {
          path: '~/components',
          pathPrefix: false,
      },
  ],

  compatibilityDate: '2025-01-13'
})