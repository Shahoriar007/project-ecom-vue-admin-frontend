import { CATEGORIES_ACCESS } from "@/helpers/permissionsConstant";

export default [

  {
    title: "Parent Categories",
    route: "admin-categories",
    icon: "BoxIcon",
    gate: CATEGORIES_ACCESS,
  },
];

