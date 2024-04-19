import { SUB_CATEGORIES_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Sub Categories',
    route: 'admin-sub-categories',
    icon: 'BoxIcon',
    gate: SUB_CATEGORIES_ACCESS,
  },
]
