import { ORDERS_ACCESS, ORDERS_SHOW } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/views/admin/order/OrderView.vue'),
    meta: {
      gate: ORDERS_ACCESS,
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

  {
    path: '/admin/orders/:id',
    name: 'admin-orders-view',
    component: () => import('@/views/admin/order/OrderDetails.vue'),
    meta: {
      gate: ORDERS_SHOW,
      requiresAuth: true,
      pageTitle: 'Order Details',
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
