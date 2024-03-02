import categoryNavigation from './categoryNavigation'
import productNavigation from './productNavigation'
import roleNavigation from './roleNavigation'
import userNavigation from './userNavigation'
import fbPixelNavigation from './fbPixelNavigation'
import customerNavigation from './customerNavigation'
import orderNavigation from './orderNavigation'

export default [
  ...userNavigation,
  ...categoryNavigation,
  ...productNavigation,
  ...customerNavigation,
  ...orderNavigation,
  ...roleNavigation,
  ...fbPixelNavigation,
]
