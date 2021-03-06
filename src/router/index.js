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
    path: '/loginadmin',
    name: 'LoginAdmin',
    component: lazyLoad('LoginAdmin'),
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
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/calonsiswa',
    name: 'Applicants',
    component: lazyLoad('Applicants'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/calonsiswa/:id',
    name: 'Applicant',
    props: true,
    component: lazyLoad('Applicant'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/nilaites',
    name: 'TestScores',
    component: lazyLoad('TestScores'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/lulustes',
    name: 'Graduates',
    component: lazyLoad('Graduates'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/spp',
    name: 'Tuitions',
    component: lazyLoad('Tuitions'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/kelas',
    name: 'Groups',
    component: lazyLoad('Groups'),
    meta: {
      requiresAuth: true
    }
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
