import { USERS_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'FbPixel',
    route: 'admin-fb-pixel',
    icon: 'BoxIcon',
    gate: USERS_ACCESS,
  },
]
