import type { ELstring } from "./base/ELstring"
import type { EUserInfo } from "./base/EUserInfo"

export interface EKmDocumentsBatchWorkflow {
    _id: Id
    realm: string
    government: string
    schema: string
    records: Array<string>
    meta: Meta
    status: string
    recordStatus: RecordStatus
    workflowActivity: BatchWorkflowActivity
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
  
  export interface BatchWorkflowActivity {
    data: Data
    name: string
  }
  
  export interface Data {
    action: string
  }
  

  export interface Workflow {
    _id:            string;
    type:           WorkflowType;
    activities:     WorkflowActivity[];
    workflowAge:    WorkflowAge;
    execution:      string;
    createdOn:      Date;
    createdBy:      number;
    data:           Data;
    state:          string;
    __v:            number;
    closedOn:       Date;
    result:         WorkflowResult;
    createdBy_info: EUserInfo;
}


export interface WorkflowData {
    realm:      string;
    identifier: string;
    title:      ELstring;
    abstract:   ELstring;
    metadata:   Metadata;
    batchId:    string;
}

export interface Metadata {
    government: string;
    userID:     string;
    schema:     string;
}

export interface WorkflowResult {
    action:     string;
    identifier: string;
    documentID: number;
    revision:   number;
}

export interface WorkflowType {
    name:    string;
    version: string;
}

export interface WorkflowAge {
    age:  number;
    type: string;
}
export interface WorkflowActivity{
  
}