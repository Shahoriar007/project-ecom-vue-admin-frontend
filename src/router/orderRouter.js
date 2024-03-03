import { USERS_ACCESS } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/views/admin/order/OrderView.vue'),
    meta: {
      gate: USERS_ACCESS,
      requiresAuth: true,
      pageTitle: 'Orders',
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
