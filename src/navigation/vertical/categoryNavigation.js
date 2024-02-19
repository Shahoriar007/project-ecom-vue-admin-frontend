import { CATEGORIES_ACCESS } from "@/helpers/permissionsConstant";

export default [

  {
    title: "Categories",
    route: "admin-categories",
    icon: "BoxIcon",
    gate: CATEGORIES_ACCESS,
  },
];
