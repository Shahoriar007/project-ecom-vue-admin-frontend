import { ROLES_ACCESS } from "@/helpers/permissionsConstant";

export default [
 
    {
        title: "Roles & Permission",
        route: "admin-roles",
        icon: "UserCheckIcon",
        gate: ROLES_ACCESS,
      },
];
