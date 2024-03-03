import { CATEGORIES_ACCESS } from "@/helpers/permissionsConstant";

export default [

    {
        title: "Child Categories",
        route: "admin-child-categories",
        icon: "BoxIcon",
        gate: CATEGORIES_ACCESS,
    },
];

