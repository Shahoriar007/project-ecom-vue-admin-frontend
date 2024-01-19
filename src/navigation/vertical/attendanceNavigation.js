import { permissionsConstant } from "@/helpers/permissionsConstant";
import leaveNavigation from "./leaveNavigation";

export default [
  // {
  //   header: "Attendance",
  // },
  {
    title: "Attendance Management",
    icon: "ClockIcon",
    gate: permissionsConstant.ATTENDANCE_MANAGEMENT_ACCESS,
    children: [
      {
        title: "Calender",
        route: "admin-attendance-calender",
        gate: permissionsConstant.ATTENDANCE_CALENDER_ACCESS,
      },
      {
        title: "Attendance",
        route: "admin-attendance",
        gate: permissionsConstant.ATTENDANCE_ACCESS,
      },
      // {
      //   title: "Dashboard",
      //   route: "admin-roles",
      //   gate: permissionsConstant.DASHBOARD_ACCESS,
      // },
      // {
      //   title: "Operation",
      //   route: "admin-roles",
      //   gate: permissionsConstant.DASHBOARD_ACCESS,
      // },
      // {
      //   title: "Report",
      //   route: "admin-roles",
      //   gate: permissionsConstant.DASHBOARD_ACCESS,
      // },
      // {
      //   title: "Setting",
      //   route: "admin-roles",
      //   gate: permissionsConstant.DASHBOARD_ACCESS,
      // },
    ],
  },
  ...leaveNavigation,
];
