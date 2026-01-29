//@ts-nocheck
import { HTTP_STATUS } from '~/utils';
export default defineEventHandler(async (event) => {
    try{
        const { targetTrackerApiUrl } = useRuntimeConfig().public;
        const   requestBody           = await readBody(event);
        return $fetch(`${targetTrackerApiUrl}/api/indicator/country`,  { method:'POST', body: requestBody});
    }
    catch(e){
        console.error(e)
        throw setResponseStatus(event, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to  query the target tracker API.');
    }
    
  })
  