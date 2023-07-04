import { useRealmConfStore } from "~/stores/realmConf"

export default defineNuxtPlugin((nuxtApp)=>{
    nuxtApp.hook('app:beforeMount', async ()=>{
        
        const realmConfStore = useRealmConfStore();
        await realmConfStore.loadRealmConf();

    })
})

