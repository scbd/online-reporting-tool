
import ApiBase, { tryCastToApiError } from './api-base';

export default class KmWorkflowsApi extends ApiBase
{
    constructor(options) {
        super(options);
    }
    
    
    async getWorkflows(q:object, { count, length, skip, sort } = {}) {
        const query = {
            q: JSON.stringify(q),
            l: length,
            s: sort,
            sk: skip,
            c: count
        }
        const data =  await useAPIFetch(`/api/v2013/workflows`, { method:'get', query })                
        return data;
    }

    async getWorkflow(workflowId)  {

        const data =  await useAPIFetch(`/api/v2013/workflows/${encodeURIComponent(workflowId)}`,  { method:'get' })                
        return data;
    }

    async getBatchWorkflowDetails(batchId):Promise<EKmDocumentsBatchWorkflow>  {

        const data = useAPIFetch<EKmDocumentsBatchWorkflow>(`/api/v2013/workflows/batches/${encodeURIComponent(batchId)}`,  { method:'get' })
                    
        return data;

    }

    async updateActivity(id, activityName, body) {
        return useAPIFetch("/api/v2013/workflows/" + id + "/activities/" + activityName, {method:'PUT', body})
    }

    async updateBatchActivity(id, activityName, body) {
        return useAPIFetch("/api/v2013/workflows/batches/" + id + "/activities/" + activityName, {method:'PUT', body})
    }

    async cancelWorkflow(id:string) {
        const params = { 'action': 'cancel' };
        return useAPIFetch(`/api/v2013/workflows/${id}`, {method:'DELETE', params });

    }

    async cancelBatch(batchId:string) {
        const params = { 'action': 'cancel' };
        return useAPIFetch(`/api/v2013/workflows/batches/${batchId}`, {method:'DELETE', params});

    }
}