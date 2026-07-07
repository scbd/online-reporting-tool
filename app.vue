<template>
  <NuxtLayout>
      <NuxtLoadingIndicator color="rgb(96 165 250)" />
      <NuxtPage/>
  </NuxtLayout>
</template>
<script lang="ts">
//@ts-nocheck
import { SocketIOService } from '@/services/socket-io';
import '@/utils/prototypes.js';


export default defineComponent({
    
    setup(props, context) { 
        const ctx = useNuxtApp();
        const config = useRuntimeConfig();

        // websocket is a browser concern; connecting during SSR would open
        // one server-to-API socket per rendered request
        if(import.meta.client){
            const auth = useAuth()
            let   socketIoUrl = config.public.socketIo.url

            if(/^\//.test(socketIoUrl))
                socketIoUrl = config.public.API_URL + socketIoUrl;

            SocketIOService.connect(socketIoUrl, auth?.token)
        }


        return {}
    },
    unmounted(){
        SocketIOService.disconnect();
    }, 
});

</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'styles/style';
</style>