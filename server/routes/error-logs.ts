export default defineEventHandler((event) => {
    try{
        const conf = useRuntimeConfig();
        const options = {
            apiUrl : conf.public.API_URL,
            appVersion : conf.public.TAG||conf.public.COMMIT,
            realm:conf.public.REALM_CONF_HOST
        }

        return proxyRequest(event, `${options.apiUrl}/api/v2016/error-logs?type=client-app-errors&serverAppVersion=${encodeURIComponent(options.appVersion)}&realm=${options.realm}`, {})
    }
    catch(e){
        console.error(e)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to  log error.',
          }) 
    }
    
  })
  