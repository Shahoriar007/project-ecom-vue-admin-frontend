import { CATEGORIES_ACCESS } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/master-setting',
    name: 'admin-master-setting',
    component: () =>
      import('@/views/admin/masterSetting/masterSettingView.vue'),
    meta: {
      gate: CATEGORIES_ACCESS,
      requiresAuth: true,
      pageTitle: 'Master Setting',
      homePatch: '/admin/dashboard',
      breadcrumb: [
        {
          text: 'Master Setting',
          active: true,
          to: '',
        },
      ],
    },
  },
]
