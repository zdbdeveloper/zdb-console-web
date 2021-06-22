<template>
  <CSidebar
    :minimize="sidebarMinimize"
    :show="sidebarShow"
    @update:show="setSidebarShow"
  >
    <!--TODO : image logo change-->
    <CSidebarBrand class="d-md-down-none" to="/">
      <img
        class="c-sidebar-brand-full"
        src="/img/brand/logo.png"
        width="138"
        height="25"
        alt="Cloud Z CP Logo"
      />
      <img
        class="c-sidebar-brand-minimized"
        src="/img/brand/sygnet.png"
        width="22"
        height="25"
        alt="Cloud Z CP Logo"
      />
    </CSidebarBrand>
    <div
      v-if="dropdowns.show"
      class="c-side-dropdown-nav"
      @click="showDownMenu = !showDownMenu"
    >
      <button type="button" :class="{ active: showDownMenu }">
        <span class="txt">
          {{ dropdowns.selected._label }}
        </span>
      </button>
      <ul>
        <template v-for="item in dropdowns.tail">
          <li :key="item.name">
            <CLink :to="`/projects/${item.key}/datastores`">
              {{ item._label }}
            </CLink>
          </li>
        </template>
        <!-- <li>
          <CLink to="/home/projects">
            New Project
          </CLink>
        </li> -->
      </ul>
    </div>
    <!-- Menus -->
    <CSidebarNav>
      <template v-for="(items, k) in _.groupBy(sideMenus, 'category')">
        <!-- Main Menu -->
        <CSidebarNavItem
          v-if="_.size(items) === 1 && !!items[0].link"
          :key="k"
          v-bind="navItemProps(items[0])"
        />
        <!-- Menu Group -->
        <CSidebarNavDropdown
          v-else-if="_.size(items) > 1"
          :key="k"
          v-bind="{ ...navItemProps(items[0]), show: shwoNavDropdown(items) }"
        >
          <CSidebarNavItem
            v-for="item in _.tail(items)"
            :key="item.title"
            v-bind="navItemProps(item, false)"
          />
        </CSidebarNavDropdown>
      </template>
    </CSidebarNav>

    <CLink
      v-if="areaButton.show"
      class="c-side-block-button"
      :to="areaButton.to"
    >
      <span>{{ areaButton.label }}</span>
    </CLink>
    <CSidebarMinimizer
      class="c-d-md-down-none"
      @click.native="toggleSidebarMinimize"
    />
  </CSidebar>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { profile } from "~/mixins";

const Icons = {
  dashboard: { icon: "cil-speedometer" },
  clusters: { icon: "cib-kubernetes" },
  applications: { icon: "cib-docker" },
  "deployment groups": { icon: "cil-applications" },
  "dev tools": { icon: "cil-calculator" },
  monitoring: { icon: "cil-monitor" },
  logging: { icon: "cil-spreadsheet" },
  workloads: { icon: "cil-blur-circular" },
  networking: { icon: "cil-lan" },
  storages: { icon: "cil-storage" },
  administrator: { icon: "cil-settings" },
  system: { icon: "cil-settings" },
  projects: { icon: "cil-featured-playlist" },
  tools: { icon: "cil-calculator" },
  users: { icon: "cil-people" },
  groups: { icon: "cil-sitemap" },
  roles: { icon: "cil-asterisk-circle" },
  platform: { icon: "cil-applications-settings" },
  components: { icon: "cil-applications-settings" },
  datastores: { icon: "cib-docker" },
}

