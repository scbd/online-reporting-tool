
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.debug(error, instance, info)
        useLogger().error({stack : error, message : info}, undefined)     
    }

  })