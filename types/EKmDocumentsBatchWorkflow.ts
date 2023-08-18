export interface EKmDocumentsBatchWorkflow {
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
  
  export interface Id {
    $oid: string
  }
  
  export interface Meta {
    createdBy: number
    createdOn: Date
    updatedBy: number
    updatedOn: Date
  }
    
  export type RecordStatus = { [key: string] : RecordStatusRecord }
  export interface RecordStatusRecord {
     workflowId: string
  }
  
  export interface WorkflowActivity {
    data: Data
    name: string
  }
  
  export interface Data {
    action: string
  }
  