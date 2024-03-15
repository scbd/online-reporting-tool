
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.debug(error, instance, info)
        useLogger().error({stack : error, message : info}, undefined)     
    }

    nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) =>{
        //   ![
        //     'built-in or reserved HTML elements as component id: component',
        //   ].some((warning) => msg.includes(warning)) &&
        //   console.warn('[Vue warn]: '.concat(msg).concat(trace))
    }

  })