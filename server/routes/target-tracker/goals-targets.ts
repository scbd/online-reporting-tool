
import { HTTP_STATUS } from '~/utils';
export default defineEventHandler((event) => {
    try{
        const response = $fetch('https://tt-backend.new-web-supported-staging.linode.unep-wcmc.org/api/goalsTargets',  { method:'get'})
        return response;
    }
    catch(e){
        console.error(e)
        throw setResponseStatus(event, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to  query the target tracker API.');
    }
    
  })
  