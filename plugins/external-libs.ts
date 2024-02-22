// import * as bootstrap from 'bootstrap'

import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import mitt from 'mitt'
    
export default defineNuxtPlugin((nuxtApp) => {
    
    nuxtApp.vueApp.use(ToastPlugin, {
        position: 'top-right'
    });
    
    const eventBus = mitt();

    return {
        provide: {
        //     bootstrap: bootstrap
            eventBus
        }
    }
})