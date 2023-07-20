
import ApiBase, { tryCastToApiError } from './api-base';

const  serviceUrls = { 
  documentQueryUrl  (){ return "/api/v2013/documents/" },
  documentUrl       (identifier){ return `/api/v2013/documents/${encodeURIComponent(identifier)}` },
  validateUrl       (){ return "/api/v2013/documents/x/validate" },
  draftUrl          (identifier){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft` },
  attachmentUrl     (identifier, filename){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/attachments/${encodeURIComponent(filename)}` },
  securityUrl       (identifier, operation){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/securities/${encodeURIComponent(operation)}` },
  draftSecurityUrl  (identifier, operation){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft/securities/${encodeURIComponent(operation)}` },
  draftLockUrl      (identifier, lockID){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft/locks/${encodeURIComponent(lockID)}` },
  documentVersionUrl(identifier){ return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions` },
}
export default class KmStorageApi extends ApiBase
{
  constructor(options) {
    super(options);
    
    this.documents    = new KmDocumentsApi(options);
    this.drafts       = new KmDraftsApi(options);
    this.locks        = new KmLocksApi(options);
    this.attachments  = new KmAttachmentsApi(options);

  }


}

class KmDocumentsApi extends ApiBase
{
  constructor(options) {
    super(options);
    this.self = this;
  }
  async query(params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.documentQueryUrl(), { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async get(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async exists(identifier,params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'head', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async put(identifier, body, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'put', body, params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async delete(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.documentUrl(identifier), { method:'delete', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async validate(body, params){
    params = params || {};

    if (!params?.schema && body?.header?.schema)
        params.schema = body.header.schema;
        
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.validateUrl(), { body, method:'put', body, params, baseURL })
                  
    return { data : data?.value, pending, error, refresh };
  }

  async canCreate(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.securityUrl(identifier, 'create'), { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async canUpdate(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.securityUrl(identifier, 'update'), { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async canDelete(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.securityUrl(identifier, 'delete'), { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
}
class KmDraftsApi extends ApiBase
{
  constructor(options) {
    super(options);
    
  }

  async query(params){
    params.collection = "mydraft";
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.documentQueryUrl(),  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }

  async get(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftUrl(identifier),  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }

  async exists(identifier,params){

    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftUrl(identifier),  { method:'head', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async put(identifier, body, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftUrl(identifier), 
      { body, method:'put', params, baseURL })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async delete(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftUrl(identifier),  { method:'delete', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  
  async canCreate(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'create'),  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async canUpdate(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'update'),  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async canDelete(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'delete'),  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
}
class KmLocksApi extends ApiBase
{
  constructor(options) {
    super(options);
  }

  async get(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftLockUrl(identifier),  { method:'get', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async exists(identifier,params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftLockUrl(identifier),  { method:'head', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async put(identifier, body, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftLockUrl(identifier), { body, method:'put', body, params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  async delete(identifier, params){
    const { data, pending, error, refresh } =  await useAPIFetch(serviceUrls.draftLockUrl(identifier),  { method:'delete', params })
                  
    return { data : data?.value, pending, error, refresh };
  }
}
class KmAttachmentsApi extends ApiBase
{
  constructor(options) {
    super(options);
  }

  async uploadTempFile(body, params)  {
    // const headers = {'Content-Type': undefined };
    const { data, pending, error, refresh } =  await useAPIFetch('/api/v2015/temporary-files',   { method:'post', body, params })
                  
    return { data : data?.value, pending, error, refresh };
  }
  upload(identifier, file, params) {
      params = params || {};
      params.identifier = identifier;
      params.filename = file.name;

      var contentType = params.contentType || getMimeTypes(file.name, file.type || "application/octet-stream");

      params.contentType = undefined;

      //TODO : use s3
      //1 request for temp file from s3
      //upload file 
      //return s3 location
      //persist temp file location in api
  }
  getMimeType(file) {
    // return getMimeTypes(file.name, file.type || "application/octet-stream");
    const filename = file.name
    const sMimeType = file.type || "application/octet-stream";     

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