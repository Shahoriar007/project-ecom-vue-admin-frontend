import { USERS_SHOW } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/user/:id/activity',
    name: 'admin-user-activity',
    component: () => import('@/views/admin/users/UserActivityView.vue'),
    meta: {
      gate: USERS_SHOW,
      requiresAuth: true,
      pageTitle: 'User Activities',
      homePatch: '/admin/dashboard',
      breadcrumb: [
        {
          text: 'Users',
          active: true,
          to: '',
        },
      ],
    },
  },
]
