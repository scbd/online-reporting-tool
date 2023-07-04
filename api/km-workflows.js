
import ApiBase, { tryCastToApiError } from './api-base';

export default class KmWorkflowsApi extends ApiBase
{
  constructor(options) {
    super(options);
  }
  
  
  async getWorkflowHistory(params)  {
    return $fetch.get(`/api/v2013/workflows`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getWorkflow(workflowId)  {

    return $fetch.get(`/api/v2013/workflows/${encodeURIComponent(workflowId)}`)
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async startNewWorkflow(workflowId){

    return $fetch.put(`/api/v2013/workflows/failed-workflows/${encodeURIComponent(workflowId)}/new-workflow`)
                    .then(res => res.data)
                    .catch(tryCastToApiError);

  }

}