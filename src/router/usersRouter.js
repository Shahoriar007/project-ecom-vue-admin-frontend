
import { USERS_ACCESS } from "@/helpers/permissionsConstant";
export default [
  {
    path: "/admin/users",
    name: "admin-users",
    component: () => import("@/views/admin/users/UsersView.vue"),
    meta: {
      gate: USERS_ACCESS,
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
