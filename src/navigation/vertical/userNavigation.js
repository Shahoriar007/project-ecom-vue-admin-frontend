import { USERS_ACCESS } from "@/helpers/permissionsConstant";

export default [
 
    {
        title: "Users",
        route: "admin-users",
        icon: "UsersIcon",
        gate: USERS_ACCESS,
      },
];
