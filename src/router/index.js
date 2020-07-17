import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase'

function lazyLoad(view){
  return() => import(`@/views/${view}.vue`)
}

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: lazyLoad('Dashboard'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: lazyLoad('Login'),
  },
  {
    path: '/daftar',
    name: 'SignUp',
    component: lazyLoad('SignUp'),
  },
  {
    path: '/lupapassword',
    name: 'ResetPassword',
    component: lazyLoad('ResetPassword'),
  },
  {
    path: '/profil',
    name: 'Profile',
    component: lazyLoad('Profile'),
  },
  {
    path: '/calonsiswa',
    name: 'Applicants',
    component: lazyLoad('Applicants'),
  },
  {
    path: '/calonsiswa/:id',
    name: 'Applicant',
    props: true,
    component: lazyLoad('Applicant'),
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
