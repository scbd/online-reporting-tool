import {hash } from 'ohash'
type useFetchType = typeof useFetch

export default class ApiError extends Error {
    constructor({status, error, message})  {
        super(message, { cause : {...error, status} });

        this.status = status;
        this.error  = error;
    }
}


// wrap useFetch with configuration needed to talk to our API
export const useAPIFetch: useFetchType = async (path, options = {}) => {
    //TODO: find why useFetch is returning cache response even when 
    //      there is network call and for POST method
    const key   = hash({...options, requestedOn:new Date().getTime().toString()})
    options.key = key;//generate unique key to avoid caching
    options.cache = 'no-cache';
    
    const { data, error, execute, pending, refresh, status } = await useFetch(path, options)

    if(error?.value){
        throw new ApiError({
            status : error.value?.statusCode,
            error  : error.value?.data||error.value,
            message : `Error occurred executing ${options.method} request for url ${path}`
        })
    }

    return data.value;
}

// wrap useFetch with configuration needed to talk to our API
export const useAPIFetchWithCache: useFetchType = async (path, options = {}) => {

    const { data, error, execute, pending, refresh, status } = await useFetch(path, options)

    if(error?.value){
        throw new ApiError({
            status : error.value?.statusCode,
            error  : error.value?.data||error.value,
            message : `Error occurred executing ${options.method} request for url ${path}`
        })
    }

    return data.value;
}