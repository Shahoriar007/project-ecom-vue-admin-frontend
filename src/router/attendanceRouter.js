import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  {
    path: "/admin/attendance",
    name: "admin-attendance",
    component: () => import("@/views/admin/attendance/AttendanceView.vue"),
    meta: {
      gate: permissionsConstant.ATTENDANCE_ACCESS,
      requiresAuth: true,
      pageTitle: "Attendance",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Attendance",
          active: true,
          to: "",
        },
      ],
    },
  },
  {
    path: "/admin/attendance/calender",
    name: "admin-attendance-calender",
    component: () =>
      import("@/views/admin/attendance/AttendanceCalenderView.vue"),
    meta: {
      gate: permissionsConstant.ATTENDANCE_CALENDER_ACCESS,
      requiresAuth: true,
      pageTitle: "Attendance Calender",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Attendance Calender",
          active: true,
          to: "",
        },
      ],
    },
  },
  {
    path: "/admin/attendance/:id",
    name: "admin-attendance-details",
    component: () =>
      import("@/views/admin/attendance/AttendanceDetailsView.vue"),
    meta: {
      gate: permissionsConstant.ATTENDANCE_SHOW,
      requiresAuth: true,
      pageTitle: "Attendance Details",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Attendance",
          active: false,
          to: "/admin/attendance",
        },
        {
          text: "Attendance Details",
          active: true,
          to: "",
        },
      ],
    },
  },
];
