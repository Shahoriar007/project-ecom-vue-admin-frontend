
import { CATEGORIES_ACCESS } from "@/helpers/permissionsConstant";
export default [
  {
    path: "/admin/child-categories",
    name: "admin-child-categories",
    component: () => import("@/views/admin/child_category/ChildCategoryView.vue"),
    meta: {
      gate: CATEGORIES_ACCESS,
      requiresAuth: true,
      pageTitle: "Child Category",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Child Categories",
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
