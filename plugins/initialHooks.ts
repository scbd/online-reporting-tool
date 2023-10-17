import { useRealmConfStore } from "@/stores/realmConf"

export default defineNuxtPlugin((nuxtApp)=>{
    nuxtApp.hook('app:beforeMount', async ()=>{
        
        const realmConfStore = useRealmConfStore();
        await realmConfStore.loadRealmConf();

    })

    useNuxtApp().hook("page:finish", () => {
        if (history.state.scroll) {
          setTimeout(() => window.scrollTo(history.state.scroll), 0);
        } else {
          setTimeout(() => window.scrollTo(0, 0), 0);
        }
    });
})

