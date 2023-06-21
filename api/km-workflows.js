
import ApiBase, { tryCastToApiError } from './api-base';

export default class KmWorkflowsApi extends ApiBase
{
  constructor(options) {
    super(options);
  }
  
  
  async getWorkflowHistory(params)  {
    return this.$axios.get(`api/v2013/workflows`, { params })
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async getWorkflow(workflowId)  {

    return this.$axios.get(`api/v2013/workflows/${workflowId}`)
                    .then(res => res.data)
                    .catch(tryCastToApiError);
  }

  async startNewWorkflow(workflowId){

    return this.$axios.put(`/api/v2013/workflows/failed-workflows/${workflowId}/new-workflow`)
                    .then(res => res.data)
                    .catch(tryCastToApiError);

  }

}