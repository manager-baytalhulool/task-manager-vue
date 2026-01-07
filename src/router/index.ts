import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'

/* layouts */
import AuthLayout from '@/layouts/AuthLayout.vue'
import MasterLayout from '@/layouts/MasterLayout.vue'

/* stores */
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'

/* auth views */
import LoginView from '@/views/auth/LoginView.vue'

/* views */
import HomeView from '@/views/HomeView.vue'
import TasksView from '@/views/tasks/TasksView.vue'

let isInitiated: boolean = false

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      component: AuthLayout,

      children: [
        {
          path: 'login',
          component: LoginView,
          meta: {
            layout: 'auth',
          },
        },
        // {
        //   path: 'register',
        //   component: RegisterView,
        //   meta: {
        //     layout: 'auth'
        //   }
        // },
        // {
        //   path: 'forgot-password',
        //   component: ForgotPasswordView,
        //   meta: {
        //     layout: 'auth'
        //   }
        // },
        // {
        //   path: 'reset-password/:token',
        //   component: ResetPasswordView,
        //   meta: {
        //     layout: 'auth'
        //   }
        // }
      ],
    },
    {
      path: '/',
      component: MasterLayout,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: '',
          name: 'home.index',
          component: HomeView,
        },
        {
          path: 'tasks',
          children: [
            {
              path: '',
              name: 'tasks.index',
              component: TasksView,
            },
            // {
            //   path: 'create',
            //   name: 'tasks.create',
            //   component: ProductFormView
            // },
            // {
            //   path: ':id',
            //   name: 'tasks.show',
            //   component: ProductView
            // },
            // {
            //   path: ':id/edit',
            //   name: 'products.edit',
            //   component: ProductFormView
            // },
            // {
            //   path: ':id/barcode',
            //   name: 'products.barcode',
            //   component: ProductBarcodeView
            // }
          ],
        },
      ],
    },
  ],
})

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
  const appStore = useAppStore()
  const authStore = useAuthStore()

  if (!isInitiated) {
    await authStore.getUser()
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      // appStore.setAppLoading(false)
      next(`/auth/login`)
    } else {
      // appStore.setAppLoading(false)
      next()
    }
  } else {
    // appStore.setAppLoading(false)
    next()
  }

  if (!isInitiated) {
    appStore.setAppLoading(false)
    isInitiated = true
  }
})

export default router
