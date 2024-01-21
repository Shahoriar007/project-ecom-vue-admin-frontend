import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  {
    title: "Users",
    route: "admin-users",
    icon: "UsersIcon",
    gate: permissionsConstant.USERS_ACCESS,
  },
  // {
  //   title: "Dashboard",
  //   route: "admin-dashboard",
  //   icon: "HomeIcon",
  //   gate: permissionsConstant.DASHBOARD_ACCESS,
  // },

  {
    title: "Roles & Permission",
    route: "admin-roles",
    icon: "UserCheckIcon",
    gate: permissionsConstant.ROLES_ACCESS,
  },

 

];
