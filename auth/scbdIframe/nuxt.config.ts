// https://nuxt.com/docs/api/configuration/nuxt-config
  
export default defineNuxtConfig({
    runtimeConfig: {
        public:{
            auth: {
                name: "scbd-iframe-session",
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
                                url: `${process.env.NUXT_PUBLIC_API_URL}/api/v2013/authentication/token`,
                                method: 'post'
                            },
                            user: {
                                url: `${process.env.NUXT_PUBLIC_API_URL}/api/v2013/authentication/user`,
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
});