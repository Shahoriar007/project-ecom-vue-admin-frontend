import categoryNavigation from './categoryNavigation'
import childCategoryNavigation from './childCategoryNavigation'
import productNavigation from './productNavigation'
import roleNavigation from './roleNavigation'
import subCategoryNavigation from './subCategoryNavigation'
import userNavigation from './userNavigation'
import fbPixelNavigation from './fbPixelNavigation'
import customerNavigation from './customerNavigation'
import orderNavigation from './orderNavigation'

export default [
  ...userNavigation,
  ...roleNavigation,
  ...categoryNavigation,
  ...subCategoryNavigation,
  ...childCategoryNavigation,
  ...productNavigation,
  ...customerNavigation,
  ...orderNavigation,
  ...fbPixelNavigation,
]
