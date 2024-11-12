export interface TempSlotBody{
    contentType :string,
    filename    :string
}

export interface S3FileMetadata {
    filename:       string;
    "content-type": string;
    user:           string;
}

export interface TempSlotResponse{
    url:         string;
    uid:         string;
    contentType: string;
    metadata:    S3FileMetadata;
}

export interface TempFileUploadOptions{
    timeout : number,
    onUploadProgress: Function, 
    onDownloadProgress: Function
}