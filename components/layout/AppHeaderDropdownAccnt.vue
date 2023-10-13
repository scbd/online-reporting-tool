<template>
  <CDropdown variant="nav-item"  v-if="user && user.isAuthenticated">
    <CDropdownToggle placement="bottom-end" class="py-0"  :caret="true">
      {{ user.name }}
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem>
        <CIcon icon="cil-bell" /> Updates
        <CBadge color="info" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>
      <CDropdownItem>
        <CIcon icon="cil-envelope-open" /> Messages
        <CBadge color="success" class="ms-auto">{{ itemsCount }}</CBadge>
      </CDropdownItem>      
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Settings
      </CDropdownHeader>
        <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
        <CDropdownItem> <CIcon icon="cil-settings" /> Settings </CDropdownItem>      
      <CDropdownDivider />      
      <CDropdownItem @click="logout()"> <CIcon icon="cil-lock-locked" /> Logout </CDropdownItem>
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
