
import ApiBase, { tryCastToApiError } from './api-base';

export default class KmWorkflowsApi extends ApiBase
{
    constructor(options) {
        super(options);
    }
    
    
    async getWorkflowHistory(params)  {
        const data =  useAPIFetch(`/api/v2013/workflows`, { method:'get', params })                
        return data;
    }

    async getWorkflow(workflowId)  {

        const data =  useAPIFetch(`/api/v2013/workflows/${encodeURIComponent(workflowId)}`,  { method:'get' })                
        return data;
    }

    async getBatchWorkflowDetails(batchId)  {

        const data = useAPIFetch(`/api/v2013/workflows/batches/${encodeURIComponent(batchId)}`,  { method:'get' })
                    
        return data;

    }

    async updateActivity(id, activityName, data) {
        return useAPIFetch("/api/v2013/workflows/" + id + "/activities/" + activityName, {method:'PUT', data})
    }

    async updateBatchActivity(id, activityName, data) {
        return useAPIFetch("/api/v2013/workflows/batches/" + id + "/activities/" + activityName, {method:'PUT', data})
    }
}