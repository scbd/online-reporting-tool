
import ApiBase, { tryCastToApiError } from './api-base';

export default class KmDocumentsApi extends ApiBase
{
  constructor(options) {
    super(options);
  }

  serviceUrls = { 
    documentQueryUrl  (){ return "/api/v2013/documents/" },
    documentUrl       (identifier){ return `/api/v2013/documents/${encodeUriComponent(identifier)}` },
    validateUrl       (){ return "/api/v2013/documents/x/validate" },
    draftUrl          (identifier){ return `/api/v2013/documents/${encodeUriComponent(identifier)}/versions/draft` },
    attachmentUrl     (identifier, filename){ return `/api/v2013/documents/${encodeUriComponent(identifier)}/attachments/${encodeUriComponent(filename)}` },
    securityUrl       (identifier, operation){ return `/api/v2013/documents/${encodeUriComponent(identifier)}/securities/${encodeUriComponent(operation)}` },
    draftSecurityUrl  (identifier, operation){ return `/api/v2013/documents/${encodeUriComponent(identifier)}/versions/draft/securities/${encodeUriComponent(operation)}` },
    draftLockUrl      (identifier, lockID){ return `/api/v2013/documents/${encodeUriComponent(identifier)}/versions/draft/locks/${encodeUriComponent(lockID)}` },
    documentVersionUrl(identifier){ return `/api/v2013/documents/${encodeUriComponent(identifier)}/versions` },
  }
  documents = {
    async query(params){
        return this.$axios.get(this.serviceUrl.documentQueryUrl(), { params })
                  .then(res => res.data)
                  .catch(tryCastToApiError);
    },
    async get(identifier, params){
      return this.$axios.get(this.serviceUrl.documentUrl(identifier), params)
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async exists(identifier,params){
      return this.$axios.head(this.serviceUrl.documentUrl(identifier), { params })
                .then(res => true)
                .catch(tryCastToApiError);//throw only if code != 404
    },
    async put(identifier, data, params){
      return this.$axios.put(this.serviceUrl.documentUrl(identifier), data, { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async delete(identifier, params){
      return this.$axios.delete(this.serviceUrl.documentUrl(identifier), { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async validate(data, params){
      return this.$axios.put(this.serviceUrl.validateUrl(), data, { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async canCreate(identifier, params){
      return this.$axios.get(this.serviceUrl.securityUrl(identifier, 'create'), params)
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async canUpdate(identifier, params){
      return this.$axios.get(this.serviceUrl.securityUrl(identifier, 'update'), params)
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async canDelete(identifier, params){
      return this.$axios.get(this.serviceUrl.securityUrl(identifier, 'delete'), params)
                .then(res => res.data?.isAllowed)
                .catch(tryCastToApiError);
    },
  }
  drafts = {
    async query(params){
        params.collection = "mydraft";
        return this.$axios.get(this.serviceUrl.documentDraftQueryUrl(), { params })
                  .then(res => res.data)
                  .catch(tryCastToApiError);
    },
    async get(identifier, params){
      return this.$axios.get(this.serviceUrl.draftUrl(identifier), params)
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async exists(identifier,params){
      return this.$axios.head(this.serviceUrl.draftUrl(identifier), { params })
                .then(res => true)
                .catch(tryCastToApiError);//throw only if code != 404
    },
    async put(identifier, data, params){
      return this.$axios.put(this.serviceUrl.draftUrl(identifier), data, { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async delete(identifier, params){
      return this.$axios.delete(this.serviceUrl.draftUrl(identifier), { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async validate(data, params){
      return this.$axios.put(this.serviceUrl.validateUrl(), data, { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async canCreate(identifier, params){
      return this.$axios.get(this.serviceUrl.draftSecurityUrl(identifier, 'create'), params)
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async canUpdate(identifier, params){
      return this.$axios.get(this.serviceUrl.draftSecurityUrl(identifier, 'update'), params)
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async canDelete(identifier, params){
      return this.$axios.get(this.serviceUrl.draftSecurityUrl(identifier, 'delete'), params)
                .then(res => res.data?.isAllowed)
                .catch(tryCastToApiError);
    },
  }
  locks = {
    async get(identifier, params){
      return this.$axios.get(this.serviceUrl.draftLockUrl(identifier), params)
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async exists(identifier,params){
      return this.$axios.head(this.serviceUrl.draftLockUrl(identifier), { params })
                .then(res => true)
                .catch(tryCastToApiError);//throw only if code != 404
    },
    async put(identifier, data, params){
      return this.$axios.put(this.serviceUrl.draftLockUrl(identifier), data, { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    },
    async delete(identifier, params){
      return this.$axios.delete(this.serviceUrl.draftLockUrl(identifier), { params })
                .then(res => res.data)
                .catch(tryCastToApiError);
    }
  }

  attachments = {
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
      },
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
    },
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

}