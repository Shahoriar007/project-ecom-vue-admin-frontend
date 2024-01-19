import Vue from "vue";
import Vuex from "vuex";

// Modules
import app from "./app";
import appConfig from "./app-config";
import verticalMenu from "./vertical-menu";
import { authModule } from "./auth";
import { userModule } from "./user";

// vuex-persistedstate
import createPersistedState from "vuex-persistedstate";
import { ls } from "@/helpers/helpers";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.DEV,
  modules: {
    app,
    appConfig,
    verticalMenu,
    authModule,
    userModule,
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});
