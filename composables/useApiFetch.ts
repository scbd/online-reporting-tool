type useFetchType = typeof useFetch

// wrap useFetch with configuration needed to talk to our API
export const useAPIFetch: useFetchType = async (path, options = {}) => {

    const { data, error, execute, pending, refresh, status } = await useFetch(path, options)

    const newError = ref(null);

    if(error?.value){
        newError.value = {
            ...(error.value?.data||error.value),
            statusCode : error.value?.statusCode
        }
    }
    return {
        data, execute, pending, refresh, status,
        error : newError
    }
}