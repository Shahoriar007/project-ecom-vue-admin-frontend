import { CATEGORIES_ACCESS } from "@/helpers/permissionsConstant";

export default [

  {
    title: "Sub Categories",
    route: "admin-sub-categories",
    icon: "BoxIcon",
    gate: CATEGORIES_ACCESS,
  },
];

