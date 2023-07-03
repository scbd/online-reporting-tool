import { useRealmConfStore } from "~/stores/realmConf"

export default defineNuxtPlugin((nuxtApp)=>{
    nuxtApp.hook('app:beforeMount', async ()=>{
        console.info('starting store initialize plugin')
        
        const realmConfStore = useRealmConfStore();
        await realmConfStore.loadRealmConf();

        console.info('Finish store initialize plugin')

    })
})

