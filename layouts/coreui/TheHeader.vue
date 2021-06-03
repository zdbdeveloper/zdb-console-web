<template>
  <CHeader with-subheader>
    <CToggler
      in-header
      class="d-lg-none"
      @click="$store.dispatch('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="d-md-down-none"
      @click="$store.dispatch('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      <!--<CIcon name="logo" height="48" alt="Logo"/>-->
      <img class="c-sidebar-brand-full" src="/img/brand/logo.png" width="138" height="25" alt="Cloud Z CP Logo">
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <CHeaderNavItem class="px-1">
        Container Management Service Platform @SK
      </CHeaderNavItem>
      <!--<CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem>-->
    </CHeaderNav>
    <CHeaderNav>
      <CHeaderNavItem class="px-3">
        <button
          class="c-header-nav-btn"
          @click="() => $store.dispatch('toggle', 'darkMode')"
        >
          <CIcon v-if="$store.state.darkMode" name="cil-sun" />
          <CIcon v-else name="cil-moon" />
        </button>
      </CHeaderNavItem>
      <TheHeaderDropdownTasks />
      <TheHeaderDropdownMssgs />
      <TheHeaderDropdownNotif />
      <TheHeaderDropdownAccnt />
      <CHeaderNavItem>
        <button
          in-header
          class="c-header-nav-btn"
          @click="$store.dispatch('toggle', 'asideShow')"
        >
          <CIcon size="lg" name="cil-applications-settings" class="mr-2" />
        </button>
      </CHeaderNavItem>
    </CHeaderNav>

    <CSubheader class="px-3">
      <div class="c-page-option">
        <h1
          v-if="lastItem"
          class="c-page-title"
        >
          <span v-text="$store.state.pageTitle || lastItem.label || lastItem.text" />
          <!--
          <CBadge color="danger" class="ml-1">
            1
          </CBadge>
          -->
        </h1>
        <!-- 필요한 메뉴에서 사용 -->
        <!-- <span class="verticel-line" />
        <v-select
          v-model="selectedCluster"
          class="vs__select-custom vs__select-custom-header"
          :options="['Mobile-App-Dev', 'Mobile-App-Prod']"
          placeholder="Cluster Select"
        />
        <v-select
          v-model="selectedNamespace"
          class="vs__select-custom"
          :options="['requiredDuringSchedulimglgnoredDuringExecution', 'preferredDuringSchedulimglgnoredDuringExecution']"
          placeholder="Namespace Select"
        /> -->
        <!-- // 필요한 메뉴에서 사용 -->
      </div>
      <!-- <CBreadcrumbRouter class="border-0 mb-0 pr-0" :items="items" /> -->
      <CBreadcrumb class="border-0 mb-0 pr-0" :items="items" />
    </CSubheader>
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import TheHeaderDropdownNotif from './TheHeaderDropdownNotif'
import TheHeaderDropdownTasks from './TheHeaderDropdownTasks'
import TheHeaderDropdownMssgs from './TheHeaderDropdownMssgs'
import { profile } from '~/mixins'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt,
    TheHeaderDropdownNotif,
    TheHeaderDropdownTasks,
    TheHeaderDropdownMssgs
  },
  mixins: [profile],
  computed: {
    items () {
      // const routes = this.$route.matched.filter((route) => {
      //   debugger
      //   return route.name || (route.meta && route.meta.label)
      // })
      // return routes.map((route) => {
      //   const meta = route.meta || {}
      //   return {
      //     to: route,
      //     text: meta.label || route.name
      //   }
      // })

      const CRUMBS = {
        'projects-id-apps': [
          { key: 'projects', to: `/projects/${this.project}/dashboard`, text: 'Home' },
          { key: 'projects-id-apps', to: `/projects/${this.project}/apps`, text: 'Applications' }
        ],
        'projects-id-apps-provisioning': [
          { key: 'projects', to: `/projects/${this.project}/dashboard`, text: 'Home' },
          { key: 'projects-id-apps', to: `/projects/${this.project}/apps`, text: 'Applications' },
          { key: 'projects-id-apps-provisioning', to: `/projects/${this.project}/apps/provisioning`, text: 'New Application' }
        ],
        'projects-id-apps-new': [
          { key: 'projects', to: `/projects/${this.project}/dashboard`, text: 'Home' },
          { key: 'projects-id-apps', to: `/projects/${this.project}/apps`, text: 'Applications' },
          { key: 'projects-id-apps-provisioning', to: `/projects/${this.project}/apps/provisioning`, text: 'New Application' },
          { key: 'projects-id-apps-new', to: `/projects/${this.project}/apps/new`, text: 'Git', label: 'New Application - Git' }
        ],
        'projects-id-apps-name': [
          { key: 'projects', to: `/projects/${this.project}/dashboard`, text: 'Home' },
          { key: 'projects-id-apps', to: `/projects/${this.project}/apps`, text: 'Applications' },
          { key: 'projects-id-apps-name', to: `/projects/${this.project}/apps/new`, text: 'Details', label: 'Cloud Movie' }
        ],
        //
        'projects-id-admin-groups': [
          { key: 'projects', to: `/projects/${this.project}/dashboard`, text: 'Home' },
          { key: 'projects-id-admin-groups', to: `/projects/${this.project}/admin/groups`, text: 'Administrator - Groups', label: 'Groups' }
        ],
        'projects-id-admin-groups-id': [
          { key: 'projects', to: `/projects/${this.project}/dashboard`, text: 'Home' },
          { key: 'projects-id-admin-groups', to: `/projects/${this.project}/admin/groups`, text: 'Administrator - Groups', label: 'Groups' },
          { key: 'projects-id-admin-groups-id', to: `/projects/${this.project}/admin/groups`, text: 'Details', label: 'Groups - test' }
        ]
      }

      // return CRUMBS[this.$route.name]

      const projects = `/projects/${this.project}`
      const systems = '/system'
      const PAGES = [
        { key: 'projects', to: `${projects}/dashboard`, text: 'Home', label: 'Dashboard' },
        //
        { key: 'projects-id-clusters', to: `${projects}/clusters`, text: 'Clusters' },
        { key: 'projects-id-clusters-name', text: 'Details', label: 'Clusters' },
        //
        { key: 'projects-id-apps', to: `${projects}/apps`, text: 'Applications' },
        { key: 'projects-id-apps-provisioning', to: `${this.projects}/apps/provisioning`, text: 'New Application' },
        { key: 'projects-id-apps-new', to: `${projects}/apps/new`, text: 'New Application', label: 'New Application - Git' },
        { key: 'projects-id-apps-name', text: 'Details', label: 'Applications' },
        //
        { key: 'projects-id-deploy', to: `${projects}/deploy`, text: 'Deployment Groups' },
        { key: 'projects-id-deploy-new', to: `${this.projects}/deploy/new`, text: 'New Deployment Group' },
        { key: 'projects-id-deploy-name', text: 'Details', label: 'Deployment Groups' },
        //
        { key: 'projects-id-admin-members', to: `${projects}/admin/members`, text: 'Administrator - Members', label: 'Members' },
        { key: 'projects-id-admin-groups', to: `${projects}/admin/groups`, text: 'Administrator - Groups', label: 'Groups' },
        { key: 'projects-id-admin-groups-id', text: 'Details', label: 'Groups' },
        { key: 'projects-id-admin-roles', to: `${projects}/admin/roles`, text: 'Administrator - Roles', label: 'Roles' },
        { key: 'projects-id-admin-roles-id', text: 'Details', label: 'Roles' },
        { key: 'projects-id-admin-settings', to: `${projects}/admin/settings`, text: 'Administrator - Settings', label: 'Project Settings' },
        //
        { key: 'projects-id-datastores', to: `${projects}/datastores`, text: 'Datastores' },
        { key: 'projects-id-datastores-name', text: 'Details', label: 'Datastores' },


        //
        //
        { key: 'system', to: `${systems}/dashboard`, text: 'Home', label: 'Dashboard' },
        //
        { key: 'system-clusters', to: `${systems}/clusters`, text: 'Clusters' },
        { key: 'system-clusters-attach', to: `${systems}/clusters/attach`, text: 'Attach Cluster' },
        { key: 'system-clusters-provisioning', to: `${systems}/clusters/provisioning`, text: 'New Cluster' },
        { key: 'system-clusters-new', to: `${systems}/clusters/new`, text: 'New Cluster', label: 'New Cluster - {cluster.provider}' },
        { key: 'system-clusters-name', text: 'Details', label: 'Clusters' },
        //
        { key: 'system-projects', to: `${systems}/projects`, text: 'Projects' },
        { key: 'system-projects-new', to: `${systems}/clusters/new`, text: 'New Project' },
        { key: 'system-projects-key', text: 'Details', label: 'Projects' },
        //
        { key: 'system-tools', to: `${systems}/tools`, text: 'Tools' },
        { key: 'system-tools-id', text: 'Details', label: 'Tools' },
        //
        { key: 'system-users', to: `${systems}/users`, text: 'Users' },
        { key: 'system-users-user', text: 'Details', label: 'Users' },
        //
        { key: 'system-groups', to: `${systems}/groups`, text: 'Groups' },
        { key: 'system-groups-id', text: 'Details', label: 'Groups' },
        //
        { key: 'system-roles', to: `${systems}/roles`, text: 'Roles' },
        { key: 'system-roles-id', text: 'Details', label: 'Roles' },
        //
        { key: 'system-realms', to: `${systems}/realms`, text: 'Platforms - Realms', label: 'Realms' },
        { key: 'system-realms-key', to: '', text: 'Details', label: 'Realms' },
        { key: 'system-menus', to: `${systems}/menus`, text: 'Platforms - Menus', label: 'Menus' },
        { key: 'system-preferences', to: `${systems}/preferences`, text: 'Platforms - Preferences', label: 'Preferences' },
        //
        { key: 'system-workloads', to: `${systems}/workloads`, text: 'Workloads' },
        { key: 'system-networking', to: `${systems}/networking`, text: 'Networking' },
        { key: 'system-storages', to: `${systems}/storages`, text: 'Storages' }
      ]

      // page error handling
      if (this.$route.name != null) {
        return this._.filter(PAGES, p => this.$route.name.startsWith(p.key)) || []
      }
    },
    props () {
      return {
        items: this.items
      }
    },
    lastItem () {
      return this._.last(this.items)
      // return this.items ? this.items[this.items.length - 1] : null
    }
  }
}
</script>
