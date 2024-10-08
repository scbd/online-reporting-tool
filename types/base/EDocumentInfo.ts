interface EDocumentInfo {
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
    metadata                : { [key: string]: string; };
    body                    : ENationalTarget7 | ENationalTarget7Mapping | ENationalReport7 |object;
    workingDocumentID       : number | null;
    workingDocumentCreatedOn: Date | null;
    workingDocumentCreatedBy: EUserInfo;
    workingDocumentUpdatedOn: Date | null;
    workingDocumentUpdatedBy: EUserInfo;
    workingDocumentSize     : number | null;
    workingDocumentOwner    : string;
    workingDocumentTitle    : ELstring;
    workingDocumentSummary  : ELstring;
    workingDocumentMetadata : { [key: string]: string; };
    workingDocumentBody     : ENationalTarget7 | ENationalTarget7Mapping | object;
    workingDocumentLock     : ELockInfo;
    realm                   : string;
    latestRevision          : number;
    isRequest               : boolean;
}