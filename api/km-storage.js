
import ApiBase, { tryCastToApiError } from './api-base';

const serviceUrls = {
  documentQueryUrl      () { return '/api/v2013/documents/'; },
  documentUrl           (identifier) { return `/api/v2013/documents/${encodeURIComponent(identifier)}`; },
  validateUrl           () { return '/api/v2013/documents/x/validate'; },
  draftUrl              (identifier) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft`; },
  attachmentUrl         (identifier, filename) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/attachments/${encodeURIComponent(filename)}`; },
  temporaryAttachmentUrl () { return '/api/v2015/temporary-files'; },
  persistAttachmentUrl  (identifier, guid) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/attachments/persist-temporary/${encodeURIComponent(guid)}`; },
  securityUrl           (identifier, operation) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/securities/${encodeURIComponent(operation)}`; },
  draftSecurityUrl      (identifier, operation) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft/securities/${encodeURIComponent(operation)}`; },
  draftLockUrl          (identifier, lockID) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions/draft/locks/${encodeURIComponent(lockID)}`; },
  documentVersionUrl    (identifier) { return `/api/v2013/documents/${encodeURIComponent(identifier)}/versions`; }
};
export default class KmStorageApi extends ApiBase {
  constructor (options) {
    super(options);

    this.documents = new KmDocumentsApi(options);
    this.drafts = new KmDraftsApi(options);
    this.locks = new KmLocksApi(options);
    this.attachments = new KmAttachmentsApi(options);
  }
}

class KmDocumentsApi extends ApiBase {
  constructor (options) {
    super(options);
    this.self = this;
  }

  async query (params) {
    const data = await useAPIFetch(serviceUrls.documentQueryUrl(), { method: 'get', params });

    return data;
  }

  async get (identifier, params) {
    const data = await useAPIFetch(serviceUrls.documentUrl(identifier), { method: 'get', params });

    return data;
  }

  async exists (identifier, params) {
    const data = await useAPIFetch(serviceUrls.documentUrl(identifier), { method: 'head', params });

    return data;
  }

  async put (identifier, body, params) {
    const data = await useAPIFetch(serviceUrls.documentUrl(identifier), { method: 'put', body, params });

    return data;
  }

  async delete (identifier, params) {
    const data = await useAPIFetch(serviceUrls.documentUrl(identifier), { method: 'delete', params });

    return data;
  }

  async validate (body, params) {
    params = params || {};

    if (!params?.schema && body?.header?.schema) { params.schema = body.header.schema; }

    params.identifier = body.header.identifier;

    const data = await useAPIFetch(serviceUrls.validateUrl(), { body, method: 'put', body, params });

    return data;
  }

  async canCreate (identifier, params) {
    const data = await useAPIFetch(serviceUrls.securityUrl(identifier, 'create'), { method: 'get', params });

    return data;
  }

  async canUpdate (identifier, params) {
    const data = await useAPIFetch(serviceUrls.securityUrl(identifier, 'update'), { method: 'get', params });

    return data;
  }

  async canDelete (identifier, params) {
    const data = await useAPIFetch(serviceUrls.securityUrl(identifier, 'delete'), { method: 'get', params });

    return data;
  }
}
class KmDraftsApi extends ApiBase {
  constructor (options) {
    super(options);
  }

  async query (params) {
    params.collection = 'mydraft';
    const data = await useAPIFetch(serviceUrls.documentQueryUrl(), { method: 'get', params });

    if (data?.Items?.length) {
      data.Items = data.Items.map(e => {
        if (e.workingDocumentBody) {
          e.body = e.workingDocumentBody;
        }
        return e;
      });
    }

    return data;
  }

  async get (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftUrl(identifier), { method: 'get', params });

    if (data.workingDocumentBody) {
      data.body = data.workingDocumentBody;
    }

    return data;
  }

  async exists (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftUrl(identifier), { method: 'head', params });

    return data;
  }

  async put (identifier, body, params) {
    const data = await useAPIFetch(serviceUrls.draftUrl(identifier), { body, method: 'put', params });
    return data;
  }

  async delete (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftUrl(identifier), { method: 'delete', params });

    return data;
  }

  async canCreate (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'create'), { method: 'get', params });

    return data;
  }

  async canUpdate (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'update'), { method: 'get', params });

    return data;
  }

  async canDelete (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftSecurityUrl(identifier, 'delete'), { method: 'get', params });

    return data;
  }
}
class KmLocksApi extends ApiBase {
  constructor (options) {
    super(options);
  }

