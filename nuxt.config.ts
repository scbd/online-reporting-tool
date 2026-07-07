import { viteSyncI18nFiles } from './i18n/sync-i18n';
// import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'


// see docs/ssr-migration-plan.md — hybrid rendering: SSR for public
// SEO-relevant routes, SPA for authenticated/editing surfaces.
const appLocales = ['ar', 'en', 'fr', 'es', 'ru', 'zh'];

// i18n strategy is prefix_and_default, so every rule must exist for the
// bare path and for each locale prefix.
const withLocalePrefixes = (paths: string[]) =>
    paths.flatMap(path =>
        ['', ...appLocales.map(l => `/${l}`)].map(prefix => `${prefix}${path}` || '/')
    );

const ssrPublicPaths = withLocalePrefixes([
    '/',
    '/knowledge-base/**',
    '/taxonomy/**',
    '/national-reports',
    '/national-reports/nr7',
    '/national-reports/nr7/*',
    '/national-targets',
    '/nbsaps',
    '/stakeholders',
    '/stakeholders/commitments',
    '/stakeholders/commitments/*',
    '/stakeholders/credentials/*',
    '/database/*',
]);

// authenticated sub-trees living under public prefixes must stay SPA
const clientOnlyOverrides = withLocalePrefixes([
    '/national-reports/nr7/my-country',
    '/national-reports/nr7/my-country/**',
    '/stakeholders/commitments/my-commitments',
    '/stakeholders/commitments/my-commitments/**',
    '/stakeholders/commitments/my-country-reviews',
    '/stakeholders/commitments/my-country-reviews/**',
    '/stakeholders/credentials/my-credentials',
    '/stakeholders/credentials/my-credentials/**',
]);

const routeRules = {
    '/**': { ssr: false },
    ...Object.fromEntries(ssrPublicPaths.map(p => [p, { ssr: true }])),
    ...Object.fromEntries(clientOnlyOverrides.map(p => [p, { ssr: false }])),
};

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

  ssr:true,

  routeRules,

  experimental: {
      // keep the Nuxt instance available after `await` in async setup()
      // (components call composables like useAuth() after awaits throughout)
      asyncContext: true
  },

  imports: {
      transform: {
          // vendored UMD/CJS builds (custom CKEditor) must not get
          // auto-import statements injected — breaks the ESM server bundle
          exclude: [/\/libs\//]
      }
  },

  build: {
      // packages that ship browser-oriented builds and break Nitro's
      // externals tracing when required from the server bundle
      transpile: [
          '@coreui/vue', '@coreui/icons-vue', 'vue-types',
          // CJS/ESM dual-package: without transpiling, the server gets two
          // copies of fontawesome-svg-core — library.add() fills one while
          // FontAwesomeIcon reads the other ("Could not find icon" on SSR)
          '@fortawesome/fontawesome-svg-core',
          '@fortawesome/vue-fontawesome',
          '@fortawesome/free-solid-svg-icons'
      ]
  },

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
          { code: 'ar', language: 'ar-SA',  dir: 'rtl' },
          { code: 'en', language: 'en-US',             },
          { code: 'fr', language: 'fr-FR',             },
          { code: 'es', language: 'es-ES',             },
          { code: 'ru', language: 'ru-RU',             },
          { code: 'zh', language: 'zh-CN',             },
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
              'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
              // CJS lodash breaks named imports in the Node ESM server bundle
              'lodash': 'lodash-es'
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
      ],
    css: {
        preprocessorOptions: {
            scss: {
            silenceDeprecations: ['import'],
            quietDeps: true, // hides warnings from node_modules deps like CoreUI
            }
        }
    }
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