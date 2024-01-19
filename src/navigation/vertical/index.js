import { permissionsConstant } from "@/helpers/permissionsConstant";
import attendanceNavigation from "./attendanceNavigation";
import employeeNavigation from "./employeeNavigation";
import settingNavigation from "./settingNavigation";

export default [
  {
    title: "Dashboard",
    route: "admin-dashboard",
    icon: "HomeIcon",
    gate: permissionsConstant.DASHBOARD_ACCESS,
  },
  {
    title: "Division",
    route: "admin-division",
    icon: "BoxIcon",
    gate: permissionsConstant.DIVISION_ACCESS,
  },
  {
    title: "Department",
    route: "admin-department",
    icon: "PackageIcon",
    gate: permissionsConstant.DEPARTMENT_ACCESS,
  },
  {
    title: "Roles",
    route: "admin-roles",
    icon: "UserCheckIcon",
    gate: permissionsConstant.ROLES_ACCESS,
  },
  {
    title: "Users",
    route: "admin-users",
    icon: "UsersIcon",
    gate: permissionsConstant.USERS_ACCESS,
  },
  ...employeeNavigation,
  {
    title: "Designation",
    route: "admin-designation",
    icon: "AwardIcon",
    gate: permissionsConstant.DESIGNATION_ACCESS,
  },
  ...attendanceNavigation,
  ...settingNavigation,
];
