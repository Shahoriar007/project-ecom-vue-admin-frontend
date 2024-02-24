import categoryNavigation from "./categoryNavigation";
import childCategoryNavigation from './childCategoryNavigation';
import productNavigation from "./productNavigation";
import roleNavigation from "./roleNavigation";
import subCategoryNavigation from "./subCategoryNavigation";
import userNavigation from "./userNavigation";
export default [
  ...userNavigation,
  ...categoryNavigation,
  ...subCategoryNavigation,
  ...childCategoryNavigation,
  ...productNavigation,
  ...roleNavigation,



];
