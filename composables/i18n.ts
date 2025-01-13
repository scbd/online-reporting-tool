export const useLocalI18n = ({messages, useScope})=>{
    const { t } = useI18n({
        // fallbackLocale:'en',fallbackRoot:false,
        useScope: useScope || 'local', 
        messages
    })

    return {  t }
}