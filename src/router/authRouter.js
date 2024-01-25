export default [
    {
        path:"/",
        name:"login",
        component: () => import("@/views/auth/LoginView.vue"),
        meta: {
          pageTitle: "Login",
          requiresAuth: false,
          requiresVisitor: true,
          layout: "full",
        },
    }
]
