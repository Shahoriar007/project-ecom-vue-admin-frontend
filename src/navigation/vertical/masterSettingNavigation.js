import { MASTER_SETTINGS_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Master Setting',
    route: 'admin-master-setting',
    icon: 'SettingsIcon',
    gate: MASTER_SETTINGS_ACCESS,
  },
]
