import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import { permissionAbility } from "@/helpers/helpers";
import { permissionsConstant } from "@/helpers/permissionsConstant";
import attendanceRouter from "./attendanceRouter";
import leaveRouter from "./leaveRouter";
import employeeRouter from "./employeeRouter";
import settingRouter from "./settingRouter";
import axios from "@/helpers/axios";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  // base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: () => import("@/views/admin/AdminDashboardView.vue"),
      meta: {
        gate: permissionsConstant.DASHBOARD_ACCESS,
        requiresAuth: true,
        pageTitle: "Admin Dashboard",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Admin Dashboard",
            active: true,
            to: "",
          },
        ],
      },
    },
    {
      path: "/admin/users",
      name: "admin-users",
      component: () => import("@/views/admin/users/UsersView.vue"),
      meta: {
        gate: permissionsConstant.USERS_ACCESS,
        requiresAuth: true,
        pageTitle: "Users",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Users",
            active: true,
            to: "",
          },
        ],
      },
    },
    {
      path: "/admin/user/profile",
      name: "user-profile",
      component: () => import("@/views/admin/profile/ProfileView.vue"),
      meta: {
        gate: permissionsConstant.USERS_PROFILE_SHOW,
        requiresAuth: true,
        pageTitle: "Profile",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Profile",
            active: true,
            to: "",
          },
        ],
      },
    },
    {
      path: "/admin/roles",
      name: "admin-roles",
      component: () => import("@/views/admin/roles/RolesView.vue"),
      meta: {
        gate: permissionsConstant.ROLES_ACCESS,
        requiresAuth: true,
        pageTitle: "Roles",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Roles",
            active: true,
            to: "",
          },
        ],
      },
    },
    {
      path: "/admin/roles/:id",
      name: "admin-roles-permissions",
      component: () => import("@/views/admin/roles/RolePermissionsView.vue"),
      meta: {
        gate: permissionsConstant.ROLES_SHOW,
        requiresAuth: true,
        pageTitle: "Permissions",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Roles",
            active: false,
            to: "/admin/roles",
          },
          {
            text: "Permissions",
            active: true,
            to: "",
          },
        ],
      },
    },
    ...employeeRouter,
    {
      path: "/admin/designation",
      name: "admin-designation",
      component: () => import("@/views/admin/designation/DesignationView.vue"),
      meta: {
        gate: permissionsConstant.DESIGNATION_ACCESS,
        requiresAuth: true,
        pageTitle: "Designation",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Designation",
            active: true,
            to: "",
          },
        ],
      },
    },

    {
      path: "/admin/division",
      name: "admin-division",
      component: () => import("@/views/admin/division/DivisionView.vue"),
      meta: {
        gate: permissionsConstant.DIVISION_ACCESS,
        requiresAuth: true,
        pageTitle: "Division",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Division",
            active: true,
            to: "",
          },
        ],
      },
    },
    {
      path: "/admin/department",
      name: "admin-department",
      component: () => import("@/views/admin/department/DepartmentView.vue"),
      meta: {
        gate: permissionsConstant.DEPARTMENT_ACCESS,
        requiresAuth: true,
        pageTitle: "Department",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Department",
            active: true,
            to: "",
          },
        ],
      },
    },
    {
      path: "/admin/department/:id",
      name: "admin-department-details",
      component: () =>
        import("@/views/admin/department/DepartmentDetailsView.vue"),
      meta: {
        gate: permissionsConstant.DEPARTMENT_SHOW,
        requiresAuth: true,
        pageTitle: "Department Details",
        homePatch: "/admin/dashboard",
        breadcrumb: [
          {
            text: "Department",
            active: false,
            to: "/admin/department",
          },
          {
            text: "Department Details",
            active: true,
            to: "",
          },
        ],
      },
    },
    ...attendanceRouter,
    ...leaveRouter,
    ...settingRouter,
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        requiresAuth: false,
        requiresVisitor: true,
        layout: "full",
      },
    },
    {
      path: "/error-404",
      name: "error-404",
      component: () => import("@/views/error/Error404.vue"),
      meta: {
        layout: "full",
      },
    },
    {
      path: "*",
      redirect: "error-404",
    },
  ],
});

// global auth guard
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters["authModule/getIsAuthenticated"];

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      try {
        // get user  permission
        const resUser = await axios.post("/api/user?include=permissions");

        const { permissions } = resUser?.data?.data;
        const mapPermissions = permissions?.data.map((item) => item.name);

        await store.dispatch("userModule/setPermissions", {
          permissions: mapPermissions,
        });

        // permission page
        if (to.matched.some((record) => record.meta.gate)) {
          const permissions = store.getters["userModule/getPermissions"];
          if (permissionAbility(to.meta.gate, permissions)) {
            next();
          } else {
            next(false);
          }
        } else {
          next(false);
        }
      } catch (error) {
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
    } else {
      next({ name: "login" });
    }
  } else if (to.matched.some((record) => record.meta.requiresVisitor)) {
    if (isAuthenticated) {
      next({ name: "admin-dashboard" });
    } else {
      next();
    }
  } else {
    next();
  }
});

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
