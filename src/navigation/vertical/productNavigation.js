import { PRODUCTS_ACCESS } from "@/helpers/permissionsConstant";

export default [

  {
    title: "Products",
    route: "admin-products",
    icon: "PackageIcon",
    gate: PRODUCTS_ACCESS,
  },
];
