export default defineNuxtConfig({
    runtimeConfig : {
        public:{
            ACCOUNTS_HOST_URL : process.env.NUXT_PUBLIC_ACCOUNTS_HOST_URL,
            API_URL           : process.env.NUXT_PUBLIC_API_URL          ,
            REALM_CONF_HOST   : process.env.NUXT_PUBLIC_REALM_CONF_HOST  ,
            auth : {
                accountsHostUrl : process.env.NUXT_PUBLIC_ACCOUNTS_HOST_URL,
                redirect: {
                    login:  `${process.env.NUXT_PUBLIC_ACCOUNTS_HOST_URL}/signin`,
                    logout: `${process.env.NUXT_PUBLIC_ACCOUNTS_HOST_URL}/logout`,
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
            socketIo: {
                name: 'SCBD',
                url: `${process.env.NUXT_PUBLIC_API_URL}`,
                default: true,
            },
        }
    }
})