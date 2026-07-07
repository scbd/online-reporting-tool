import { useRealmConfStore } from "@/stores/realmConf"

export default defineNuxtPlugin((nuxtApp)=>{
    
    // app:created runs on both server and client (app:beforeMount is
    // client-only); SSR routes need the realm conf loaded before render.
    // The loaded state transfers to the client via the Pinia payload,
    // so loadRealmConf is a no-op there when SSR already ran.
    nuxtApp.hook('app:created', async ()=>{

        const realmConfStore = useRealmConfStore();
        await realmConfStore.loadRealmConf();

    })
    
})

