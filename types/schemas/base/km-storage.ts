import type { EDocumentInfo } from "./EDocumentInfo";
import type { EUserInfo } from "./EUserInfo";

export interface KmStorageParam {
    collection : string
    schema     : string;
    identifier : string;
}

export interface Government {
    identifier: string;
}
export interface Metadata {
    government: string;
    userID:     string;
    schema:     string;
}

export interface KmDocumentInfoList {
    Count : number,
    Items : EDocumentInfo[]
}

export interface KmDocumentAttachment {
    documentAttachmentID: number;
    attachmentID:         number;
    documentUID:          string;
    createdOn:            Date;
    createdBy:            EUserInfo;
    submittedOn:          Date;
    submittedBy:          EUserInfo;
    isPublic:             boolean;
    filename:             string;
    mediaType:            string;
    hash:                 string;
    size:                 number;
    url:                  string;
}