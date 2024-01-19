import Vue from "vue";
import { ToastPlugin, ModalPlugin } from "bootstrap-vue";
import VueCompositionAPI from "@vue/composition-api";
import VueMoment from "vue-moment";

import router from "./router";
import store from "./store";
import App from "./App.vue";
import { permissionAbility } from "@/helpers/helpers";

// Global Components
import "./global-components";

// 3rd party plugins
import "@/libs/portal-vue";
import "@/libs/toastification";
import "@/libs/sweet-alerts";
import "@/libs/vue-select";

// helpers
import axios from "@/helpers/axios";

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);

// Composition API
Vue.use(VueCompositionAPI);

// global filter
// time formatter
Vue.use(VueMoment);

// global axios
Vue.prototype.$api = axios;
// permissionAbility
Vue.prototype.$permissionAbility = permissionAbility;

// import core styles
require("@core/scss/core.scss");

// import assets styles
require("@/assets/scss/style.scss");

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
