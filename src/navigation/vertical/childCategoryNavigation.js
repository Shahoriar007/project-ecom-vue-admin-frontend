import { CHILD_CATEGORIES_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'Child Categories',
    route: 'admin-child-categories',
    icon: 'BoxIcon',
    gate: CHILD_CATEGORIES_ACCESS,
  },
]
