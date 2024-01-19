export const divisionsModule = {
  namespaced: true,
  state: {
    divisions: null,
  },
  getters: {
    getDivisions: function (state) {
      return state.divisions;
    },
  },
  mutations: {
    setDivisions: function (state, payload) {
      state.divisions = payload.divisions;
    },
    removeDivisions: function (state, payload) {
      state.divisions = null;
    },
  },
  actions: {
    setDivisions: function (context, payload) {
      context.commit("setDivisions", { divisions: payload.divisions });
    },
    removeDivisions: function (context, payload) {
      context.commit("removeDivisions");
    },
  },
};
