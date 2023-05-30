<template>
    <!-- <iframe v-nce v-if="accountsHostUrl" id="authFrame" style="display:none;" ref="authFrame" :src="`${accountsHostUrl}/app/authorize.html`"/> -->
    <div>Hello</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex';

export default {
    name : 'AuthIframe',
    props: { url: { type: String } },
    data(){
        return {
            accountsHostUrl : 'https://accounts.cbddev.xyz',
            token: undefined
        }
    },
    async mounted(){
        console.log(this.$auth)
        const token = await this.$auth.loginWith('ScbdIframeAuthStrategy', { /* ... */ })
        //this.getIframeToken();
        console.log(token);
    },
    computed: {
        ...mapGetters({
            getToken : 'auth/getToken',
        })
    },
    methods:{
        ...mapActions({
            setToken     : 'auth/setToken',
        }),
        getIframeToken,
        getIframe,
        receivePostMessage,
        useIframe,
        isServer
    }
}

async function getIframeToken(){
      if(this.token) return this.token;

    if(!this.accountsHostUrl) throw new Error('no accountsHostUrl given to auth store state');

    this.iFrameEl = this.getIframe();
  
    return this.useIframe(this.iFrameEl);

}

function receivePostMessage(event){

    const { type, authenticationToken, authenticationEmail, expiration } = JSON.parse(event.data);

    if(type!=='authenticationToken') throw new Error('unsupported authentication message type');

    this.token = {
        token      : authenticationToken,
        email      : authenticationEmail,
        expiration : expiration
    };

    return this.token;
}

function getIframe(){

  if (isServer()) return undefined;

  const iFrames = window.document.getElementsByTagName('iframe');

  for (const anIframe of iFrames){
    const { origin } = new URL(anIframe.getAttribute('src'));

    if(this.accountsHostUrl === origin)
      return anIframe;
  }
}

function useIframe($el){
  if (isServer()) return;
    const self = this;
    window.addEventListener('message', this.receivePostMessage);

    $el.onload = () => {
        const { contentWindow } = $el;
        const   type            = 'getAuthenticationToken';
        const   msg             = JSON.stringify({ type });

        contentWindow.postMessage(msg, this.accountsHostUrl);

        return resolveToken(self);
    }
}

function resolveToken(self, ms = 300){
    return new Promise(function(resolve, reject) {
        const interval = setInterval(function() {
            if(self.token){
                resolve(self.token)
                clearInterval(interval)
            }
        }, ms);
    });
}

function isServer(){
    return false;
}
</script>
  