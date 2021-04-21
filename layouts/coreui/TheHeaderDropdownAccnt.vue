<template>
  <CDropdown
    in-nav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar bg-white">
          <!-- <img src="/img/avatars/6.jpg" class="c-avatar-img" alt="User Icon"> -->
          <font-awesome-icon icon="user" size="lg" class="text-dark" />
        </div>
      </CHeaderNavLink>
    </template>
    <!-- <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-bell"/> Updates
      <CBadge color="info" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-envelope-open" /> Messages
      <CBadge color="success" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tasks
      <CBadge color="danger" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-comment-square" /> Comments
      <CBadge color="warning" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem> -->
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>{{ displayUsername }}</strong>
    </CDropdownHeader>
    <CDropdownItem to="/profiles">
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem to="/profiles/settings">
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem to="/profiles/kubeconfig">
      <CIcon name="cil-screen-desktop" /> CLI Command
      <!-- <CBadge color="secondary" class="ml-auto">{{ itemsCount }}</CBadge> -->
    </CDropdownItem>
    <!-- <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="ml-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem>
      <CIcon name="cil-shield-alt" /> Lock Account
    </CDropdownItem> -->
    <CDropdownItem @click="logout()">
      <CIcon name="cil-lock-locked" /> Logout
      <form ref="logoutForm" action="/api/logout" method="post">
        <input type="hidden" name="_csrf" :value="token">
      </form>
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import cookie from 'cookie'
import { profile } from '~/mixins'

export default {
  name: 'TheHeaderDropdownAccnt',
  mixins: [profile],
  data () {
    return {
      cookie
    }
  },
  computed: {
    displayUsername () {
      const { firstName, lastName, username } = this.user || {}
      const arr = this._.compact([firstName, lastName, `(${username})`])
      return arr.join(' ')
    },
    token () {
      const { 'XSRF-TOKEN': xsrf } = cookie.parse(document.cookie)
      return xsrf
    }
  },
  methods: {
    logout () {
      this.$refs.logoutForm.submit()
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>
