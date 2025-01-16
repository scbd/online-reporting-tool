//@ts-nocheck
import { defineStore } from 'pinia'
import { uniq } from 'lodash';

export const useUserPreferencesStore = defineStore('userPreferences', {
    state: () => {
        return {
            preferredEditLanguages  : [],
            preferredEditGovernment : '',
            editorActiveLanguageTab : '',
            sidebarVisible          : true,
            sidebarUnfoldable       : true
        }
    },
    getters:{
        
    },
    actions:{
        setPreferredEditLanguages(languages:Array<String>){
            this.preferredEditLanguages = uniq(languages||[]);
        },
        setPreferredEditGovernment(government:String){
            this.preferredEditGovernment = government;
        },
        setEditorActiveLanguageTab(lang:String){
            this.editorActiveLanguageTab = lang;
        },
        setSidebarVisible(visible:boolean){
            this.sidebarVisible = visible !== undefined ? visible : !this.sidebarVisible;
        },
        setSidebarUnfoldable(){
            this.sidebarUnfoldable = !this.sidebarUnfoldable;
        },
    },
    persist: {
        storage: persistedState.localStorage,
        afterRestore: (ctx) => {
            ctx.store.sidebarUnfoldable = false;// always keep th sidebar open
            ctx.store.sidebarVisible = true;// always keep th sidebar open
        }
    }
})
