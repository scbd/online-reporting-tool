
import { HTTP_STATUS } from '~/utils';
export default defineEventHandler((event) => {
    try{
        const { targetTrackerApiUrl } = useRuntimeConfig().public;

        return $fetch(`${targetTrackerApiUrl}/api/goalsTargets`,{ method: 'get' });
    }
    catch(e){
        console.error(e)
        throw setResponseStatus(event, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to  query the target tracker API.');
    }
    
  })
  