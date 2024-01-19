import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  // {
  //   header: "Leave",
  // },
  {
    title: "Employee Types",
    route: "admin-employee-types",
    icon: "UserIcon",
    gate: permissionsConstant.EMPLOYEE_TYPES_ACCESS,
  },
];
