import axios from "axios";
import store from "@/store";

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  responseType: "json",
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const token = store.getters["authModule/getToken"];
    config.headers["Authorization"] = token ? `bearer ${token}` : "";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      await store.dispatch("authModule/setIsAuthenticated", {
        isAuthenticated: false,
        token: null,
      });

      await store.dispatch("authModule/clearPersistedState");

      await store.dispatch("userModule/removeUser");

      await store.dispatch("userModule/setPermissions", {
        permissions: null,
      });

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
