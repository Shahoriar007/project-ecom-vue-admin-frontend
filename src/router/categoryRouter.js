
import { CATEGORIES_ACCESS } from "@/helpers/permissionsConstant";
export default [
  {
    path: "/admin/categories",
    name: "admin-categories",
    component: () => import("@/views/admin/category/CategoryView.vue"),
    meta: {
      gate: CATEGORIES_ACCESS,
      requiresAuth: true,
      pageTitle: "Category",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Categories",
          active: true,
          to: "",
        },
      ],
    },
  },
  // {
  //   path: "/admin/user/profile",
  //   name: "user-profile",
  //   component: () => import("@/views/admin/profile/ProfileView.vue"),
  //   meta: {
  //     gate: permissionsConstant.USERS_PROFILE_SHOW,
  //     requiresAuth: true,
  //     pageTitle: "Profile",
  //     homePatch: "/admin/dashboard",
  //     breadcrumb: [
  //       {
  //         text: "Profile",
  //         active: true,
  //         to: "",
  //       },
  //     ],
  //   },
  // },
]
