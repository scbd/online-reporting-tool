export default defineNuxtConfig({
    runtimeConfig : {
        public:{
            ACCOUNTS_HOST_URL : process.env.ACCOUNTS_HOST_URL,
            API_URL           : process.env.API_URL          ,
            REALM_CONF_HOST   : process.env.REALM_CONF_HOST  ,
            auth : {
                accountsHostUrl : process.env.ACCOUNTS_HOST_URL,
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
            socketIo: {
                name: 'SCBD',
                url: `${process.env.API_URL}`,
                default: true,
            },
        }
    }
})