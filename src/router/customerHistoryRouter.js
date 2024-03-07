import { USERS_ACCESS } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/customer/:id/history',
    name: 'admin-customer-history',
    component: () => import('@/views/admin/customer/CustomerHistoryView.vue'),
    meta: {
      gate: USERS_ACCESS,
      requiresAuth: true,
      pageTitle: 'Customer History',
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
