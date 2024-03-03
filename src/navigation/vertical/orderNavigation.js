import { USERS_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Orders',
    route: 'admin-orders',
    icon: 'UsersIcon',
    gate: USERS_ACCESS,
  },
]
