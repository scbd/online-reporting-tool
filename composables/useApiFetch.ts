//@ts-nocheck
import {hash } from 'ohash'
type useFetchType = typeof useFetch
import type { UseFetchOptions } from 'nuxt/app'

export default class ApiError extends Error {
    constructor({status, error, message})  {
        super(message, { cause : {...error, status} });

        this.status = status;
        this.error  = error;
    }
}


// wrap useFetch with configuration needed to talk to our API
// export const useAPIFetch: useFetchType = async <T>(path: string | (() => string), options:UseFetchOptions<T> = {}):Promise<T> => {
export async function useAPIFetch<T>(path: string | (() => string), options:UseFetchOptions<T> = {}):Promise<T> {
    //TODO: find why useFetch is returning cache response even when 
    //      there is network call and for POST method
    // const key   = hash({...options, path, requestedOn:new Date().getTime().toString()})
    // options.key = key;//generate unique key to avoid caching
    options.cache = 'no-cache';
    options.baseURL = useRuntimeConfig().public.API_URL;
    console.log('useAPIFetch', path, options);
    const { data, error, execute, refresh, status } = await useFetch(path, options)
// console.log('useAPIFetch response', {data, error, status});
    if(error?.value){
        if(error.value?.statusCode === 401){
            const { $eventBus } = useNuxtApp();
            $eventBus.emit('evt:session-expired');
        }
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