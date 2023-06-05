// plugins/i18n.js
import Vue from 'vue';


export default ({ app }) => {


    const install = (pluginApp, options) => {
    
        Vue.prototype.$loadLocaleFile = async (locale, filePath) => {

            let enMessages      = (await import(`~/i18n/en/${filePath}`)).default;
            let localeMessages  = {};

            try{
                localeMessages = (await import(`~/i18n/${locale}/${filePath}`)).default;
            }
            catch(e){
                console.debug(e);
            }

            const messages      = {...enMessages,  ...localeMessages, };

            app?.i18n?.mergeLocaleMessage(app?.i18n?.locale, messages);        
            
            return messages;
        }    
    }

    const i18nScbd = {
        install
    };

    Vue.use(i18nScbd)
}