<template>
  <CDropdown variant="nav-item"  v-if="user && user.isAuthenticated">
    <CDropdownToggle placement="bottom-end" class="py-0"  :caret="true">
      {{ user.name }}
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
        <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
          
            {{t('settings')}}
        </CDropdownHeader>
        <KmNavLink :to="`${accountsUrl}/profile?returnUrl=${returnUrl}`" title="Profile" icon="cil-user"></KmNavLink>
        <KmNavLink to="/users/setting" title="Settings" icon="cil-settings"></KmNavLink>
        <CDropdownDivider />      
        <KmNavLink @click="logout()" :to="returnUrl" title="Logout" icon="cil-lock-locked"></KmNavLink>
    </CDropdownMenu>
  </CDropdown>
  <a v-if="!user || !user.isAuthenticated" :href="`${accountsUrl}?returnUrl=${returnUrl}`">
  <!-- {{t('signIn')}} -->
  </a>
</template>
<i18n src="@/i18n/dist/components/layout/AppHeaderDropdownAccnt.json"></i18n>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRoute } from 'vue-router';
// export default {
//   name: 'AppHeaderDropdownAccnt',
//   setup() {
    const { t } = useI18n();
    const route = useRoute();
    const user  = useAuth()?.user;
    const accountsUrl = useRuntimeConfig().public.ACCOUNTS_HOST_URL;

    const logout = async ()=>{
      await authLogout()
      window?.location?.reload()
    }

    const returnUrl = computed(()=>{
      if(!window?.location?.href)
        return '/';
      
        const url = new URL(window.location.href);
        url.path = route.path;
        return url.href;
     })

//     return {
//         t,
//       user       : useAuth().user,
//       itemsCount : 42,
//       accountsUrl: useRuntimeConfig().public.ACCOUNTS_HOST_URL,
//       returnUrl,
//       logout
//     }
//   },
// }
</script>
