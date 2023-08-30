<template>
  <NuxtLayout>
      <NuxtLoadingIndicator color="rgb(96 165 250)" />
      <NuxtPage/>
  </NuxtLayout>
</template>
<script lang="ts">
import { SocketIOService } from '@/services/socket-io';

export default defineComponent({
    
    setup(props, context) { 
        const ctx = useNuxtApp();
        const config = useRuntimeConfig();

        const auth = useAuth()
        const socket = SocketIOService.connect(config.public.socketIo.url, auth?.token)


        return {}
    },
    unmounted(){
        console.log('app unmounted')
        SocketIOService.disconnect();
    }, 
});

</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'styles/style';
</style>