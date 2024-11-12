import { defineStore } from 'pinia'

export const useAppStateStore = defineStore('appState', {
    state: () => {
        return {
            showBackupSpinner : false as Boolean
        }
    },
    getters:{
        
    },
    actions:{
        setBackupSpinner(show:Boolean):void{
            this.showBackupSpinner = show;
        },
    },
    persist: {
        storage: persistedState.localStorage,
        afterRestore: (ctx:any) => {
            ctx.store.showBackupSpinner = false;
        }
    }
})
