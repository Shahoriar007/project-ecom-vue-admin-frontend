import { USERS_ACCESS } from "@/helpers/permissionsConstant";

export default [
 
  {
    title: "Categories",
    route: "admin-categories",
    icon: "BoxIcon",
    gate: USERS_ACCESS,
  },
];
