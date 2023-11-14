
export default defineEventHandler((event) => {
    try{
        const response = $fetch('https://tt-backend.new-web-supported-staging.linode.unep-wcmc.org/api/goalsTargets',  { method:'get'})
        return response;
    }
    catch(e){
        console.error(e)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to  query the target tracker API.',
          }) 
    }
    
  })
  