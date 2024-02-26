import { USERS_ACCESS } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/customers',
    name: 'admin-customers',
    component: () => import('@/views/admin/customer/CustomerView.vue'),
    meta: {
      gate: USERS_ACCESS,
      requiresAuth: true,
      pageTitle: 'Customers',
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
