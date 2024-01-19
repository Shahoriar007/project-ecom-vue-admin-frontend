import { permissionsConstant } from "@/helpers/permissionsConstant";

export default [
  // {
  //   header: "Leave",
  // },
  {
    title: "Settings",
    icon: "SettingsIcon",
    gate: permissionsConstant.SETTINGS_ACCESS,
    children: [
      {
        title: "General",
        route: "admin-settings-general",
        gate: permissionsConstant.SETTINGS_GENERAL_ACCESS,
      },
    ],
  },
];
