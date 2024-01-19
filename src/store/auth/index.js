import { ls } from "@/helpers/helpers";

export const authModule = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    token: null,
  },
  getters: {
    getIsAuthenticated: function (state) {
      return state.isAuthenticated;
    },
    getToken: function (state) {
      return state.token;
    },
  },
  mutations: {
    setIsAuthenticated: function (state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.token = payload.token;
    },
    clearPersistedState: function (state, payload) {
      ls.removeAll();
      ls.clear();
    },
  },
  actions: {
    setIsAuthenticated: function (context, payload) {
      context.commit("setIsAuthenticated", {
        isAuthenticated: payload.isAuthenticated,
        token: payload.token,
      });
    },
    clearPersistedState: function (context, payload) {
      context.commit("clearPersistedState");
    },
  },
};
