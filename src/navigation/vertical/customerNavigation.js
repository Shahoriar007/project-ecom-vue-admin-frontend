import { USERS_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Customers',
    route: 'admin-customers',
    icon: 'UsersIcon',
    gate: USERS_ACCESS,
  },
]
