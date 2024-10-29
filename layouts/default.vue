<template>
    <div>   
        <AppSidebar v-if="!query?.embed" />
        <div class="wrapper d-flex flex-column" :class="{'min-vh-100' : !query?.embed}">
            <AppHeader  v-if="!query?.embed" />
            <div class="body flex-grow-1 px-3" id="page-content-wrapper">
                <CContainer fluid>
                <router-view />
                <slot name="error"></slot>
                </CContainer>
            </div>
            <AppFooter class="m-0 p-0" v-if="!query?.embed" />      
            <div id="g-recaptcha"></div>
        </div>
        <resize-event></resize-event>
    </div>
</template>
<i18n src="@/i18n/dist/layouts/default.json"></i18n>
<script setup lang="ts">
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import {useRoute} from 'vue-router';

    const head = useLocaleHead({
      addDirAttribute: true,      // Adds dir
      addSeoAttributes: true,     // Adds lang
    })
    const { locale, t } = useI18n();
    const config = useRuntimeConfig();
    const { query }  = useRoute();
    
    //Enable google tracking in production only
    if(config?.public?.ACCOUNTS_HOST_URL.indexOf('accounts.cbd.int')>=0){
        const { gtag, grantConsent, revokeConsent } = useGtag()
        grantConsent(config.public.gtag.id)
    }

    useHead({
        htmlAttrs: {
            lang : ()=>locale.value,
            dir  : ()=>locale.value === 'ar' ? 'rtl' : 'ltr',

        },
        bodyAttrs:{
            class:()=>query?.embed == 'true' ? 'embed' : ''
        },
        titleTemplate: (titleChunk)=>(titleChunk ? `${titleChunk} - ` : '') + t('title'),
        script:[
            {
                hid: 'slaask',
                src : 'https://cdn.slaask.com/chat.js',
                defer: true, 
                onload: () => { 
                    if(!query?.embed)
                        initializeSlaask();
                }
            },
            {
                hid: 'recaptcha',
                src : 'https://www.recaptcha.net/recaptcha/api.js',
                defer: true,
                callback: () => { }
            }
        ]
    });

    useSeoMeta({
        description: t('description')
    })

    async function initializeSlaask(counter=1){

        await sleep(500)
        const { user } = useAuth();
        if(window._slaask){
            if (user?.value?.isAuthenticated && window. _slaask) {
                window._slaask.identify(user.name, {
                    'user-id': user.value.userID,
                    'name'   : user.value.name,
                    'email'  : user.value.email,
                });

                if (window._slaask.initialized) {
                    if (window._slaask.slaaskSendUserInfos)
                    window._slaask.slaaskSendUserInfos();
                }
            }

            if (window._slaask && !window._slaask.initialized) {
                window._slaask.init('ae83e21f01860758210a799872e12ac4');
            }
        }
        else{
            if(counter < 10)
                setTimeout(()=>initializeSlaask(counter+1), 500)
        }
    }

        
</script>
<style scoped>

/* Since its not required on all pages, hide it and show only when required */
#g-recaptcha{
    display: none;
}

</style>