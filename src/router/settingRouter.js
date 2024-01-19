import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  {
    path: "/admin/settings/general",
    name: "admin-settings-general",
    component: () => import("@/views/admin/settings/GeneralSettingView.vue"),
    meta: {
      gate: permissionsConstant.SETTINGS_ACCESS,
      requiresAuth: true,
      pageTitle: "General Setting",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "General Settings",
          active: true,
          to: "",
        },
      ],
    },
  },
];
