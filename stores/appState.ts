import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', {
    state: () => {
        return {
            showBackupSpinner : false
        }
    },
    getters:{
        
    },
    actions:{
        setBackupSpinner(show:Boolean){
            this.showBackupSpinner = show;
        },
    },
    persist: {
        storage: persistedState.localStorage,
        afterRestore: (ctx) => {
            ctx.store.showBackupSpinner = false;
        }
    }
})
