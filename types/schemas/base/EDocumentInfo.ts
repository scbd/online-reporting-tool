import type { EUserInfo } from "./EUserInfo";
import type { ELstring } from "./ELstring";
import type { ENationalReport7 } from "../ENationalReport7";
import type { ENationalTarget7 } from "../ENationalTarget7";
import type { ENationalTarget7Mapping } from "../ENationalTarget7Mapping";
import type { ELockInfo } from "./ELockInfo";
import type { Metadata } from "~/types/schemas/base/km-storage";
import type { EStakeholderCommitment } from "../EStakeholderCommitment";
import type { EStakeholderCommitmentIntent } from "../EStakeholderCommitmentIntent";

export type Schemas = ENationalTarget7 | ENationalTarget7Mapping | ENationalReport7 | 
                      EStakeholderCommitment | EStakeholderCommitmentIntent | object;
export interface EDocumentInfo {
    identifier              : string;
    documentID              : number | null;
    createdOn               : Date;
    createdBy               : EUserInfo;
    updatedOn               : Date;
    updatedBy               : EUserInfo;
    submittedOn             : Date;
    submittedBy             : EUserInfo;
    deletedOn               : Date | null;
    deletedBy               : EUserInfo;
    type                    : string;
    owner                   : string;
    revision                : number;
    size                    : number;
    rights                  : string[];
    charset                 : string;
    title                   : ELstring;
    summary                 : ELstring;
    metadata                : Metadata;
    body                    : Schemas;
    workingDocumentID       : number | null;
    workingDocumentCreatedOn: Date | null;
    workingDocumentCreatedBy: EUserInfo;
    workingDocumentUpdatedOn: Date | null;
    workingDocumentUpdatedBy: EUserInfo;
    workingDocumentSize     : number | null;
    workingDocumentOwner    : string;
    workingDocumentTitle    : ELstring;
    workingDocumentSummary  : ELstring;
    workingDocumentMetadata : Metadata;
    workingDocumentBody     : Schemas;
    workingDocumentLock     : ELockInfo;
    realm                   : string;
    latestRevision          : number;
    isRequest               : boolean;
}