const sideMenus = [
  {
    index: 101,
    title: "Dashboard",
    category: "dashboard",
    link: "/system/dashboard",
    target: "_self",
    mainMenu: "",
    subMenu: "Dashboard"
  },
  {
    index: 201,
    title: "Clusters",
    category: "cluster",
    link: "/system/clusters",
    target: "_self",
    mainMenu: "",
    subMenu: "Clusters"
  },
  {
    index: 202,
    title: "subCluster",
    category: "cluster",
    link: "/system/clusters",
    target: "_self",
    mainMenu: "",
    subMenu: "Clusters"
  },
  {
    index: 301,
    title: "Components",
    category: "components",
    link: "/components",
    target: "_self",
    mainMenu: "",
    subMenu: "Components"
  },
  {
    index: 302,
    title: "Components",
    category: "components",
    link: "/components/components",
    target: "_self",
    mainMenu: "",
    subMenu: "Components"
  },
  {
    index: 400,
    title: "Datastores",
    category: "datastores",
    link: "/projects/pjt1/datastores",
    target: "_self",
    mainMenu: "",
    subMenu: ""
  },  
]
export default {
  name: "TheSidebar",
  mixins: [profile],
  data() {
    return {
      sideMenus,
      showDownMenu: false,
      dropdowns: {
        selected: {},
        tail: [],
        show: false
      },
      areaButton: {
        label: "",
        to: "",
        show: false
      }
    };
  },
  computed: {
    ...mapState(["sidebarShow", "sidebarMinimize"]),
    area() {
      // Not Initialized (area == null)
      if (!this.realm) {
        return null;
      }

      // No Permissions (area == '')
      const { _ } = this;
      const { path } = this.$route;
      const rules = [
        [new RegExp("^/projects/.*$"), "project"],
        [new RegExp("^/system/.*$"), "system"]
      ];
      const matched = _.find(rules, rule => rule[0].test(path));
      return matched ? matched[1] : "";
    }
  },
  watch: {
    area(value) {
      this.loadMenus();
    },
    project(newValue, oldValue) {
      console.debug("[layouts/TheSidevar.vue] - ", newValue, oldValue);
      !this._.isEmpty(newValue) && this.loadMenus();
    },
    showDownMenu(value) {
      this.loadMenus()
    }
  },
  methods: {
    // for Botton Actions
    setSidebarShow(value) {
      this.$store.dispatch("set", ["sidebarShow", value]);
    },
    toggleSidebarMinimize() {
      this.$store.dispatch("toggle", "sidebarMinimize");
    },
    hideSidebar() {
      const show = !this._.isEmpty(this.sideMenus);
      this.setSidebarShow(show);
    },
    // for Area Rendering Data
    loadMenus(value) {
      const { realm, project, area } = this;
      if (!area) {
        return this.hideSidebar();
      }

      this.dropdowns = this.updateDropdowns();
      this.areaButton = this.updateAreaButton();
      // this.menus
      //   .searchSideMenus({ realm, project, tags: area })
      //   .then(() => this.hideSidebar());
    },
    updateDropdowns() {
      const { area, _ } = this;
      const rules = {
        project: {
          items: this.projects,
          key: this.project
        },
        system: {
          // items: this.realms,
          // key: this.realm
        }
      };

      // normalize
      const rule = rules[area] || {};
      const items = _.map(rule.items, e => {
        return { ...e, _label: e.displayName || e.name || "-" };
      });
      //const selected = _(items).filter({ key: rule.key }).head() || {};
      const selected = (items.filter(item => item.key == location.pathname.split('/')[2]))[0] || {}
      const tail = _.without(items, selected);
      const show = !_.isEmpty(items);
      return {
        selected,
        tail,
        show
      };
    },
    updateAreaButton() {
      const { area, _ } = this;
      const rules = {
        project: {
          label: "System Administrator",
          to: "/system/dashboard",
          show: () => !_.isEmpty(this.user.realmRoles)
        },
        system: {
          label: "Project Menus",
          to: "/",
          // show: () => !_.isEmpty(this.projects)
          show: () => true
        }
      };

      const matched = rules[area] || {};
      const show = !_.isEmpty(matched) && matched.show();
      return { ...matched, show };
    },
    // for Menus
    navItemProps(item, showIcon = true) {
      /*
       * https://router.vuejs.org/kr/api/#exact
       * https://github.com/coreui/coreui-vue/blob/master/src/components/template/CSidebarNavItem.vue#L32
       */
      const icons = (showIcon && Icons[item.title.toLowerCase()]) || {};
      const key = item.target === "_blank" ? "href" : "to";
      return {
        name: item.title,
        [key]: item.link,
        target: item.target,
        exact: false,
        ...icons
      };
    },
    shwoNavDropdown(items) {
      // console.log(item && item.link, this.$route.path)
      const { path } = this.$route;
      const _ = this._;
      const show = _.find(items, i => {
        const ret = !_.isEmpty(i.link) && path.startsWith(i.link);
        console.debug("sidemenu.dropdown :: ", {
          path,
          link: i.link,
          show: ret
        });
        return ret;
      });
      return !this._.isEmpty(show);
    }
  }
};
</script>
