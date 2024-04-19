import { ORDERS_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Orders',
    route: 'admin-orders',
    icon: 'UsersIcon',
    gate: ORDERS_ACCESS,
  },
]
