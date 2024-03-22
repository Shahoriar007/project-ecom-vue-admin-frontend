import { USERS_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Master Setting',
    route: 'admin-master-setting',
    icon: 'SettingsIcon',
    gate: USERS_ACCESS,
  },
]
