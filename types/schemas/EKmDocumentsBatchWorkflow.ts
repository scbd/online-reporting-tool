interface EKmDocumentsBatchWorkflow {
    _id: Id
    realm: string
    government: string
    schema: string
    records: Array<string>
    meta: Meta
    status: string
    recordStatus: RecordStatus
    workflowActivity: WorkflowActivity
  }
  
  interface Id {
    $oid: string
  }
  
  interface Meta {
    createdBy: number
    createdOn: Date
    updatedBy: number
    updatedOn: Date
  }
    
  type RecordStatus = { [key: string] : RecordStatusRecord }
  interface RecordStatusRecord {
     workflowId: string
  }
  
  interface WorkflowActivity {
    data: Data
    name: string
  }
  
  interface Data {
    action: string
  }
  