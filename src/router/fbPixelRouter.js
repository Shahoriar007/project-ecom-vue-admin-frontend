import { CATEGORIES_ACCESS } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/fb-pixel',
    name: 'admin-fb-pixel',
    component: () => import('@/views/admin/fbPixel/FbPixelView.vue'),
    meta: {
      gate: CATEGORIES_ACCESS,
      requiresAuth: true,
      pageTitle: 'FbPixel',
      homePatch: '/admin/dashboard',
      breadcrumb: [
        {
          text: 'FbPixel',
          active: true,
          to: '',
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
