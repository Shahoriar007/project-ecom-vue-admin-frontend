import { PRODUCTS_ACCESS } from "@/helpers/permissionsConstant";
export default [
  {
    path: "/admin/products",
    name: "admin-products",
    component: () => import("@/views/admin/product/ProductView.vue"),
    meta: {
      gate: PRODUCTS_ACCESS,
      requiresAuth: true,
      pageTitle: "Product",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Products",
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
