import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  {
    path: "/admin/employee/types",
    name: "admin-employee-types",
    component: () => import("@/views/admin/employee/EmployeeTypesView.vue"),
    meta: {
      gate: permissionsConstant.EMPLOYEE_TYPES_ACCESS,
      requiresAuth: true,
      pageTitle: "Employee Types",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Employee Types",
          active: true,
          to: "",
        },
      ],
    },
  },
];
