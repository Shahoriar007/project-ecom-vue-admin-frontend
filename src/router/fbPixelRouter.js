import { FB_PIXEL_ACCESS } from '@/helpers/permissionsConstant'
export default [
  {
    path: '/admin/fb-pixel',
    name: 'admin-fb-pixel',
    component: () => import('@/views/admin/fbPixel/FbPixelView.vue'),
    meta: {
      gate: FB_PIXEL_ACCESS,
      requiresAuth: true,
      pageTitle: 'FbPixel',
      homePatch: '/admin/dashboard',
      breadcrumb: [
        {
          text: 'FbPixel',
          active: true,
          to: '',
        },
      ],
    },
  },
]
