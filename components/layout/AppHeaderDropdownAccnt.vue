<template>
  <CDropdown variant="nav-item"  v-if="user && user.isAuthenticated">
    <CDropdownToggle placement="bottom-end" class="py-0"  :caret="true">
      {{ user.name }}
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
        <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
            {{t('settings')}}
        </CDropdownHeader>
        <KmNavLink :to="`${accountsUrl}/profile?returnUrl=${returnUrl}`" :title="t('profile')" icon="cil-user"></KmNavLink>
        <KmNavLink to="/users/setting" :title="t('settings')" icon="cil-settings"></KmNavLink>
        <KmNavLink to="/users/email-alerts" :title="t('emailAlerts')" icon="fa-envelope"></KmNavLink>
        <CDropdownDivider />              
        <KmNavLink @click="logout()" :to="returnUrl" title="Logout" icon="cil-lock-locked"></KmNavLink>
    </CDropdownMenu>
  </CDropdown>
  <a v-if="!user || !user.isAuthenticated" :href="`${accountsUrl}?returnUrl=${returnUrl}`">{{t('signIn')}}</a>


  <CModal  class="show d-block" size="sm" alignment="center" backdrop="static" @close="() => {showSessionExpiredDialog=false}" :visible="showSessionExpiredDialog" >
      <CModalHeader :close-button="false">
          <CModalTitle>
              {{t('sessionExpiredTitle')}}
          </CModalTitle>
      </CModalHeader>
      <CModalBody>
          <CAlert color="success" class="d-flex">
            {{t('sessionExpiredDescription')}} 
          </CAlert>
      </CModalBody>
      <CModalFooter>
          <CButton @click="onSessionExpiredDialogClose()" color="secondary">{{t('signIn')}}</CButton>
      </CModalFooter>
  </CModal>
</template>
<i18n src="@/i18n/dist/components/layout/AppHeaderDropdownAccnt.json"></i18n>
<script lang="ts" setup>
//@ts-nocheck

import { useRoute } from 'vue-router';
    
    const { t }         = useI18n();
    const route         = useRoute();
    const { $eventBus } = useNuxtApp();
    const user          = useAuth().user;
    const itemsCount    = 42;
    const accountsUrl   = useRuntimeConfig().public.ACCOUNTS_HOST_URL;
    
    const showSessionExpiredDialog = ref(false);

    const logout = async ()=>{
      await authLogout()
      window.location.reload()
    }

    const returnUrl = computed(()=>{
        const url = new URL(window.location.href);
        url.path = route.path;
        return url.href;
    })

    function onSessionExpired(){     
      showSessionExpiredDialog.value = true;
    }

    function onSessionExpiredDialogClose(){
      showSessionExpiredDialog.value = false;
      logout();
    }

    onMounted(()=>{
        $eventBus.on('evt:session-expired', onSessionExpired);
    })

    onBeforeUnmount(()=>{
        $eventBus.off('evt:session-expired', onSessionExpired);
    })

</script>
