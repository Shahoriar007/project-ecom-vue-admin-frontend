import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  {
    path: "/admin/leave/types",
    name: "admin-leave-types",
    component: () => import("@/views/admin/leave/LeaveTypesView.vue"),
    meta: {
      gate: permissionsConstant.LEAVE_TYPES_ACCESS,
      requiresAuth: true,
      pageTitle: "Leave Types",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Leave Types",
          active: true,
          to: "",
        },
      ],
    },
  },
  {
    path: "/admin/leave/requests",
    name: "admin-leave-requests",
    component: () => import("@/views/admin/leave/LeaveRequestsView.vue"),
    meta: {
      gate: permissionsConstant.LEAVE_REQUESTS_ACCESS,
      requiresAuth: true,
      pageTitle: "Leave Requests",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Leave Requests",
          active: true,
          to: "",
        },
      ],
    },
  },
];
