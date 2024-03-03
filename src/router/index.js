import axios from '@/helpers/axios'
import { permissionAbility } from '@/helpers/helpers'
import { DASHBOARD_ACCESS } from '@/helpers/permissionsConstant'
import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

import authRouter from './authRouter'
import categoryRouter from './categoryRouter'
import childCategoryRouter from './childCategoryRouter'
import productRouter from './productRouter'
import roleRouter from './roleRouter'
import subCategoryRouter from './subCategoryRouter'
import usersRouter from './usersRouter'

import fbPixelRouter from './fbPixelRouter'
import customerRouter from './customerRouter'
import orderRouter from './orderRouter'
import customerHistoryRouter from './customerHistoryRouter'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/views/admin/AdminDashboardView.vue'),
      meta: {
        gate: DASHBOARD_ACCESS,
        requiresAuth: true,
        pageTitle: 'Admin Dashboard',
        homePatch: '/admin/dashboard',
        breadcrumb: [
          {
            text: 'Admin Dashboard',
            active: true,
            to: '',
          },
        ],
      },
    },
    ...usersRouter,
    ...authRouter,
    ...roleRouter,
    ...categoryRouter,
    ...subCategoryRouter,
    ...productRouter,
    ...childCategoryRouter,
    ...customerRouter,
    ...orderRouter,
    ...customerHistoryRouter,
    ...fbPixelRouter,
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// global auth guard
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters['authModule/getIsAuthenticated']

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      try {
        // get user  permission
        const resUser = await axios.post('/api/user?include=permissions')

        const { permissions } = resUser?.data?.data
        const mapPermissions = permissions?.data.map((item) => item.name)

        await store.dispatch('userModule/setPermissions', {
          permissions: mapPermissions,
        })

        // permission page
        if (to.matched.some((record) => record.meta.gate)) {
          const permissions = store.getters['userModule/getPermissions']
          if (permissionAbility(to.meta.gate, permissions)) {
            next()
          } else {
            next(false)
          }
        } else {
          next(false)
        }
      } catch (error) {
        await store.dispatch('authModule/setIsAuthenticated', {
          isAuthenticated: false,
          token: null,
        })

        await store.dispatch('authModule/clearPersistedState')

        await store.dispatch('userModule/removeUser')

        await store.dispatch('userModule/setPermissions', {
          permissions: null,
        })

        window.location.href = '/'
      }
    } else {
      next({ name: 'login' })
    }
  } else if (to.matched.some((record) => record.meta.requiresVisitor)) {
    if (isAuthenticated) {
      next({ name: 'admin-dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
