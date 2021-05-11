import Vue from "vue";
import CoreuiVue from "@coreui/vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import VueClipboard from "vue-clipboard2";
import { iconsSet as icons } from "@/assets/icons/icons.js";
import "@/assets/icons/iconsFontAwesome.js";
// https://vue-select.org/guide/install.html#yarn-npm
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import VTooltip from "v-tooltip";
import VueApexCharts from "vue-apexcharts";

Vue.use(CoreuiVue);
Vue.use(VTooltip);
Vue.use((vm, options) => {
  vm.options.icons = icons;
});
Vue.use(VueClipboard);
Vue.use(VueApexCharts);

Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("v-select", vSelect);
Vue.component("multiselect", Multiselect);
Vue.component("apexchart", VueApexCharts);