  async get (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftLockUrl(identifier), { method: 'get', params });

    return data;
  }

  async exists (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftLockUrl(identifier), { method: 'head', params });

    return data;
  }

  async put (identifier, body, params) {
    const data = await useAPIFetch(serviceUrls.draftLockUrl(identifier), { body, method: 'put', body, params });

    return data;
  }

  async delete (identifier, params) {
    const data = await useAPIFetch(serviceUrls.draftLockUrl(identifier), { method: 'delete', params });

    return data;
  }
}
class KmAttachmentsApi extends ApiBase {
  constructor (options) {
    super(options);
  }

  async uploadTempFile (identifier, file, fileName, options) {
    const { timeout, onUploadProgress, onDownloadProgress } = { ...(options || {}) };

    const apiConfig = {
      headers: {},
      timeout: timeout || 60 * 60 * 1000,
      onUploadProgress,
      onDownloadProgress
    };

    const tempSlotBody = {
      filename: fileName
    };

    // find the content type and validate with whitelist
    if (file instanceof FormData) {
      const tempFile = formData.get('file');
      if (tempFile) {
        tempSlotBody.contentType = this.getMimeType(file);
      }
    } else if (file instanceof File) {
      tempSlotBody.contentType = this.getMimeType(file);
    } else {
      throw new Error('Unable to read file information.');
    }

    if (this.mimeTypeWhitelist().indexOf(tempSlotBody.contentType) < 0) {
      throw new Error('File type not supported: ' + mimeType + '(' + file.name + ')');
    }

    const key = S4();
    // get a temporary slot from S3 to upload the file
    const temporarySlot = await useAPIFetch(serviceUrls.temporaryAttachmentUrl(), { key, method: 'POST', body: tempSlotBody });

    // upload the file to the temporary slot on S3
    apiConfig.headers['Content-Type'] = temporarySlot.contentType;
    apiConfig.headers.Authorization = undefined;
    const temporaryAttachment = await useAPIFetch(temporarySlot.url, { key, method: 'PUT', body: file, ...apiConfig });

    // persists the file using the KM persists attachments endpoint
    const persistedAttachment = await useAPIFetch(serviceUrls.persistAttachmentUrl(identifier, temporarySlot.uid), { key, method: 'POST', body: { fileName } });

    const config = useRuntimeConfig();
    return {
      ...persistedAttachment,
      url: config.public.API_URL + persistedAttachment.url
    };
  }

  async upload (identifier, file, params) {
    params = params || {};
    params.identifier = identifier;
    params.filename = file.name;

    const contentType = params.contentType || this.getMimeType(file);

    // params.contentType = undefined;
    params.headers = params.header || {};
    params.headers['Content-Type'] = contentType;

    /// /TEMP////////////////
    // upload to temp url
    const data = await useAPIFetch(serviceUrls.attachmentUrl(identifier, file.name), { method: 'put', body: file, params });

    const config = useRuntimeConfig();
    data.url = config.public.API_URL + data.url;
    data.urls = { // required by ckeditor
      default: data.url
    };

    return data;
    /// ////TEMP////////////////

    // TODO : use s3
    // 1 request for temp file from s3
    // upload file
    // return s3 location
    // persist temp file location in api
  }

  getMimeType (file) {
    const filename = file.name;
    const sMimeType = file.type || 'application/octet-stream';

    if (filename && sMimeType == 'application/octet-stream') {
      let sExt = '';
      const iIndex = filename.lastIndexOf('.');

      if (iIndex >= 0) { sExt = filename.substring(iIndex).toLowerCase(); }

      if (sExt == '.json') sMimeType = 'application/json';
      if (sExt == '.geojson') sMimeType = 'application/json';
      if (sExt == '.xml') sMimeType = 'application/xml';
    }

    return sMimeType;
  }

  mimeTypeWhitelist () {
    return [
      'application/json', 'application/ogg', 'application/pdf', 'application/xml', 'application/zip',
      'application/x-zip', 'application/x-zip-compressed', 'audio/mpeg', 'audio/x-ms-wma', 'audio/x-wav',
      'image/gif', 'image/jpeg', 'image/png', 'image/bmp',
      'image/tiff',
      'text/csv', 'text/html', 'text/plain', 'text/xml', 'video/mpeg', 'video/mp4', 'video/quicktime',
      'video/x-ms-wmv', 'video/x-msvideo', 'video/x-flv', 'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet', 'application/vnd.oasis.opendocument.presentation', 'application/vnd.oasis.opendocument.graphics',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  }
}
