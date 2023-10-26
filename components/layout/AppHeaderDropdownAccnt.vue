<template>
  <CDropdown variant="nav-item"  v-if="user && user.isAuthenticated">
    <CDropdownToggle placement="bottom-end" class="py-0"  :caret="true">
      {{ user.name }}
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
        <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
            Settings
        </CDropdownHeader>
        <KmNavLink :to="`${accountsUrl}/profile`" title="Profile" icon="cil-user"></KmNavLink>
        <KmNavLink to="/settings" title="Settings" icon="cil-settings"></KmNavLink>
        <CDropdownDivider />      
        <KmNavLink @click="logout()" :to="returnUrl" title="Logout" icon="cil-lock-locked"></KmNavLink>
    </CDropdownMenu>
  </CDropdown>
  <a v-if="!user || !user.isAuthenticated" :href="`${accountsUrl}?returnUrl=${returnUrl}`">Sign in</a>
</template>

<script>
export default {
  name: 'AppHeaderDropdownAccnt',
  setup() {

    const logout = async ()=>{
      await authLogout()
      window.location.reload()
    }
    
    return {
      user       : useAuth().user,
      itemsCount : 42,
      accountsUrl: useRuntimeConfig().public.ACCOUNTS_HOST_URL,
      returnUrl  : window.location.href,
      logout
    }
  },
}
</script>
