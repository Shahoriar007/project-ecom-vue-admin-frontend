export const userModule = {
  namespaced: true,
  state: {
    user: null,
    permissions: null,
  },
  getters: {
    getUser: function (state) {
      return state.user;
    },
    getPermissions: function (state) {
      return state.permissions;
    },
  },
  mutations: {
    setUser: function (state, payload) {
      state.user = payload.user;
    },
    removeUser: function (state, payload) {
      state.user = null;
    },
    setPermissions: function (state, payload) {
      state.permissions = payload.permissions;
    },
  },
  actions: {
    setUser: function (context, payload) {
      context.commit("setUser", { user: payload.user });
    },
    removeUser: function (context, payload) {
      context.commit("removeUser");
    },
    setPermissions: function (context, payload) {
      context.commit("setPermissions", {
        permissions: payload.permissions,
      });
    },
  },
};
