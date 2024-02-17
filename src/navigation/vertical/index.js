import categoryNavigation from './categoryNavigation'
import productNavigation from './productNavigation'
import roleNavigation from './roleNavigation'
import userNavigation from './userNavigation'
import fbPixelNavigation from './fbPixelNavigation'
export default [
  ...userNavigation,
  ...categoryNavigation,
  ...productNavigation,
  ...roleNavigation,
  ...fbPixelNavigation,
]
