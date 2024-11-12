
import { type ApiOptions } from "~/types/api/api-options";
import type { ELstring } from "~/types/schemas/base/ELstring";
import type { TempFileUploadOptions, TempSlotBody, TempSlotResponse } from "~/types/api/temp-slot";

import ApiBase from './api-base';
import type { KmDocumentAttachment, KmDocumentInfoList, KmStorageParam } from "~/types/schemas/base/km-storage";
import type { EDocumentInfo } from "~/types/schemas/base/EDocumentInfo";
import type { HttpHeaders } from "~/types/api/http-headers";

const  serviceUrls = { 
  documentQueryUrl      (){ return "/api/v2013/documents/" },
  documentUrl           (identifier:string){ return `/api/v2013/documents/${encodeURIComponent(identifier)}` },
  validateUrl           (){ return "/api/v2013/documents/x/validate1" },
  draftUrl              (identifier:string){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft` },
  attachmentUrl         (identifier:string, filename:string) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/attachments/${encodeURIComponent(filename)}` },
  temporaryAttachmentUrl(                    ) { return `/api/v2015/temporary-files` },
  persistAttachmentUrl  (identifier:string, guid:string    ) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/attachments/persist-temporary/${encodeURIComponent(guid)}` },
  securityUrl           (identifier:string, operation:string){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/securities/${encodeURIComponent(operation)}` },
  draftSecurityUrl      (identifier:string, operation:string){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft/securities/${encodeURIComponent(operation)}` },
  draftLockUrl          (identifier:string, lockID:string)   { return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft/locks/${encodeURIComponent(lockID)}` },
  documentVersionUrl    (identifier:string)           { return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions` },
  saveDraftVersionUrl   (identifier:string)           { return `/api/v2018/temporary-documents/${encodeURIComponent(identifier)}` },
  publishDraftUrl       (schema:string, identifier:string)   { return `/api/v2023/documents/schemas/${encodeURIComponent(schema)}/${encodeURIComponent(identifier||'')}` },
  
  
}
export default class KmStorageApi extends ApiBase
{
  documents   :KmDocumentsApi;
  drafts      :KmDraftsApi;
  locks       :KmLocksApi;
  attachments :KmAttachmentsApi;

  constructor(options:ApiOptions) {
    super(options);
    
    this.documents    = new KmDocumentsApi(options);
    this.drafts       = new KmDraftsApi(options);
    this.locks        = new KmLocksApi(options);
    this.attachments  = new KmAttachmentsApi(options);

  }

}

class KmDocumentsApi extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }

  async query(params:object){
    const data =  await useAPIFetch(serviceUrls.documentQueryUrl(), { method:'get', params })
                  
    return data;
  }
  async get(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'get', params })
                  
    return data;
  }
  async exists(identifier:string,params:object){
    const data =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'head', params })
                  
    return data;
  }
  async put(identifier:string, body:object, params:object){
    const data =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'put', body, params })
                  
    return data;
  }
  async delete(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'delete', params })
                  
    return data;
  }
  async validate(body:any, params:KmStorageParam){
    params = params || {};

    if (!params?.schema && body?.header?.schema)
        params.schema = body.header.schema;
        
    params.identifier = body.header.identifier;

    const data =  await useAPIFetch(serviceUrls.validateUrl(), { body, method:'put', params })
                  
    return data;
  }

  async canCreate(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.securityUrl(identifier, 'create'), { method:'get', params })
                  
    return data;
  }
  async canUpdate(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.securityUrl(identifier, 'update'), { method:'get', params })
                  
    return data;
  }
  async canDelete(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.securityUrl(identifier, 'delete'), { method:'get', params })
                  
    return data;
  }
}
class KmDraftsApi extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
    
  }

  async query(params:KmStorageParam):Promise<KmDocumentInfoList>{
    params.collection = "mydraft";
    const data =  await useAPIFetch<KmDocumentInfoList>(serviceUrls.documentQueryUrl(),  { method:'get', params })
    
    if(data?.Items?.length){
        data.Items = data.Items.map((e:EDocumentInfo)=>{
                        if(e.workingDocumentBody){
                            e.body = e.workingDocumentBody;
                        }
                        return e;
                    });
    }

    return data;
  }

  async get(identifier:string, params:object):Promise<EDocumentInfo>{
    const data =  await useAPIFetch<EDocumentInfo>(serviceUrls.draftUrl(identifier),  { method:'get', params })

    if(data.workingDocumentBody){
        data.body = data.workingDocumentBody;
    }

    return data;
  }

  async exists(identifier:string,params:object){

    const data =  await useAPIFetch(serviceUrls.draftUrl(identifier),  { method:'head', params })
                  
    return data;
  }
  async put(identifier:string, body:object, params:object){
    const data = await useAPIFetch( serviceUrls.draftUrl(identifier), { body, method:'put', params });
    return data;
  }

  async publishDraftPost(schema:string, identifier:string, document:object, additionalInfo:ELstring){
    const body = {
      document,
      additionalInfo
    }
    const data = await useAPIFetch( serviceUrls.publishDraftUrl(schema, identifier), { body, method: 'post' });
    return data;
  }

  async publishDraftPut(schema:string, identifier:string, document:object, additionalInfo:ELstring){
    const body = {
      document,
      additionalInfo
    }
    const data = await useAPIFetch( serviceUrls.publishDraftUrl(schema, identifier), { body, method: 'put' });
    return data;
  }

  async saveDraftVersion(identifier:string, body:object, params:object){    
    const data = await useAPIFetch( serviceUrls.saveDraftVersionUrl(identifier), { body, method:'put', params });
    return data;
  }

  async delete(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.draftUrl(identifier),  { method:'delete', params })
                  
    return data;
  }
  
  async canCreate(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'create'),  { method:'get', params })
                  
    return data;
  }
  async canUpdate(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'update'),  { method:'get', params })
                  
    return data;
  }
  async canDelete(identifier:string, params:object){
    const data =  await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'delete'),  { method:'get', params })
                  
    return data;
  }
}
class KmLocksApi extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }

  async get(identifier:string, lockId:string, params:object){
    const data =  await useAPIFetch(serviceUrls.draftLockUrl(identifier, lockId),  { method:'get', params })
                  
    return data;
  }
  async exists(identifier:string, lockId:string,params:object){
    const data =  await useAPIFetch(serviceUrls.draftLockUrl(identifier, lockId),  { method:'head', params })
                  
    return data;
  }
  async put(identifier:string, lockId:string, body:object, params:object){
    const data =  await useAPIFetch(serviceUrls.draftLockUrl(identifier, lockId), { body, method:'put', params })
                  
    return data;
  }
  async delete(identifier:string, lockId:string, params:object){
    const data =  await useAPIFetch(serviceUrls.draftLockUrl(identifier, lockId),  { method:'delete', params })
                  
    return data;
  }
}
class KmAttachmentsApi extends ApiBase
{
  constructor(options:ApiOptions) {
    super(options);
  }

  async uploadTempFile(identifier:string, file:FormData|File, fileName:string, options:TempFileUploadOptions)  {
    
    
    const { timeout, onUploadProgress, onDownloadProgress }= { ...(options||{}) };
    const requestHeaders: HeadersInit = new Headers();

    const apiConfig = {
      headers: requestHeaders,
      timeout: timeout || 60 * 60 * 1000,
      onUploadProgress, 
      onDownloadProgress
    };
    
    const tempSlotBody:TempSlotBody = {
      filename: fileName,
      contentType: ""
    }

    //find the content type and validate with whitelist
    if(file instanceof FormData){
        const tempFile = file.get('file') as File;
        if(tempFile){
            tempSlotBody.contentType = this.getMimeType(tempFile);
        }
    }
    else if(file instanceof File){
        tempSlotBody.contentType = this.getMimeType(file)
    }
    else{
        throw new Error('Unable to read file information.')
    }
    
    if (this.mimeTypeWhitelist().indexOf(tempSlotBody.contentType) < 0) {
        throw new Error("File type not supported: " + tempSlotBody.contentType + "(" + fileName + ")");
    }

    const key = S4();
    // get a temporary slot from S3 to upload the file
    const temporarySlot =  await useAPIFetch<TempSlotResponse>(serviceUrls.temporaryAttachmentUrl(),   { key, method:'POST', body : tempSlotBody})
    
    // upload the file to the temporary slot on S3    
    apiConfig.headers.set('Content-Type', temporarySlot.contentType);
    
    const temporaryAttachment =  await useAPIFetch(temporarySlot.url, { key,  method:"PUT", body:file, ...apiConfig});

    //persists the file using the KM persists attachments endpoint
    const persistedAttachment =  await useAPIFetch<KmDocumentAttachment>(serviceUrls.persistAttachmentUrl(identifier, temporarySlot.uid),   { key,  method:'POST', body:{fileName}  })
    
    const config = useRuntimeConfig();
    return {
        ...persistedAttachment,
        url     : config.public.API_URL+persistedAttachment.url        
    };
  }
  // async upload(identifier:string, file:File, params:any) {
  //       params = params || {};
  //       params.identifier = identifier;
  //       params.filename = file.name;

  //       var contentType = params.contentType || this.getMimeType(file);

  //       // params.contentType = undefined;
  //       params.headers = params.header || {};
  //       params.headers["Content-Type"] = contentType;

  //       ////TEMP////////////////
  //           //upload to temp url
  //           const data =  await useAPIFetch(serviceUrls.attachmentUrl(identifier, file.name),   { method:'put', body:file, params })

            
  //           const config = useRuntimeConfig()
  //           data.url = config.public.API_URL+data.url;
  //           //TODO:move to ckeditor control
  //           data.urls = {//required by ckeditor
  //               "default": data.url 
  //           };
            
  //           return data;
  //       ///////TEMP////////////////

  //     //TODO : use s3
  //     //1 request for temp file from s3
  //     //upload file 
  //     //return s3 location
  //     //persist temp file location in api
  // }
  getMimeType(file:File) {
    const filename = file.name
    let sMimeType = file.type || "application/octet-stream";     

    if (filename && sMimeType == "application/octet-stream") {
        var sExt = "";
        var iIndex = filename.lastIndexOf(".");

        if (iIndex >= 0)
            sExt = filename.substring(iIndex).toLowerCase();

        if (sExt == ".json") sMimeType = "application/json";
        if (sExt == ".geojson") sMimeType = "application/json";
        if (sExt == ".xml") sMimeType = "application/xml";
    }

    return sMimeType;
  }

  mimeTypeWhitelist(){
    return [
      "application/json","application/ogg","application/pdf","application/xml","application/zip",
      "application/x-zip","application/x-zip-compressed","audio/mpeg","audio/x-ms-wma","audio/x-wav",
      "image/gif","image/jpeg", "image/png","image/bmp",
      "image/tiff",
      "text/csv","text/html","text/plain","text/xml","video/mpeg","video/mp4","video/quicktime",
      "video/x-ms-wmv","video/x-msvideo","video/x-flv","application/vnd.oasis.opendocument.text",
      "application/vnd.oasis.opendocument.spreadsheet","application/vnd.oasis.opendocument.presentation","application/vnd.oasis.opendocument.graphics",
      "application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-powerpoint","application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
  }
}