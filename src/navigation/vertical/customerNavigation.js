import { CUSTOMERS_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Customers',
    route: 'admin-customers',
    icon: 'UsersIcon',
    gate: CUSTOMERS_ACCESS,
  },
]
