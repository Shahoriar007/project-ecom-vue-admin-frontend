
import {
  ROLES_ACCESS,
  ROLES_SHOW
} from "@/helpers/permissionsConstant";
export default [
    
{
    path: "/admin/roles",
    name: "admin-roles",
    component: () => import("@/views/admin/roles/RolesView.vue"),
    meta: {
      gate: ROLES_ACCESS,
      requiresAuth: true,
      pageTitle: "Roles",
      homePatch: "/admin/dashboard",
      breadcrumb: [
        {
          text: "Roles",
          active: true,
          to: "",
        },
      ],
    },
  },

  {
    path: "/admin/roles/:id",
    name: "admin-roles-permissions",
    component: () => import("@/views/admin/roles/RolePermissionsView.vue"),
    meta: {
      gate: ROLES_SHOW,
      requiresAuth: true,
      pageTitle: "Permissions",
      homePatch: "/admin/dashboard",
      breadcrumb: [
              {
                      text: "Roles",
                      active: false,
                      to: "/admin/roles",
                    },
                    {
                      text: "Permissions",
                      active: true,
                      to: "",
                    },
      ],
    },
  },
]
