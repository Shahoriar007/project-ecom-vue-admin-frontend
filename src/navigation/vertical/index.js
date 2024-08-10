import categoryNavigation from './categoryNavigation'
import childCategoryNavigation from './childCategoryNavigation'
import customerNavigation from './customerNavigation'
import masterSettingNavigation from './masterSettingNavigation'
import orderNavigation from './orderNavigation'
import productNavigation from './productNavigation'
import roleNavigation from './roleNavigation'
import subCategoryNavigation from './subCategoryNavigation'
import userNavigation from './userNavigation'

export default [
  ...userNavigation,
  ...roleNavigation,
  ...categoryNavigation,
  ...subCategoryNavigation,
  ...childCategoryNavigation,
  ...productNavigation,
  ...customerNavigation,
  ...orderNavigation,
  // ...fbPixelNavigation,
  ...masterSettingNavigation,
]
