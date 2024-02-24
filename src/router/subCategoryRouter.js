
import { CATEGORIES_ACCESS } from "@/helpers/permissionsConstant";
export default [
  {
    path: "/admin/sub-categories",
    name: "admin-sub-categories",
    component: () => import("@/views/admin/sub_category/SubCategoryView.vue"),
    meta: {
      gate: CATEGORIES_ACCESS,
      requiresAuth: true,
      pageTitle: "Sub Category",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Sub Categories",
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
