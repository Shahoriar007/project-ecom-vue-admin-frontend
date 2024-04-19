import { FB_PIXEL_ACCESS } from '@/helpers/permissionsConstant'

export default [
  {
    title: 'FbPixel',
    route: 'admin-fb-pixel',
    icon: 'BoxIcon',
    gate: FB_PIXEL_ACCESS,
  },
]
