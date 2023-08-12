import { defineStore } from 'pinia'
import { uniq } from 'lodash';

export const useUserPreferencesStore = defineStore('userPreferences', {
    state: () => {
        return {
            preferredEditLanguages  : [],
            preferredEditGovernment : '',
            editorActiveLanguageTab : ''
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
    },
    persist: {
        storage: persistedState.localStorage,
    }
})