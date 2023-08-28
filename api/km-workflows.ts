
import ApiBase, { tryCastToApiError } from './api-base';
import { EKmDocumentsBatchWorkflow } from '@/types/EKmDocumentsBatchWorkflow.js';

export default class KmWorkflowsApi extends ApiBase
{
    constructor(options) {
        super(options);
    }
    
    
    async getWorkflowHistory(params)  {
        
        const data =  await useAPIFetch(`/api/v2013/workflows`, { method:'get', params })                
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