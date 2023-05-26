<template>
  <CDropdown
    in-nav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div>Blaise Fonseca</div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-bell" /> Updates
      <CBadge color="info" class="ml-auto">
        {{ itemsCount }}
      </CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Requests
      <CBadge color="danger" class="ml-auto">
        {{ itemsCount }}
      </CBadge>
    </CDropdownItem>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem> <CIcon name="cil-user" /> Profile </CDropdownItem>
    <CDropdownItem> <CIcon name="cil-settings" /> Settings </CDropdownItem>
    <CDropdownDivider />

    <CDropdownItem> <CIcon name="cil-lock-locked" /> Logout </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return {
      itemsCount: 42
    }
  }
}
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
</style>
