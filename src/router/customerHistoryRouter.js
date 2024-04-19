import { CUSTOMERS_SHOW } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/customer/:id/history',
    name: 'admin-customer-history',
    component: () => import('@/views/admin/customer/CustomerHistoryView.vue'),
    meta: {
      gate: CUSTOMERS_SHOW,
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
