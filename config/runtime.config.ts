export default defineNuxtConfig({
    runtimeConfig : {
        public:{
            ACCOUNTS_HOST_URL : process.env.NUXT_PUBLIC_ACCOUNTS_HOST_URL || 'https://accounts.cbddev.xyz',
            API_URL           : process.env.NUXT_PUBLIC_API_URL           || 'https://api.cbddev.xyz',
            REALM_CONF_HOST   : process.env.NUXT_PUBLIC_REALM_CONF_HOST   || 'ort.cbddev.xyz',
            auth : {
                // accountsHostUrl : process.env.NUXT_PUBLIC_ACCOUNTS_HOST_URL,
                redirect: {
                    login:  `/signin`,
                    logout: `/logout`,
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
                                url: `/api/v2013/authentication/token`,
                                method: 'post'
                            },
                            user: {
                                url: `/api/v2013/authentication/user`,
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
            socketIo: {
                name: 'SCBD',
                url: `/`,
                default: true,
            },
        }
    }
})