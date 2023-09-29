
export default defineEventHandler(async (event) => {
    try{
        const requestBody = await readBody(event)
        const response = $fetch('https://tt-backend.new-web-supported-staging.linode.unep-wcmc.org/api/indicator/country',  { method:'POST', body: requestBody})
        return response;
    }
    catch(e){
        console.log(e)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to  query the target tracker API.',
          }) 
    }
    
  })
  