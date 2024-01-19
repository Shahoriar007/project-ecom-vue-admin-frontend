import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  // {
  //   header: "Leave",
  // },
  {
    title: "Leave Management",
    icon: "CalendarIcon",
    gate: permissionsConstant.Leave_MANAGEMENT_ACCESS,
    children: [
      {
        title: "Leave Types",
        route: "admin-leave-types",
        gate: permissionsConstant.LEAVE_TYPES_ACCESS,
      },
      {
        title: "Leave Requests",
        route: "admin-leave-requests",
        gate: permissionsConstant.LEAVE_REQUESTS_ACCESS,
      },
    ],
  },
];
