import { viteSyncI18nFiles } from './i18n/sync-i18n';
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'


process.env.ACCOUNTS_HOST_URL = process.env.ACCOUNTS_HOST_URL || 'https://accounts.cbddev.xyz';
process.env.API_URL           = process.env.API_URL           || 'https://api.cbddev.xyz';
process.env.REALM_CONF_HOST   = process.env.REALM_CONF_HOST   || 'ort.cbddev.xyz';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },  
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
        '@pinia-plugin-persistedstate/nuxt'
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
        fallbackLocale: 'en',
        locale: 'en',
        detectBrowserLanguage : {
            alwaysRedirect: true,
        },
        // precompile: {
        //     strictMessage: false,
        // },
        // strictMessage: false,
        // escapeHtml:true,
        // strategy: "prefix",
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
            viteSyncI18nFiles(),
            // VueI18nVitePlugin({
            //   include: [
            //     resolve(dirname(fileURLToPath(import.meta.url)), './i18n/dist/*.json')
            //   ]
            // }),
        ]
    }
})
