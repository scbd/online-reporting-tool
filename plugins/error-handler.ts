//@ts-nocheck

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.debug(error, instance, info)
        useLogger().error({stack : error, message : info}, undefined)     
    }
    // Also possible
    nuxtApp.hook('vue:error', (error, instance, info) => {
      // handle error, e.g. report to a service

      console.log(error, instance, info)
    })
    // nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    //     console.warn(msg, instance, trace)
    //     useLogger().warn({message : msg, trace : trace}, undefined)
    // }
    // nuxtApp.vueApp.config.globalProperties.$errorHandler = (error, instance, info) => {
    //     console.error(error, instance, info)
    //     useLogger().error({stack : error, message : info}, undefined)
    // }
    // nuxtApp.vueApp.config.globalProperties.$warnHandler = (msg, instance, trace) => {
    //     console.warn(msg, instance, trace)
    //     useLogger().warn({message : msg, trace : trace}, undefined)
    // }
    // nuxtApp.vueApp.config.globalProperties.$logHandler = (msg, instance, trace) => {
    //     console.log(msg, instance, trace)
    //     useLogger().log({message : msg, trace : trace}, undefined)
    // }
    // nuxtApp.vueApp.config.globalProperties.$infoHandler = (msg, instance, trace) => {
    //     console 
  })